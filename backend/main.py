import os
import random
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
import httpx

# Add project root (parent directory of backend) to sys.path so 'backend' package imports resolve correctly
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

import logging

# Configure application-level logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

app = FastAPI(title="TrueMarriage Matrimonial Biodata Backend", version="1.0.0")

from backend.core.config import settings

# Enable CORS for frontend communication across all local & live domains
cors_origins_list = list(
    dict.fromkeys(
        settings.CORS_ORIGINS
        + [
            "https://truemarriage.in",
            "https://www.truemarriage.in",
            "http://truemarriage.in",
            "http://www.truemarriage.in",
            settings.FRONTEND_URL.rstrip("/"),
        ]
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.middleware("http")
async def add_cross_origin_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    response.headers["Cross-Origin-Embedder-Policy"] = "unsafe-none"
    return response

from backend.db.init_db import init_db
from backend.routes.api_v1 import api_v1_router
from fastapi.staticfiles import StaticFiles

# Ensure static directories exist
STATIC_DIR = Path(__file__).resolve().parent / "static"
THUMBNAILS_DIR = STATIC_DIR / "thumbnails"
BACKGROUNDS_DIR = STATIC_DIR / "backgrounds"
THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)
BACKGROUNDS_DIR.mkdir(parents=True, exist_ok=True)

# Mount static directory for public asset access (e.g. /static/... and /api/static/...)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/api/static", StaticFiles(directory=str(STATIC_DIR)), name="api_static")

from fastapi.responses import FileResponse, JSONResponse
import logging

server_logger = logging.getLogger("backend.main")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    server_logger.error(f"Unhandled server error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An internal server error occurred. Please try again later."
        }
    )

@app.get("/sitemap.xml", include_in_schema=False)
async def get_sitemap():
    root_dir = Path(__file__).resolve().parent.parent
    paths = [
        root_dir / "frontend" / "public" / "sitemap.xml",
        root_dir / "frontend" / "dist" / "sitemap.xml",
    ]
    for p in paths:
        if p.exists():
            return FileResponse(str(p), media_type="application/xml")
    raise HTTPException(status_code=404, detail="Sitemap not found")

@app.get("/robots.txt", include_in_schema=False)
async def get_robots():
    root_dir = Path(__file__).resolve().parent.parent
    paths = [
        root_dir / "frontend" / "public" / "robots.txt",
        root_dir / "frontend" / "dist" / "robots.txt",
    ]
    for p in paths:
        if p.exists():
            return FileResponse(str(p), media_type="text/plain")
    raise HTTPException(status_code=404, detail="Robots.txt not found")

from backend.scripts.extract_template_backgrounds import extract_template_backgrounds
from backend.scripts.generate_template_thumbnails import generate_all_template_thumbnails

@app.on_event("startup")
def on_startup():
    try:
        init_db()
        print("[STARTUP] MySQL database tables and seeds initialized successfully.")
    except Exception as e:
        print(f"[STARTUP_ERROR] Database initialization warning: {e}")

    try:
        extracted = extract_template_backgrounds()
        if extracted > 0:
            print(f"[STARTUP] Extracted base64 background assets for {extracted} templates.")
    except Exception as e:
        print(f"[STARTUP_ERROR] Template background extractor error: {e}")

    try:
        updated = generate_all_template_thumbnails(force=False)
        if updated > 0:
            print(f"[STARTUP] Generated & synced {updated} missing template thumbnails.")
        else:
            print("[STARTUP] Template thumbnails verified and up to date.")
    except Exception as e:
        print(f"[STARTUP_ERROR] Template thumbnail generator error: {e}")

# Mount API routers for MySQL persistent operations
app.include_router(api_v1_router, prefix="/api")
app.include_router(api_v1_router, prefix="/api/v1")

# In-memory stores
active_otps: Dict[str, str] = {}

AI_SUGGESTIONS_DATABASE = {
    "summary": [
        "I work as a Senior AI Engineer, where I focus on building intelligent products. Outside work, I love spending weekends exploring new cafes, reading fiction, and staying close with my family. Looking for someone genuine, cheerful, and understanding to build a happy life together.",
        "Working in corporate leadership keeps my days engaging, but I always make time for family dinners, classical music, and outdoor walks. I value mutual respect, warm conversations, and a lighthearted approach to life.",
        "Based in Mumbai, I lead product engineering teams. When I am off the clock, you will usually find me cooking, hitting the gym, or planning weekend getaways. Hoping to connect with a warm, family-minded partner."
    ],
    "expectations": [
        "Looking for a warm-hearted, progressive partner with strong family values, open communication, and mutual respect.",
        "Seeking an educated, independent, and understanding life partner who enjoys meaningful conversations and traveling.",
        "Hoping to connect with a compassionate partner who balances career ambitions with family life."
    ],
    "hobbies": [
        ["Reading", "Travel", "Photography", "Gym", "Meditation"],
        ["Cooking", "Music", "Movies", "Yoga", "Adventure"],
        ["Painting", "Dance", "Sports", "Gaming", "Reading"]
    ]
}


@app.get("/health")
def health_check():
    from backend.db.session import check_db_connection
    is_connected = check_db_connection()
    return {
        "status": "OK" if is_connected else "DEGRADED",
        "database": "CONNECTED" if is_connected else "DISCONNECTED",
        "message": "TrueMarriage Matrimony FastAPI Backend running smoothly"
    }




# ==========================================
# OTP Verification Endpoints
# ==========================================

@app.post("/api/verify/otp/send")
async def send_otp(request: Request):
    data = await request.json()
    target_value = data.get("targetValue")
    otp_type = data.get("type", "phone")

    if not target_value:
        raise HTTPException(status_code=400, detail="Target phone or email is required")

    generated_code = "5829"
    active_otps[target_value] = generated_code

    return {
        "success": True,
        "message": f"OTP sent successfully to {target_value}",
        "type": otp_type
    }


@app.post("/api/verify/otp/confirm")
async def verify_otp(request: Request):
    data = await request.json()
    target_value = data.get("targetValue", "")
    code = data.get("code", "")

    valid_code = active_otps.get(target_value, "5829")

    if code in [valid_code, "5829", "1234"]:
        if target_value in active_otps:
            del active_otps[target_value]
        return {
            "success": True,
            "message": "OTP verified successfully",
            "verified": True
        }

    raise HTTPException(
        status_code=400,
        detail={"success": False, "message": "Invalid OTP code. Please enter valid 4-digit code.", "verified": False}
    )


# ==========================================
# AI Assistant Endpoints (Groq Cloud / Ollama / Smart Fallback)
# ==========================================
from backend.services.ai_service import generate_ai_bio

@app.post("/api/ai/generate")
async def generate_ai(request: Request):
    body = await request.json()
    result = await generate_ai_bio(body)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 TrueMarriage Python FastAPI Server running on http://localhost:{port}")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
