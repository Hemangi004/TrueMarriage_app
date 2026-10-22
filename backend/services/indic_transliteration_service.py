import asyncio
import logging
import re
from typing import Dict, List, Optional
import httpx

logger = logging.getLogger("backend.services.indic_transliteration")

# Mapping of standard 2-letter ISO language codes to Google Input Tools Indic codes
INDIC_ITC_MAP: Dict[str, str] = {
    "hi": "hi-t-i0-und",      # Hindi (Devanagari)
    "mr": "mr-t-i0-und",      # Marathi (Devanagari)
    "gu": "gu-t-i0-und",      # Gujarati
    "bn": "bn-t-i0-und",      # Bengali
    "ta": "ta-t-i0-und",      # Tamil
    "te": "te-t-i0-und",      # Telugu
    "kn": "kn-t-i0-und",      # Kannada
    "ml": "ml-t-i0-und",      # Malayalam
    "pa": "pa-t-i0-und",      # Punjabi (Gurmukhi)
    "or": "or-t-i0-und",      # Odia
    "ur": "ur-t-i0-und",      # Urdu
    "as": "as-t-i0-und",      # Assamese
    "ne": "ne-t-i0-und",      # Nepali
    "sa": "sa-t-i0-und",      # Sanskrit
}

# In-memory LRU cache: (clean_text, target_lang) -> transliterated
_transliteration_cache: Dict[str, str] = {}
_MAX_CACHE_SIZE = 5000


async def fetch_indic_candidates(client: httpx.AsyncClient, text: str, itc: str) -> List[str]:
    """Queries the Google Input Tools Indic Transliteration API for phonetic candidates."""
    try:
        url = "https://inputtools.google.com/request"
        params = {
            "text": text,
            "itc": itc,
            "num": 8,
            "cp": 0,
            "cs": 1,
            "ie": "utf-8",
            "oe": "utf-8",
            "app": "truemarriage_transliteration",
        }
        resp = await client.get(url, params=params, timeout=4.0)
        if resp.status_code == 200:
            data = resp.json()
            if data and len(data) > 1 and data[1] and len(data[1]) > 0:
                item = data[1][0]
                if len(item) > 1 and isinstance(item[1], list):
                    return [str(c) for c in item[1] if c]
    except Exception as e:
        logger.debug(f"Google Input Tools query failed for '{text}': {e}")
    return []


def filter_english_loanwords(candidates: List[str]) -> List[str]:
    """
    Filters out candidates with English loan-vowel marks (e.g. Devanagari candra E \u0945 as in पॅरिस,
    or candra O \u0949). Traditional Indian names and surnames do not use candra E/O.
    """
    clean = []
    for c in candidates:
        if "\u0945" in c or "\u0949" in c or "पॅ" in c or "پیرس" in c:
            continue
        clean.append(c)
    return clean


async def transliterate_single_word(
    client: httpx.AsyncClient,
    word: str,
    target_lang: str
) -> str:
    """
    Phonetically transliterates a single name word into the target Indic language
    using the Indic transliteration engine.
    """
    clean_word = word.strip()
    if not clean_word:
        return word

    lower_word = clean_word.lower()

    # 1. Check in-memory cache
    cache_key = f"{target_lang}:{lower_word}"
    if cache_key in _transliteration_cache:
        return _transliteration_cache[cache_key]

    itc = INDIC_ITC_MAP.get(target_lang, f"{target_lang}-t-i0-und")

    # 2. Query Indic transliteration API for original word
    cands = await fetch_indic_candidates(client, clean_word, itc)
    clean_cands = filter_english_loanwords(cands)

    chosen: Optional[str] = None

    # 3. Phonetic Long 'aa' heuristic:
    # In Indian English naming conventions, letters like 'a' are often pronounced as long 'aa' (आ),
    # e.g., 'Parise' pronounced 'Paarise', 'Patil' pronounced 'Paatil', etc.
    # If the word starts with a single consonant followed by 'a' (e.g., Parise, Kadam, Patil),
    # and not already starting with a vowel (like Aarav, Amit, Ananya), also check 'aa' spelling.
    if (
        len(clean_word) >= 4
        and clean_word[0].lower() not in "aeiou"
        and clean_word[1].lower() == "a"
        and clean_word[2].lower() not in "aeiou"
    ):
        alt_word = clean_word[0] + "aa" + clean_word[2:]
        alt_cands = await fetch_indic_candidates(client, alt_word, itc)
        clean_alt = filter_english_loanwords(alt_cands)
        if clean_alt:
            # If original candidate list had loanwords or no clean candidates
            if not clean_cands or (clean_cands and clean_alt[0] in cands):
                chosen = clean_alt[0]

    if not chosen:
        if clean_cands:
            chosen = clean_cands[0]
        elif cands:
            chosen = cands[0]
        else:
            chosen = clean_word

    # Cache result
    if len(_transliteration_cache) >= _MAX_CACHE_SIZE:
        _transliteration_cache.clear()
    _transliteration_cache[cache_key] = chosen

    return chosen


async def transliterate_indic_name(
    full_name: str,
    target_lang: str = "hi"
) -> str:
    """
    Transliterates a complete person name (e.g. 'Rahul Parise') word-by-word
    into authentic Indic script using the Indic transliteration engine.
    """
    if not full_name or not full_name.strip() or target_lang == "en":
        return full_name

    clean_name = full_name.strip()

    # If the name already contains native Indic script characters (\u0900 to \u0DFF), return as is
    if re.search(r"[\u0900-\u0DFF]", clean_name):
        return clean_name

    cache_key = f"{target_lang}:{clean_name.lower()}"
    if cache_key in _transliteration_cache:
        return _transliteration_cache[cache_key]

    words = clean_name.split()
    async with httpx.AsyncClient() as client:
        tasks = [transliterate_single_word(client, w, target_lang) for w in words]
        results = await asyncio.gather(*tasks)

    transliterated = " ".join(results)

    if len(_transliteration_cache) >= _MAX_CACHE_SIZE:
        _transliteration_cache.clear()
    _transliteration_cache[cache_key] = transliterated

    return transliterated


async def transliterate_indic_names_batch(
    names: List[str],
    target_lang: str = "hi"
) -> Dict[str, str]:
    """
    Batch transliterates a list of names in parallel into target Indic language.
    """
    if not names or target_lang == "en":
        return {n: n for n in names}

    unique_names = list(dict.fromkeys(n.strip() for n in names if n and n.strip()))
    results = await asyncio.gather(
        *(transliterate_indic_name(n, target_lang) for n in unique_names)
    )

    mapping = dict(zip(unique_names, results))
    return mapping
