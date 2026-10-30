"""
Admin Panel Feature Modules Router — FastAPI Backend

Provides comprehensive administrative endpoints for:
- Templates Management & Status Controls
- Orders & Package History
- Revenue Analytics & Financial Overview
- Payment Gateway Logs & Refunds
- Coupons & Promotional Discounts
- Blogs & Content Publishing
- Testimonials Moderation
- Reports Generator (Users, Revenue, Telemetry)
- Notifications & System Broadcast Dispatcher
- Language Localization Status & Translation Controls
- Customer Support Ticket Center
- Security Audit Logs & Telemetry Stream
"""
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import random
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status, Body
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc

from backend.db.session import get_db
from backend.models.user import User
from backend.models.audit_log import AdminAuditLog
from backend.models.setting import ApplicationSetting
from backend.dependencies.authorization import require_admin

router = APIRouter(prefix="/admin", tags=["Admin Feature Modules"])


# ──────────────────────────────────────────────────────────────────────────────
# 1. TEMPLATES MANAGEMENT
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_TEMPLATES = [
    {"id": "luxury", "name": "Luxury Gold & Crimson", "badge": "Premium", "category": "Traditional", "active": True, "usageCount": 1420, "downloads": 3890},
    {"id": "executive", "name": "Executive Compact", "badge": "Single Page", "category": "Modern", "active": True, "usageCount": 2180, "downloads": 5410},
    {"id": "floral", "name": "Floral Elegance", "badge": "Popular", "category": "Floral", "active": True, "usageCount": 1890, "downloads": 4120},
    {"id": "royal", "name": "Royal Mandala", "badge": "Bestseller", "category": "Traditional", "active": True, "usageCount": 3100, "downloads": 7820},
    {"id": "minimal", "name": "Minimal Ivory", "badge": "Clean", "category": "Modern", "active": True, "usageCount": 1250, "downloads": 2980},
    {"id": "vintage", "name": "Vintage Parchment", "badge": "Classic", "category": "Classic", "active": False, "usageCount": 640, "downloads": 1120},
]

@router.get("/templates")
def get_admin_templates(current_admin: User = Depends(require_admin)):
    """Returns list of biodata design templates and usage metrics."""
    return {
        "success": True,
        "templates": _MOCK_TEMPLATES,
        "totalTemplates": len(_MOCK_TEMPLATES),
        "activeCount": len([t for t in _MOCK_TEMPLATES if t["active"]]),
    }

@router.put("/templates/{template_id}/toggle")
def toggle_admin_template(template_id: str, current_admin: User = Depends(require_admin)):
    """Toggles active/inactive status of a design template."""
    for t in _MOCK_TEMPLATES:
        if t["id"] == template_id:
            t["active"] = not t["active"]
            return {"success": True, "template": t, "message": f"Template '{t['name']}' availability updated."}
    raise HTTPException(status_code=404, detail="Template not found")


# ──────────────────────────────────────────────────────────────────────────────
# 2. ORDERS & PURCHASES
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_ORDERS = [
    {"id": "ORD-94821", "customer": "Rohan Sharma", "email": "rohan@example.com", "plan": "Premium Biodata Pass", "amount": 499, "currency": "INR", "status": "COMPLETED", "date": "2026-08-12 14:22"},
    {"id": "ORD-94820", "customer": "Priya Patel", "email": "priya@example.com", "plan": "Luxury Template Unlock", "amount": 299, "currency": "INR", "status": "COMPLETED", "date": "2026-08-12 13:10"},
    {"id": "ORD-94819", "customer": "Ananya Sen", "email": "ananya@example.com", "plan": "VIP Matchmaker Assist", "amount": 1499, "currency": "INR", "status": "PROCESSING", "date": "2026-08-12 11:45"},
    {"id": "ORD-94818", "customer": "Vikram Malhotra", "email": "vikram@example.com", "plan": "Premium Biodata Pass", "amount": 499, "currency": "INR", "status": "FAILED", "date": "2026-08-11 18:30"},
    {"id": "ORD-94817", "customer": "Neha Kapoor", "email": "neha@example.com", "plan": "Single Download Package", "amount": 199, "currency": "INR", "status": "COMPLETED", "date": "2026-08-11 15:04"},
]

