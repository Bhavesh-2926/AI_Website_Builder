from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid
from app.services.supabase_service import supabase_service
from app.core.security import get_current_user

router = APIRouter()

class PublishRequest(BaseModel):
    website_id: str
    custom_slug: Optional[str] = None


@router.post("/publish")
def publish_website(
    req: PublishRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Transitions the site from Draft to Published and assigns a unique URL slug.
    """
    existing_ws = supabase_service.get_website_by_id(req.website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=403, detail="Not authorized to publish this website")

    # Generate or sanitize custom slug
    raw_slug = req.custom_slug or existing_ws["business_name"]
    slug = "".join([c.lower() if c.isalnum() else "-" for c in raw_slug]).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")

    # Check for slug collision
    collision = supabase_service.get_website_by_slug(slug)
    if collision and collision["id"] != req.website_id:
         # Append a random short suffix if slug is taken
         slug = f"{slug}-{str(uuid.uuid4())[:8]}"

    updates = {
        "status": "published",
        "published_url": slug
    }

    updated = supabase_service.update_website(req.website_id, updates)
    return {
        "status": "success",
        "message": f"Website successfully published at slug: {slug}",
        "website": updated
    }


@router.get("/published/{slug_or_id}")
def get_public_published_website(slug_or_id: str):
    """
    Public Endpoint (No JWT Auth required).
    Resolves the website by ID or by custom slug, verifies it is published, and returns the renderer payload.
    """
    website = None
    
    # Try parsing as UUID first
    try:
        uuid.UUID(slug_or_id)
        website = supabase_service.get_website_by_id(slug_or_id)
    except ValueError:
        # Fall back to slug resolution
        website = supabase_service.get_website_by_slug(slug_or_id)

    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Published website not found"
        )

    if website["status"] != "published":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This website is a draft and is not public yet"
        )

    content_data = supabase_service.get_website_content(website["id"])
    design_data = supabase_service.get_website_design(website["id"])
    seo_data = supabase_service.get_seo(website["id"])

    return {
        "website": website,
        "content": {c["page_name"]: c["content_json"] for c in content_data},
        "design": design_data["design_json"] if design_data else None,
        "seo": seo_data
    }
