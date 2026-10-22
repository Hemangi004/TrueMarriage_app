import logging
from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from backend.services.indic_transliteration_service import (
    transliterate_indic_name,
    transliterate_indic_names_batch,
    INDIC_ITC_MAP
)

logger = logging.getLogger("backend.routes.transliterate")
router = APIRouter(tags=["transliteration"])


class TransliterateRequest(BaseModel):
    text: str
    target_lang: str = "hi"


class BatchTransliterateRequest(BaseModel):
    names: List[str]
    target_lang: str = "hi"


class TransliterateResponse(BaseModel):
    success: bool
    original: str
    target_lang: str
    transliterated: str


class BatchTransliterateResponse(BaseModel):
    success: bool
    target_lang: str
    translations: Dict[str, str]


@router.get("/transliterate", response_model=TransliterateResponse)
async def transliterate_get(
    text: str = Query(..., description="English name or word to transliterate"),
    lang: str = Query("hi", description="Target Indic language code (e.g. hi, mr, gu, bn, ta, te, kn, ml, pa, or, ur, as)")
):
    """
    Phonetically transliterates a name into Indic script using the Indic transliteration engine.
    Example: 'Rahul Parise' in Hindi -> 'राहुल पारिसे' (not 'राहुल पैरिस').
    """
    clean_text = text.strip()
    clean_lang = lang.strip().lower()
    try:
        result = await transliterate_indic_name(clean_text, clean_lang)
        return TransliterateResponse(
            success=True,
            original=clean_text,
            target_lang=clean_lang,
            transliterated=result
        )
    except Exception as e:
        logger.error(f"Transliteration failed for '{clean_text}' ({clean_lang}): {e}")
        return TransliterateResponse(
            success=False,
            original=clean_text,
            target_lang=clean_lang,
            transliterated=clean_text
        )


@router.post("/transliterate", response_model=TransliterateResponse)
async def transliterate_post(req: TransliterateRequest):
    """
    POST endpoint to phonetically transliterate a single name.
    """
    clean_text = req.text.strip()
    clean_lang = req.target_lang.strip().lower()
    try:
        result = await transliterate_indic_name(clean_text, clean_lang)
        return TransliterateResponse(
            success=True,
            original=clean_text,
            target_lang=clean_lang,
            transliterated=result
        )
    except Exception as e:
        logger.error(f"Transliteration failed for '{clean_text}' ({clean_lang}): {e}")
        return TransliterateResponse(
            success=False,
            original=clean_text,
            target_lang=clean_lang,
            transliterated=clean_text
        )


@router.post("/transliterate/batch", response_model=BatchTransliterateResponse)
async def transliterate_batch(req: BatchTransliterateRequest):
    """
    POST endpoint to batch transliterate multiple names simultaneously.
    """
    clean_lang = req.target_lang.strip().lower()
    try:
        mapping = await transliterate_indic_names_batch(req.names, clean_lang)
        return BatchTransliterateResponse(
            success=True,
            target_lang=clean_lang,
            translations=mapping
        )
    except Exception as e:
        logger.error(f"Batch transliteration failed ({clean_lang}): {e}")
        return BatchTransliterateResponse(
            success=False,
            target_lang=clean_lang,
            translations={n: n for n in req.names}
        )
