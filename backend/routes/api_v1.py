from fastapi import APIRouter
from backend.routes.biodata import router as biodata_router
from backend.routes.otp import router as otp_router
from backend.routes.ai import router as ai_router
from backend.routes.health import router as health_router
from backend.routes.auth import router as auth_router
from backend.routes.admin import router as admin_router
from backend.routes.admin_users import router as admin_users_router
from backend.routes.admin_profiles import router as admin_profiles_router
from backend.routes.admin_settings import router as admin_settings_router
from backend.routes.discovery import router as discovery_router
from backend.routes.interests import router as interests_router
from backend.routes.shortlists import router as shortlists_router
from backend.routes.notifications import router as notifications_router
from backend.routes.public_profile import router as public_profile_router
from backend.routes.captcha import router as captcha_router
from backend.routes.gdpr import router as gdpr_router
from backend.routes.admin_security import router as admin_security_router
from backend.routes.admin_notifications import router as admin_notifications_router
from backend.routes.templates import router as templates_router
from backend.routes.admin_templates import router as admin_templates_router
from backend.routes.user_analytics import router as user_analytics_router

from backend.routes.transliterate import router as transliterate_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router)
api_v1_router.include_router(transliterate_router)

api_v1_router.include_router(auth_router)
api_v1_router.include_router(user_analytics_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(admin_users_router)
api_v1_router.include_router(admin_profiles_router)
api_v1_router.include_router(admin_settings_router)
api_v1_router.include_router(admin_security_router)
api_v1_router.include_router(admin_notifications_router)
api_v1_router.include_router(admin_templates_router)
api_v1_router.include_router(templates_router)
api_v1_router.include_router(discovery_router)
api_v1_router.include_router(biodata_router)
api_v1_router.include_router(otp_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(interests_router)
api_v1_router.include_router(shortlists_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(public_profile_router)
api_v1_router.include_router(captcha_router)
api_v1_router.include_router(gdpr_router)