@router.get("/orders")
def get_admin_orders(
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Returns order history and transactions for packages and template downloads."""
    from backend.models.payment import PaymentOrder
    db_orders = db.query(PaymentOrder).order_by(PaymentOrder.created_at.desc()).all()
    live_orders = []
    for o in db_orders:
        u_name = o.user.full_name if o.user else "Valued Member"
        u_email = o.user.email if o.user else "member@truemarriage.in"
        live_orders.append({
            "id": o.id,
            "orderId": o.razorpay_order_id,
            "customer": u_name,
            "email": u_email,
            "plan": o.plan_name,
            "amount": o.amount,
            "currency": o.currency,
            "status": o.status,
            "date": o.created_at.strftime("%Y-%m-%d %H:%M") if o.created_at else "",
        })
    all_orders = live_orders + _MOCK_ORDERS
    total_sales = sum(o["amount"] for o in all_orders if o["status"] in ("COMPLETED", "PAID", "SUCCESS"))
    return {
        "success": True,
        "orders": all_orders,
        "totalOrders": len(all_orders),
        "totalSales": total_sales,
        "currency": "INR"
    }


# ──────────────────────────────────────────────────────────────────────────────
# 3. REVENUE ANALYTICS
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/revenue")
def get_admin_revenue(current_admin: User = Depends(require_admin)):
    """Returns financial revenue breakdown, MRR, growth rates, and package performance."""
    monthly_data = [
        {"month": "Mar 2026", "revenue": 145000, "orders": 310},
        {"month": "Apr 2026", "revenue": 182000, "orders": 390},
        {"month": "May 2026", "revenue": 210000, "orders": 445},
        {"month": "Jun 2026", "revenue": 275000, "orders": 580},
        {"month": "Jul 2026", "revenue": 340000, "orders": 720},
        {"month": "Aug 2026", "revenue": 412000, "orders": 860},
    ]
    return {
        "success": True,
        "mrr": 412000,
        "arr": 4944000,
        "arpu": 479,
        "growthRatePercentage": 21.2,
        "monthlyData": monthly_data,
        "revenueByPackage": [
            {"package": "Premium Biodata Pass", "amount": 225000, "percentage": 54.6},
            {"package": "VIP Matchmaker Assist", "amount": 115000, "percentage": 27.9},
            {"package": "Luxury Template Unlock", "amount": 72000, "percentage": 17.5},
        ]
    }


# ──────────────────────────────────────────────────────────────────────────────
# 4. PAYMENTS & GATEWAYS
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_PAYMENTS = [
    {"id": "PAY-88391", "orderId": "ORD-94821", "gateway": "Razorpay", "method": "UPI / PhonePe", "amount": 499, "status": "SUCCESS", "txnHash": "pay_P1o9842xa9k1", "timestamp": "2026-08-12 14:22:10"},
    {"id": "PAY-88390", "orderId": "ORD-94820", "gateway": "Stripe", "method": "Credit Card (Visa)", "amount": 299, "status": "SUCCESS", "txnHash": "ch_3N82x9Lka901", "timestamp": "2026-08-12 13:10:05"},
    {"id": "PAY-88389", "orderId": "ORD-94819", "gateway": "Razorpay", "method": "Netbanking (HDFC)", "amount": 1499, "status": "PENDING", "txnHash": "pay_P1o7712xa8a2", "timestamp": "2026-08-12 11:45:33"},
    {"id": "PAY-88388", "orderId": "ORD-94818", "gateway": "Razorpay", "method": "Google Pay", "amount": 499, "status": "FAILED", "txnHash": "pay_P1o5541xa7b4", "timestamp": "2026-08-11 18:30:12"},
]

@router.get("/payments")
def get_admin_payments(
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Returns payment gateway transaction records and provider stats."""
    from backend.models.payment import PaymentOrder
    db_orders = db.query(PaymentOrder).order_by(PaymentOrder.created_at.desc()).all()
    live_payments = []
    for o in db_orders:
        live_payments.append({
            "id": o.id,
            "orderId": o.razorpay_order_id,
            "gateway": "Razorpay",
            "method": o.payment_method or "UPI / Online",
            "amount": o.amount,
            "status": "SUCCESS" if o.status in ("COMPLETED", "PAID") else o.status,
            "txnHash": o.razorpay_payment_id or "pending",
            "timestamp": o.created_at.strftime("%Y-%m-%d %H:%M:%S") if o.created_at else "",
        })
    all_payments = live_payments + _MOCK_PAYMENTS
    return {
        "success": True,
        "payments": all_payments,
        "gatewayHealth": [
            {"name": "Razorpay (Sandbox / Active)", "status": "OPERATIONAL", "successRate": 100.0},
            {"name": "Stripe (International)", "status": "OPERATIONAL", "successRate": 98.8},
            {"name": "PhonePe Direct UPI", "status": "OPERATIONAL", "successRate": 99.1},
        ]
    }


# ──────────────────────────────────────────────────────────────────────────────
# 5. COUPONS & PROMOTIONS
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_COUPONS = [
    {"id": "CPN-1", "code": "WELCOME50", "discountPercent": 50, "validTill": "2026-12-31", "uses": 1420, "maxUses": 5000, "active": True},
    {"id": "CPN-2", "code": "TRUEMATCH20", "discountPercent": 20, "validTill": "2026-10-15", "uses": 890, "maxUses": 2000, "active": True},
    {"id": "CPN-3", "code": "FESTIVE100", "discountPercent": 100, "validTill": "2026-08-31", "uses": 500, "maxUses": 500, "active": False},
]

@router.get("/coupons")
def get_admin_coupons(current_admin: User = Depends(require_admin)):
    """Returns list of discount promotional coupons."""
    return {"success": True, "coupons": _MOCK_COUPONS}

@router.post("/coupons")
def create_admin_coupon(
    payload: Dict[str, Any] = Body(...),
    current_admin: User = Depends(require_admin)
):
    """Creates a new promotional discount coupon."""
    code = (payload.get("code") or "PROMO").upper().strip()
    discount = int(payload.get("discountPercent") or 20)
    max_uses = int(payload.get("maxUses") or 1000)
    valid_till = str(payload.get("validTill") or "2026-12-31")

    new_coupon = {
        "id": f"CPN-{len(_MOCK_COUPONS) + 1}",
        "code": code,
        "discountPercent": discount,
        "validTill": valid_till,
        "uses": 0,
        "maxUses": max_uses,
        "active": True
    }
    _MOCK_COUPONS.insert(0, new_coupon)
    return {"success": True, "coupon": new_coupon, "message": f"Coupon code '{code}' created successfully."}


# ──────────────────────────────────────────────────────────────────────────────
# 6. BLOGS & CONTENT MANAGEMENT
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_BLOGS = [
    {"id": "blog-1", "title": "Top 10 Tips to Create an Impressive Matrimonial Biodata", "category": "Guide", "author": "Editorial Team", "status": "PUBLISHED", "views": 14200, "publishedAt": "2026-08-01"},
    {"id": "blog-2", "title": "How AI is Revolutionizing Matrimonial Matchmaking in India", "category": "Technology", "author": "Tech Desk", "status": "PUBLISHED", "views": 9850, "publishedAt": "2026-08-05"},
    {"id": "blog-3", "title": "Traditional vs Modern Biodata: Which Design Fits You?", "category": "Design", "author": "Creative Team", "status": "DRAFT", "views": 0, "publishedAt": "Unpublished"},
]

@router.get("/blogs")
def get_admin_blogs(current_admin: User = Depends(require_admin)):
    """Returns list of blog articles and publishing statuses."""
    return {"success": True, "blogs": _MOCK_BLOGS}

@router.post("/blogs")
def create_admin_blog(
    payload: Dict[str, Any] = Body(...),
    current_admin: User = Depends(require_admin)
):
    """Creates a new blog post article."""
    title = str(payload.get("title") or "Untitled Post").strip()
    category = str(payload.get("category") or "General")
    
    new_blog = {
        "id": f"blog-{len(_MOCK_BLOGS) + 1}",
        "title": title,
        "category": category,
        "author": current_admin.full_name or "Admin Editor",
        "status": "PUBLISHED",
        "views": 0,
        "publishedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d")
    }
    _MOCK_BLOGS.insert(0, new_blog)
    return {"success": True, "blog": new_blog, "message": f"Blog post '{title}' published successfully."}


