"""
Admin Security Operations Center (SOC) & Threat Telemetry API.
Calculates real-time security metrics, dynamic threat level assessments, top suspicious IPs,
and searchable security log streams 100% directly from database telemetry.
Enforces strict RBAC via require_admin dependency.
"""
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc, or_

from backend.db.session import get_db
from backend.models.user import User
from backend.models.session import SessionModel
from backend.models.security_log import SecurityLog
from backend.dependencies.authorization import require_admin

router = APIRouter(prefix="/admin/security", tags=["Admin Security SOC & Telemetry"])


@router.get("/telemetry")
def get_security_telemetry(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Computes real-time live security telemetry metrics, threat assessment score,
    severity breakdown, event distribution, and top suspicious IP address table from database records.
    Strictly protected by require_admin RBAC dependency.
    """
    now = datetime.now(timezone.utc)
    twenty_four_hours_ago = now - timedelta(hours=24)
    fifteen_mins_ago = now - timedelta(minutes=15)

    # 1. Active Server Sessions Count
    active_sessions_count = db.scalar(
        select(func.count(SessionModel.id)).where(
            SessionModel.is_active == True,
            SessionModel.revoked_at.is_(None),
            SessionModel.expires_at > now
        )
    ) or 0

    # 2. Total Security Events (24h)
    total_events_24h = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.created_at >= twenty_four_hours_ago
        )
    ) or 0

    # 3. Failed Auth Count (24h)
    failed_auths_24h = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.event_type.in_(["LOGIN_FAILED", "JWT_TOKEN_FAILED", "OTP_FAILED"]),
            SecurityLog.created_at >= twenty_four_hours_ago
        )
    ) or 0

    # 4. CSRF / Origin Violations (24h)
    csrf_violations_24h = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.event_type.in_(["CSRF_VIOLATION", "UNTRUSTED_ORIGIN"]),
            SecurityLog.created_at >= twenty_four_hours_ago
        )
    ) or 0

    # 5. GDPR Requests Count (24h)
    gdpr_requests_24h = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.event_type.in_(["GDPR_EXPORT", "GDPR_ERASURE"]),
            SecurityLog.created_at >= twenty_four_hours_ago
        )
    ) or 0

    # 6. CAPTCHA Metrics (24h)
    captcha_failures_24h = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.event_type == "CAPTCHA_FAILED",
            SecurityLog.created_at >= twenty_four_hours_ago
        )
    ) or 0

    # 7. Recent High-Risk Events (15m window for dynamic threat assessment)
    failed_auths_15m = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.event_type.in_(["LOGIN_FAILED", "JWT_TOKEN_FAILED", "CSRF_VIOLATION", "RATE_LIMIT_EXCEEDED"]),
            SecurityLog.created_at >= fifteen_mins_ago
        )
    ) or 0

    critical_events_24h = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.severity == "CRITICAL",
            SecurityLog.created_at >= twenty_four_hours_ago
        )
    ) or 0

    high_severity_24h = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.severity == "HIGH",
            SecurityLog.created_at >= twenty_four_hours_ago
        )
    ) or 0

    # Dynamic Threat Level Calculation Algorithm
    threat_level = "LOW"
    threat_score = 15
    threat_assessment = "System operating within normal baseline security thresholds."

    if failed_auths_15m > 10 or critical_events_24h > 3:
        threat_level = "CRITICAL"
        threat_score = 95
        threat_assessment = "CRITICAL ALERT: Elevated frequency of suspicious authentication failures and high-severity violations detected."
    elif failed_auths_15m > 5 or high_severity_24h > 5:
        threat_level = "HIGH"
        threat_score = 75
        threat_assessment = "HIGH THREAT: Multiple security warnings and origin violations logged in recent activity window."
    elif failed_auths_15m > 2 or total_events_24h > 15:
        threat_level = "MEDIUM"
        threat_score = 45
        threat_assessment = "MODERATE: Minor security events and authentication retry anomalies detected."

    # 8. Severity Breakdown
    severity_counts = {
        "INFO": db.scalar(select(func.count(SecurityLog.id)).where(SecurityLog.severity == "INFO", SecurityLog.created_at >= twenty_four_hours_ago)) or 0,
        "WARNING": db.scalar(select(func.count(SecurityLog.id)).where(SecurityLog.severity == "WARNING", SecurityLog.created_at >= twenty_four_hours_ago)) or 0,
        "HIGH": high_severity_24h,
        "CRITICAL": critical_events_24h,
    }

    # 9. Top Event Types Breakdown (Top 5)
    event_type_stmt = (
        select(SecurityLog.event_type, func.count(SecurityLog.id).label("count"))
        .where(SecurityLog.created_at >= twenty_four_hours_ago)
        .group_by(SecurityLog.event_type)
        .order_by(desc("count"))
        .limit(5)
    )
    event_type_rows = db.execute(event_type_stmt).all()
    event_type_breakdown = [{"event_type": row[0], "count": row[1]} for row in event_type_rows]

    # 10. Top Suspicious IP Addresses Table
    ip_stmt = (
        select(
            SecurityLog.ip_address,
            func.count(SecurityLog.id).label("event_count"),
            func.max(SecurityLog.risk_score).label("max_risk"),
            func.max(SecurityLog.created_at).label("last_seen")
        )
        .where(
            SecurityLog.ip_address.isnot(None),
            SecurityLog.severity.in_(["WARNING", "HIGH", "CRITICAL"])
        )
        .group_by(SecurityLog.ip_address)
        .order_by(desc("event_count"), desc("max_risk"))
        .limit(5)
    )
    ip_rows = db.execute(ip_stmt).all()
    suspicious_ips = [
        {
            "ip_address": row[0],
            "event_count": row[1],
            "highest_risk_score": row[2] or 50,
            "last_seen": row[3].isoformat() if row[3] else None
        }
        for row in ip_rows
    ]

    return {
        "success": True,
        "metrics": {
            "active_sessions": active_sessions_count,
            "total_security_events_24h": total_events_24h,
            "failed_auths_24h": failed_auths_24h,
            "csrf_violations_24h": csrf_violations_24h,
            "gdpr_requests_24h": gdpr_requests_24h,
            "captcha_failures_24h": captcha_failures_24h,
        },
        "threat_status": {
            "threat_level": threat_level,
            "threat_score": threat_score,
            "assessment": threat_assessment,
        },
        "severity_breakdown": severity_counts,
        "event_type_breakdown": event_type_breakdown,
        "suspicious_ips": suspicious_ips,
    }


@router.get("/logs")
def get_security_logs(
    severity: Optional[str] = None,
    event_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Searchable, filterable real-time security log stream directly from security_logs table.
    Enforces strict RBAC via require_admin.
    """
    query = select(SecurityLog)

    if severity:
        query = query.where(SecurityLog.severity == severity.upper())

    if event_type:
        query = query.where(SecurityLog.event_type == event_type.upper())

    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query = query.where(
            or_(
                SecurityLog.event_type.ilike(term),
                SecurityLog.ip_address.ilike(term),
                SecurityLog.endpoint.ilike(term),
                SecurityLog.request_id.ilike(term),
                SecurityLog.user_id.ilike(term),
            )
        )

    # Get total count matching filters
    count_stmt = select(func.count()).select_from(query.subquery())
    total_count = db.scalar(count_stmt) or 0

    # Paginate and order by newest first
    query = query.order_by(desc(SecurityLog.created_at)).offset(offset).limit(limit)
    logs = db.scalars(query).all()

    log_list = [
        {
            "id": log.id,
            "request_id": log.request_id,
            "session_id": log.session_id,
            "event_type": log.event_type,
            "severity": log.severity,
            "risk_score": log.risk_score,
            "user_id": log.user_id,
            "target_user_id": log.target_user_id,
            "ip_address": log.ip_address,
            "user_agent": log.user_agent,
            "endpoint": log.endpoint,
            "method": log.method,
            "status_code": log.status_code,
            "details": log.details,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]

    return {
        "success": True,
        "total": total_count,
        "limit": limit,
        "offset": offset,
        "logs": log_list
    }
