import json
import logging
import re
import uuid
from typing import Optional, Dict, Any, List
import httpx
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.core.config import settings
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.match_insight import MatchInsightModel

logger = logging.getLogger("backend.match_insight")

SYSTEM_MATCH_PROMPT = """You are an expert matrimonial matchmaker.
Analyze the two matrimonial profiles (User and Candidate) with deep attention to their shared or complementary interests, hobbies, personality, lifestyle (diet, habits), and family values.

Generate:
1. "headline": A compelling, warm 1-sentence recommendation reason starting with "Recommended because..." (maximum 15 words) explaining why they connect based on their shared interests/values.
2. "reasons": An array of EXACTLY 4 concise bullet points (each 3 to 7 words) explaining specific connection points (e.g., "Both enjoy travel & photography", "Aligned on Vegetarian diet", "Share family-first values", "Complementary career ambitions").

CRITICAL FORMATTING INSTRUCTION:
Return ONLY valid JSON with no markdown backticks, no markdown fence, and no other text:
{
  "headline": "Recommended because you both share family-first values and creative hobbies.",
  "reasons": [
    "Both enjoy travel & photography",
    "Aligned on Vegetarian diet",
    "Share family-oriented values",
    "Complementary career aspirations"
  ]
}"""


def _clean_json_response(raw_text: str) -> Optional[Dict[str, Any]]:
    """Clean markdown code fences and parse JSON with regex fallback."""
    if not raw_text:
        return None
    match = re.search(r"(\{[\s\S]*\})", raw_text)
    if match:
        try:
            data = json.loads(match.group(1))
            if isinstance(data, dict) and "headline" in data and "reasons" in data:
                return data
        except Exception as e:
            logger.warning(f"Failed to parse JSON from AI regex match: {e}. Match: {match.group(1)[:200]}")
    return None