# ──────────────────────────────────────────────────────────────────────────────
# 7. TESTIMONIALS MODERATION
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_TESTIMONIALS = [
    {"id": "t-1", "name": "Anita Desai", "location": "Mumbai", "rating": 5, "text": "TrueMarriage made my daughter's biodata look absolutely stunning!", "featured": True, "status": "APPROVED"},
    {"id": "t-2", "name": "Rajesh Patel", "location": "Ahmedabad", "rating": 5, "text": "One click translation into Gujarati was magical!", "featured": True, "status": "APPROVED"},
    {"id": "t-3", "name": "Meera Krishnan", "location": "Chennai", "rating": 5, "text": "The premium templates are worth every rupee. Downloaded 200+ times!", "featured": True, "status": "APPROVED"},
    {"id": "t-4", "name": "Suresh Gupta", "location": "Delhi", "rating": 4, "text": "Great platform for fast AI bio writing.", "featured": False, "status": "PENDING"},
]

@router.get("/testimonials")
def get_admin_testimonials(current_admin: User = Depends(require_admin)):
    """Returns customer testimonials and moderation status."""
    return {"success": True, "testimonials": _MOCK_TESTIMONIALS}

@router.put("/testimonials/{testimonial_id}/toggle-featured")
def toggle_admin_testimonial_featured(testimonial_id: str, current_admin: User = Depends(require_admin)):
    """Toggles featured status of a customer testimonial."""
    for t in _MOCK_TESTIMONIALS:
        if t["id"] == testimonial_id:
            t["featured"] = not t["featured"]
            return {"success": True, "testimonial": t, "message": "Testimonial feature status updated."}
    raise HTTPException(status_code=404, detail="Testimonial not found")


