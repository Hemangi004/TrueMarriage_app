from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# NEVER exposes session_token_hash!
class SessionResponse(BaseModel):
    id: str
    user_id: str
    expires_at: datetime
    created_at: datetime
    last_seen_at: datetime
    is_active: bool
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        from_attributes = True