def _generate_fallback_insight(user_data: Dict[str, Any], cand_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate dynamic rule-based compatibility reasons when AI is unavailable."""
    u_interests = [str(i).lower() for i in (user_data.get("interests") or user_data.get("hobbies") or [])]
    c_interests = [str(i).lower() for i in (cand_data.get("interests") or cand_data.get("hobbies") or [])]
    shared_interests = [i.title() for i in u_interests if i in c_interests]

    reasons: List[str] = []

    # 1. Interests
    if shared_interests:
        top_interests = " & ".join(shared_interests[:2])
        reasons.append(f"Shared passion for {top_interests}")
    elif c_interests:
        reasons.append(f"Passionate about {str(c_interests[0]).title()}")
    else:
        reasons.append("Complementary lifestyle and hobbies")

    # 2. Diet
    u_diet = str(user_data.get("diet") or "").strip()
    c_diet = str(cand_data.get("diet") or "").strip()
    if u_diet and c_diet and u_diet.lower() == c_diet.lower():
        reasons.append(f"Aligned on {c_diet} diet")
    elif c_diet:
        reasons.append(f"Prefers {c_diet} lifestyle")
    else:
        reasons.append("Balanced daily lifestyle habits")

    # 3. Values
    u_val = str(user_data.get("familyValues") or "").strip()
    c_val = str(cand_data.get("familyValues") or "").strip()
    if u_val and c_val and u_val.lower() == c_val.lower():
        reasons.append(f"Both share {c_val.lower()} family values")
    else:
        reasons.append("Both are family-oriented")

    # 4. Education / Profession
    c_prof = str(cand_data.get("profession") or cand_data.get("occupation") or "").strip()
    if c_prof:
        reasons.append(f"Driven professional ({c_prof})")
    else:
        reasons.append("Strong educational & career focus")

    reasons = reasons[:4]
    while len(reasons) < 4:
        reasons.append("Complementary life goals and outlook")

    headline = "Recommended because you both share family-first values and complementary lifestyles."
    if shared_interests:
        headline = f"Recommended because you share common interests in {shared_interests[0]}."

    return {
        "headline": headline,
        "reasons": reasons
    }


async def get_or_generate_match_insight(
    db: Session,
    user: Optional[User],
    candidate_profile_id: str
) -> Dict[str, Any]:
    """
    Retrieves cached match insight from MySQL or generates a new one via Groq AI.
    Guarantees that AI tokens are consumed AT MOST ONCE per (user, candidate) pair.
    """
    # 1. Resolve candidate profile by ID or SEO slug
    cand_stmt = or_(
        BiodataProfileModel.id == candidate_profile_id,
        BiodataProfileModel.slug == candidate_profile_id
    )
    candidate = db.query(BiodataProfileModel).filter(cand_stmt).first()
    if not candidate:
        return {
            "success": False,
            "headline": "Recommended based on overall profile harmony.",
            "reasons": [
                "Both are family-oriented",
                "Balanced modern and traditional values",
                "Complementary lifestyle goals",
                "Aligned future expectations"
            ],
            "source": "not_found_fallback",
            "cached": False
        }

    cand_id = candidate.id
    cand_data = candidate.profile_data or {}

    # 2. If unauthenticated, return candidate profile-tailored dynamic highlights
    if not user:
        fallback = _generate_fallback_insight({}, cand_data)
        return {
            "success": True,
            "headline": fallback["headline"],
            "reasons": fallback["reasons"],
            "source": "guest_rule",
            "cached": False
        }

    # 3. Check for existing cached insight in database (0 Tokens Used!)
    cached_insight = db.query(MatchInsightModel).filter(
        MatchInsightModel.user_id == user.id,
        MatchInsightModel.candidate_profile_id == cand_id
    ).first()

    if cached_insight:
        logger.info(f"[MatchInsight] Cache HIT for user {user.id} and candidate {cand_id}")
        return {
            "success": True,
            "headline": cached_insight.headline,
            "reasons": cached_insight.reasons if isinstance(cached_insight.reasons, list) else [],
            "source": "database_cache",
            "cached": True
        }

    # 4. Cache MISS: Extract User profile data
    user_profile = db.query(BiodataProfileModel).filter(
        BiodataProfileModel.user_id == user.id
    ).first()
    user_data = user_profile.profile_data if user_profile and user_profile.profile_data else {}

    # Build profile summaries for prompt
    user_summary = {
        "name": user_data.get("name") or user_data.get("fullName") or user.full_name or "User",
        "interests_and_hobbies": user_data.get("interests") or user_data.get("hobbies") or [],
        "personality": user_data.get("personality") or user_data.get("personalityTraits") or [],
        "diet": user_data.get("diet") or "",
        "family_values": user_data.get("familyValues") or "",
        "profession": user_data.get("profession") or user_data.get("occupation") or "",
        "education": user_data.get("education") or "",
        "about_me": user_data.get("aboutMe") or user_data.get("bio") or "",
    }

    cand_summary = {
        "name": cand_data.get("name") or cand_data.get("fullName") or "Candidate",
        "interests_and_hobbies": cand_data.get("interests") or cand_data.get("hobbies") or [],
        "personality": cand_data.get("personality") or cand_data.get("personalityTraits") or [],
        "diet": cand_data.get("diet") or "",
        "family_values": cand_data.get("familyValues") or "",
        "profession": cand_data.get("profession") or cand_data.get("occupation") or "",
        "education": cand_data.get("education") or "",
        "about_me": cand_data.get("aboutMe") or cand_data.get("bio") or "",
    }

    prompt_user_content = f"""Please compare these two individuals and provide the compatibility headline and 4 connection points:

USER:
{json.dumps(user_summary, indent=2)}

CANDIDATE:
{json.dumps(cand_summary, indent=2)}"""

    headline = None
    reasons = None
    generation_source = "fallback"

    # 5. Call Groq Cloud API
    if settings.GROQ_API_KEY and settings.GROQ_API_KEY.strip():
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY.strip()}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.GROQ_MODEL,
                        "messages": [
                            {"role": "system", "content": SYSTEM_MATCH_PROMPT},
                            {"role": "user", "content": prompt_user_content}
                        ],
                        "temperature": 0.6,
                        "max_tokens": 1000
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    raw_content = data["choices"][0]["message"]["content"].strip()
                    parsed = _clean_json_response(raw_content)
                    if parsed:
                        headline = parsed.get("headline", "").strip()
                        raw_reasons = parsed.get("reasons", [])
                        if isinstance(raw_reasons, list) and len(raw_reasons) > 0:
                            reasons = [str(r).strip() for r in raw_reasons[:4]]
                            generation_source = "groq_ai"
        except Exception as e:
            logger.error(f"[MatchInsight] Groq AI generation failed: {e}", exc_info=True)

    # 6. Fallback if AI call didn't produce valid results
    if not headline or not reasons:
        fallback = _generate_fallback_insight(user_data, cand_data)
        headline = fallback["headline"]
        reasons = fallback["reasons"]
        generation_source = "smart_fallback"

    # Ensure headline starts with "Recommended because"
    if not headline.lower().startswith("recommended because"):
        headline = f"Recommended because {headline[0].lower() + headline[1:] if len(headline) > 1 else headline}"
    if not headline.endswith("."):
        headline += "."

    # Ensure exactly 4 reasons
    while len(reasons) < 4:
        reasons.append("Shared personal and family values")
    reasons = reasons[:4]

    # 7. Persist to MySQL database (so it's NEVER generated again)
    try:
        new_insight = MatchInsightModel(
            id=f"MI-{uuid.uuid4().hex[:12].upper()}",
            user_id=user.id,
            candidate_profile_id=cand_id,
            headline=headline,
            reasons=reasons
        )
        db.add(new_insight)
        db.commit()
        db.refresh(new_insight)
        logger.info(f"[MatchInsight] Persisted new insight to DB for user {user.id} and candidate {cand_id}")
    except Exception as db_err:
        db.rollback()
        logger.warning(f"[MatchInsight] Could not cache insight into database: {db_err}")

    return {
        "success": True,
        "headline": headline,
        "reasons": reasons,
        "source": generation_source,
        "cached": False
    }