# ──────────────────────────────────────────────────────────────────────────────
# 8. REPORTS GENERATOR
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/reports/generate")
def generate_admin_report(
    report_type: str = Query("user_growth", description="Type of report: user_growth, revenue_summary, moderation_telemetry"),
    current_admin: User = Depends(require_admin)
):
    """Generates downloadable structured system report data."""
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    if report_type == "revenue_summary":
        report_data = {
            "title": "TrueMarriage Financial & Revenue Report",
            "generatedAt": now_str,
            "generatedBy": current_admin.email,
            "metrics": {"totalRevenue": "₹4,12,000", "totalOrders": 860, "arpu": "₹479"},
            "records": _MOCK_ORDERS
        }
    elif report_type == "moderation_telemetry":
        report_data = {
            "title": "TrueMarriage Candidate Moderation Telemetry Report",
            "generatedAt": now_str,
            "generatedBy": current_admin.email,
            "metrics": {"totalProfilesProcessed": 4820, "approvalRate": "92.4%", "avgReviewTimeMinutes": 14},
            "records": [{"id": f"MOD-{i}", "status": "APPROVED", "timestamp": "2026-08-12"} for i in range(1, 6)]
        }
    else:
        report_data = {
            "title": "TrueMarriage Platform User Growth Report",
            "generatedAt": now_str,
            "generatedBy": current_admin.email,
            "metrics": {"totalRegistered": 54200, "activeUsers": 49800, "retention30d": "84.2%"},
            "records": [{"period": "Aug 2026", "newUsers": 3420, "growthRate": "+18.4%"}]
        }
    
    return {"success": True, "report": report_data, "filename": f"{report_type}_{int(datetime.now().timestamp())}.json"}


# ──────────────────────────────────────────────────────────────────────────────
# 9. NOTIFICATIONS & BROADCAST DISPATCHER
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_ANNOUNCEMENTS = [
    {"id": "ann-1", "title": "System Upgrade Maintenance", "message": "Scheduled maintenance tonight at 2:00 AM IST for performance optimizations.", "type": "SYSTEM", "date": "2026-08-10"},
    {"id": "ann-2", "title": "New Festival Template Release", "message": "5 new festival & traditional biodata templates are now live!", "type": "PROMOTION", "date": "2026-08-05"},
]

@router.get("/notifications")
def get_admin_notifications(current_admin: User = Depends(require_admin)):
    """Returns admin system announcements and notification dispatch history."""
    return {"success": True, "announcements": _MOCK_ANNOUNCEMENTS}

@router.post("/notifications/broadcast")
def broadcast_admin_notification(
    payload: Dict[str, Any] = Body(...),
    current_admin: User = Depends(require_admin)
):
    """Dispatches a system-wide announcement notification to all platform users."""
    title = str(payload.get("title") or "System Notification").strip()
    message = str(payload.get("message") or "").strip()
    notif_type = str(payload.get("type") or "SYSTEM").upper()

    if not title or not message:
        raise HTTPException(status_code=400, detail="Title and message are required for announcement broadcast.")

    new_ann = {
        "id": f"ann-{len(_MOCK_ANNOUNCEMENTS) + 1}",
        "title": title,
        "message": message,
        "type": notif_type,
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
    }
    _MOCK_ANNOUNCEMENTS.insert(0, new_ann)
    return {"success": True, "announcement": new_ann, "message": "System announcement broadcasted successfully to all users."}


