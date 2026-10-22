from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.services.captcha_service import (
    evaluate_captcha_requirement,
    generate_math_captcha,
    verify_captcha_solution
)

router = APIRouter(prefix="/captcha", tags=["Security & Bot Protection"])


class CAPTCHAVerifyInput(BaseModel):
    captcha_token: str
    user_answer: str


@router.get("/status")
def get_captcha_status(
    request: Request,
    email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Evaluates dynamic risk score for current client IP & email context.
    Returns whether CAPTCHA is required.
    """
    client_ip = request.client.host if request.client else "Unknown"
    is_required, risk_score, reason = evaluate_captcha_requirement(db, client_ip, email)
    return {
        "success": True,
        "captcha_required": is_required,
        "risk_score": risk_score,
        "reason": reason
    }


@router.get("/generate")
def generate_captcha_challenge():
    """
    Generates a new signed math/SVG CAPTCHA challenge.
    """
    challenge = generate_math_captcha()
    return {
        "success": True,
        **challenge
    }


@router.post("/verify")
def verify_captcha(
    payload: CAPTCHAVerifyInput,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Verifies user's submitted CAPTCHA solution.
    Logs CAPTCHA_FAILED event if solution is incorrect.
    """
    client_ip = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "")
    request_id = getattr(request.state, "request_id", None)

    is_valid, msg = verify_captcha_solution(payload.captcha_token, payload.user_answer)
    
    if not is_valid:
        from backend.services.security_log_service import log_security_event
        log_security_event(
            db=db,
            event_type="CAPTCHA_FAILED",
            severity="WARNING",
            ip_address=client_ip,
            user_agent=user_agent,
            endpoint="/captcha/verify",
            method="POST",
            status_code=400,
            request_id=request_id,
            details={"reason": msg}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": msg}
        )

    return {
        "success": True,
        "verified": True,
        "message": msg
    }
