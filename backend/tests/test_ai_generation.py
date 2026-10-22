import pytest
from backend.services.ai_service import generate_ai_bio
from backend.core.config import settings


@pytest.mark.anyio
async def test_generate_ai_bio_with_groq():
    """Verify that Groq Cloud AI generates high-quality bio responses."""
    test_user_data = {
        "name": "Aarav Mehta",
        "occupation": "Software Architect",
        "company": "Tech Innovations",
        "hobbies": ["Reading", "Cycling"],
        "educationList": [{"degree": "B.Tech Computer Science", "college": "IIT Bombay"}],
    }

    # Test Warm & Balanced tone
    result = await generate_ai_bio({
        "type": "ollama_summary",
        "userData": test_user_data,
        "tone": "warm_balanced"
    })

    assert result["success"] is True
    assert "summary" in result
    assert len(result["summary"]) > 20
    assert result["source"] in ["groq", "smart_fallback"]
    if settings.GROQ_API_KEY:
        assert result["source"] == "groq"


@pytest.mark.anyio
async def test_generate_ai_bio_fallback_when_no_key():
    """Verify graceful fallback to smart engine when GROQ_API_KEY is empty."""
    original_key = settings.GROQ_API_KEY
    try:
        settings.GROQ_API_KEY = None
        result = await generate_ai_bio({
            "type": "ollama_summary",
            "userData": {
                "name": "Kavita Rao",
                "occupation": "Chartered Accountant",
                "company": "Finance Corp",
                "hobbies": ["Music", "Cooking"],
            },
            "tone": "modern_professional"
        })

        assert result["success"] is True
        assert result["source"] == "smart_fallback"
        assert "Kavita" in result["summary"]
    finally:
        settings.GROQ_API_KEY = original_key
