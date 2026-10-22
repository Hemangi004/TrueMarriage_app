from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.core.security import verify_password
from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_current_user
from backend.services.gdpr_service import export_user_data, execute_gdpr_erasure
from backend.services.security_log_service import log_security_event

router = APIRouter(prefix="/gdpr", tags=["GDPR Data Rights & Privacy"])


class GDPRErasureInput(BaseModel):
    confirmation: bool
    password: Optional[str] = None


@router.post("/export")
def export_my_data(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GDPR Article 15 - Right of Access Endpoint.
    Generates and returns structured JSON package containing all personal data associated with current user.
    """
    client_ip = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "")
    request_id = getattr(request.state, "request_id", None)

    export_payload = export_user_data(db, current_user)

    log_security_event(
        db=db,
        event_type="GDPR_EXPORT",
        severity="INFO",
        user_id=current_user.id,
        ip_address=client_ip,
        user_agent=user_agent,
        endpoint="/gdpr/export",
        method="POST",
        status_code=200,
        request_id=request_id,
        details={"message": "Personal data exported by user"}
    )

    return {
        "success": True,
        "data": export_payload
    }


@router.post("/erasure")
def request_account_erasure(
    payload: GDPRErasureInput,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GDPR Article 17 - Right to be Forgotten Endpoint.
    Verifies user password/confirmation, revokes active sessions, anonymizes PII, and deactivates account.
    """
    client_ip = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "")
    request_id = getattr(request.state, "request_id", None)

    if not payload.confirmation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Explicit confirmation parameter (confirmation: true) is required."}
        )

    # Verify password if user has local password set
    if current_user.password_hash:
        if not payload.password or not verify_password(payload.password, current_user.password_hash):
            log_security_event(
                db=db,
                event_type="GDPR_ERASURE_FAILED",
                severity="WARNING",
                user_id=current_user.id,
                ip_address=client_ip,
                user_agent=user_agent,
                endpoint="/gdpr/erasure",
                method="POST",
                status_code=401,
                request_id=request_id,
                details={"reason": "Password verification failed during GDPR erasure request"}
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"success": False, "message": "Invalid password. Account erasure request rejected."}
            )

    success, message = execute_gdpr_erasure(db, current_user, client_ip, user_agent)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": message}
        )

    return {
        "success": True,
        "message": message
    }