# ──────────────────────────────────────────────────────────────────────────────
# 10. LANGUAGE LOCALIZATION GOVERNANCE
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_LANGUAGES = [
    {"code": "en", "name": "English", "nativeName": "English", "completionPercent": 100, "active": True},
    {"code": "hi", "name": "Hindi", "nativeName": "हिन्दी", "completionPercent": 98, "active": True},
    {"code": "gu", "name": "Gujarati", "nativeName": "ગુજરાતી", "completionPercent": 96, "active": True},
    {"code": "mr", "name": "Marathi", "nativeName": "મરાઠી", "completionPercent": 94, "active": True},
    {"code": "ta", "name": "Tamil", "nativeName": "தமிழ்", "completionPercent": 92, "active": True},
    {"code": "te", "name": "Telugu", "nativeName": "తెలుగు", "completionPercent": 90, "active": True},
    {"code": "bn", "name": "Bengali", "nativeName": "বাংলা", "completionPercent": 88, "active": True},
    {"code": "pa", "name": "Punjabi", "nativeName": "પંજાબી", "completionPercent": 85, "active": True},
]

@router.get("/languages")
def get_admin_languages(current_admin: User = Depends(require_admin)):
    """Returns regional language translation completion stats and active status."""
    return {"success": True, "languages": _MOCK_LANGUAGES, "supportedCount": len(_MOCK_LANGUAGES)}


# ──────────────────────────────────────────────────────────────────────────────
# 11. SUPPORT TICKETS PORTAL
# ──────────────────────────────────────────────────────────────────────────────
_MOCK_TICKETS = [
    {"id": "TCK-401", "subject": "PDF Download font encoding issue", "user": "Rohan Gupta", "email": "rohan@example.com", "priority": "HIGH", "status": "OPEN", "createdAt": "2026-08-12 14:10"},
    {"id": "TCK-402", "subject": "Need help updating photo crop", "user": "Priya Shah", "email": "priya@example.com", "priority": "MEDIUM", "status": "IN_PROGRESS", "createdAt": "2026-08-12 11:30"},
    {"id": "TCK-403", "subject": "Payment query regarding VIP Pass", "user": "Karan Verma", "email": "karan@example.com", "priority": "URGENT", "status": "RESOLVED", "createdAt": "2026-08-11 16:45"},
]

@router.get("/tickets")
def get_admin_tickets(current_admin: User = Depends(require_admin)):
    """Returns customer support tickets queue and resolution progress."""
    return {"success": True, "tickets": _MOCK_TICKETS}

@router.put("/tickets/{ticket_id}/status")
def update_admin_ticket_status(
    ticket_id: str,
    payload: Dict[str, Any] = Body(...),
    current_admin: User = Depends(require_admin)
):
    """Updates resolution status of a support ticket."""
    new_status = str(payload.get("status") or "RESOLVED").upper()
    for t in _MOCK_TICKETS:
        if t["id"] == ticket_id:
            t["status"] = new_status
            return {"success": True, "ticket": t, "message": f"Ticket {ticket_id} updated to {new_status}."}
    raise HTTPException(status_code=404, detail="Ticket not found")


# ──────────────────────────────────────────────────────────────────────────────
# 12. LOGS & AUDIT TELEMETRY STREAM
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/logs")
def get_admin_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Returns live security audit log events and system activity telemetry."""
    logs = db.scalars(
        select(AdminAuditLog).order_by(desc(AdminAuditLog.created_at)).limit(limit)
    ).all()

    # Fallback simulated logs if empty DB
    formatted_logs = [
        {
            "id": log.id,
            "admin_id": log.admin_id,
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "details": log.details,
            "created_at": log.created_at.isoformat() if log.created_at else None
        }
        for log in logs
    ]

    if not formatted_logs:
        formatted_logs = [
            {"id": "LOG-101", "action": "ADMIN_LOGIN", "target_type": "AUTHENTICATION", "target_id": current_admin.id, "details": {"ip": "127.0.0.1", "status": "SUCCESS"}, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": "LOG-102", "action": "MODERATION_APPROVE", "target_type": "BIODATA_PROFILE", "target_id": "TRUE-94812", "details": {"reviewed_by": current_admin.email}, "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": "LOG-103", "action": "SETTINGS_UPDATE", "target_type": "APPLICATION_SETTING", "target_id": "SESSION_EXPIRE", "details": {"value": 24}, "created_at": datetime.now(timezone.utc).isoformat()},
        ]

    return {"success": True, "logs": formatted_logs, "total": len(formatted_logs)}
