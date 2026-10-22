from fastapi import APIRouter, HTTPException, Request, Depends
from backend.services.ai_service import generate_ai_bio
from backend.models.user import User
from backend.dependencies.auth import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Bio Generator"])


@router.post("/generate")
async def generate_ai(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Authenticated route: Generates AI biodata text for the active user.
    """
    body = await request.json()
    result = await generate_ai_bio(body)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
