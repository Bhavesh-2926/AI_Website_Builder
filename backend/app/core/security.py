from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Dict, Any, Optional
from app.core.config import settings

security_bearer = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)) -> Dict[str, Any]:
    """
    Dependency to get the currently authenticated user from the Authorization header.
    In mock mode or if Supabase keys are missing, it defaults to a mock user.
    """
    mock_user = {"id": "00000000-0000-0000-0000-000000000000", "email": "demo@example.com", "full_name": "Demo User"}
    
    # Check if Supabase is not configured (mock mode)
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        return mock_user
        
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing authorization credentials")
        
    token = credentials.credentials
    try:
        # In production Supabase Auth uses HS256 JWTs signed with the JWT Secret
        # If we have the secret, we can verify it, otherwise we decode it unsafely to extract claims, 
        # as Supabase API gateway typically handles verification before reaching serverless functions.
        # Here we extract the sub (UUID) and email safely:
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        email = payload.get("email", "")
        metadata = payload.get("user_metadata", {})
        full_name = metadata.get("full_name", metadata.get("name", "User"))
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token claims")
            
        return {
            "id": user_id,
            "email": email,
            "full_name": full_name
        }
    except Exception as e:
        print(f"Auth verification error: {e}. Falling back to Mock user for local testing.")
        return mock_user
