from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.supabase_service import supabase_service
from app.core.security import get_current_user

router = APIRouter()

# Schema models
class WebsiteCreate(BaseModel):
    business_name: str
    business_type: str
    theme: str

class WebsiteUpdate(BaseModel):
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    theme: Optional[str] = None
    status: Optional[str] = None
    published_url: Optional[str] = None

class ContentUpdate(BaseModel):
    page_name: str
    content_json: Dict[str, Any]

class DesignUpdate(BaseModel):
    design_json: Dict[str, Any]

class SettingsUpdate(BaseModel):
    settings_json: Dict[str, Any]


@router.get("")
def list_websites(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    List all websites owned by the active user.
    """
    websites = supabase_service.get_websites(current_user["id"])
    return websites


@router.get("/{website_id}")
def get_website(website_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get full details of a specific website: metadata, design, contents, SEO, and settings.
    """
    website = supabase_service.get_website_by_id(website_id)
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")
        
    # Check ownership
    if website["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this website")

    # Fetch supplementary tables
    content = supabase_service.get_website_content(website_id)
    design = supabase_service.get_website_design(website_id)
    seo = supabase_service.get_seo(website_id)
    settings_data = supabase_service.get_settings(website_id)

    return {
        "website": website,
        "content": {c["page_name"]: c["content_json"] for c in content},
        "design": design["design_json"] if design else None,
        "seo": seo if seo else None,
        "settings": settings_data["settings_json"] if settings_data else None
    }


@router.post("")
def create_website(website: WebsiteCreate, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Create a new draft website.
    """
    try:
        new_ws = supabase_service.create_website(
            user_id=current_user["id"],
            business_name=website.business_name,
            business_type=website.business_type,
            theme=website.theme
        )
        
        # Save an initial basic configuration
        supabase_service.save_website_design(new_ws["id"], {
            "font": "Inter",
            "primary": "#4F46E5",
            "secondary": "#06B6D4",
            "accent": "#F59E0B",
            "background": "#0F172A",
            "surface": "rgba(30, 41, 59, 0.7)",
            "text_color": "#F8FAFC",
            "border_radius": "16px",
            "styles": {"navbar": "floating-glass", "hero": "centered-gradient", "card": "glassmorphic-glow"}
        })
        
        supabase_service.save_website_content(new_ws["id"], "Home", {
            "hero": {
                "title": f"Welcome to {website.business_name}",
                "subtitle": f"Experience our professional {website.business_type} services.",
                "cta_text": "Explore Services"
            }
        })
        
        return new_ws
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{website_id}")
def update_website_metadata(
    website_id: str,
    updates: WebsiteUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update core metadata of the website.
    """
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=404, detail="Website not found")

    updated = supabase_service.update_website(website_id, updates.model_dump(exclude_unset=True))
    return updated


@router.put("/{website_id}/content")
def update_page_content(
    website_id: str,
    content: ContentUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Upsert content for a specific page of the website.
    """
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=404, detail="Website not found")

    res = supabase_service.save_website_content(website_id, content.page_name, content.content_json)
    return res


@router.put("/{website_id}/design")
def update_design_tokens(
    website_id: str,
    design: DesignUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update global CSS design tokens for the website.
    """
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=404, detail="Website not found")

    res = supabase_service.save_website_design(website_id, design.design_json)
    return res


@router.put("/{website_id}/settings")
def update_website_settings(
    website_id: str,
    settings: SettingsUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update global settings JSON of the website.
    """
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=404, detail="Website not found")

    res = supabase_service.save_settings(website_id, settings.settings_json)
    return res


@router.delete("/{website_id}")
def delete_website(website_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Delete a website and all related cascading content.
    """
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=404, detail="Website not found")

    success = supabase_service.delete_website(website_id)
    if not success:
         raise HTTPException(status_code=500, detail="Failed to delete website")
    return {"status": "success", "message": "Website deleted"}
