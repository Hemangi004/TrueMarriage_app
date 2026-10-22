from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, desc
from backend.db.session import get_db
from backend.models.user import User
from backend.models.audit_log import AdminAuditLog
from backend.dependencies.authorization import require_admin
from backend.services.admin_settings_service import (
    get_admin_settings_summary,
    update_admin_settings,
)

router = APIRouter(prefix="/admin/settings", tags=["Admin Settings"])


@router.get("")
def get_admin_settings(
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Retrieves safe administrative application settings and real system health indicators.
    Enforces require_admin dependency. Omits all secret keys, passwords, and tokens.
    """
    settings_data = get_admin_settings_summary(db)
    return {
        "success": True,
        "data": settings_data
    }


@router.patch("")
def update_admin_settings_endpoint(
    payload: Dict[str, Any] = Body(..., description="Dictionary of allowed settings to update"),
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Updates non-secret application settings backed by explicit allowlist validation.
    Creates security audit log entries recording administrator ID and timestamp.
    """
    try:
        updated_summary = update_admin_settings(db, current_admin.id, payload)
        return {
            "success": True,
            "message": "Application settings updated successfully.",
            "data": updated_summary
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"success": False, "message": str(val_err)}
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": f"Failed to update settings: {str(err)}"}
        )


@router.get("/audit-logs")
def get_admin_audit_logs(
    limit: int = 50,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Retrieves recent administrative audit logs for setting modifications and system actions.
    Enforces require_admin dependency.
    """
    stmt = select(AdminAuditLog).order_by(desc(AdminAuditLog.created_at)).limit(limit).options(
        joinedload(AdminAuditLog.admin)
    )
    logs = list(db.scalars(stmt).all())

    logs_data = []
    for log in logs:
        logs_data.append({
            "id": log.id,
            "admin_id": log.admin_id,
            "admin_email": log.admin.email if log.admin else "unknown@example.com",
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "details": log.details or {},
            "created_at": log.created_at.isoformat() if log.created_at else None,
        })

    return {
        "success": True,
        "data": logs_data
    }
