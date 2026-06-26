from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.services.supabase_service import supabase_service
from app.core.security import get_current_user

router = APIRouter()

class UserSync(BaseModel):
    id: str
    email: str
    full_name: str

@router.post("/sync")
def sync_user(user: UserSync):
    """
    Syncs Supabase Authenticated User data into our public.users table.
    Called right after frontend user signup/login success.
    """
    try:
        synced_user = supabase_service.sync_user(
            user_id=user.id,
            email=user.email,
            full_name=user.full_name
        )
        return {"status": "success", "user": synced_user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to sync user: {str(e)}")

@router.get("/me")
def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns the current authenticated user session data.
    """
    return current_user
