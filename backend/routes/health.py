from fastapi import APIRouter, HTTPException, status
from backend.db.session import check_db_connection

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/db")
def db_health_check():
    """
    Database health check endpoint.
    Verifies active communication with the configured database engine.
    Does not expose sensitive credentials, connection strings, or error details.
    """
    is_connected = check_db_connection()
    if is_connected:
        return {
            "status": "OK",
            "database": "CONNECTED",
            "message": "Database communication verified successfully"
        }
    
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "status": "ERROR",
            "database": "UNAVAILABLE",
            "message": "Unable to establish database connection"
        }
    )
