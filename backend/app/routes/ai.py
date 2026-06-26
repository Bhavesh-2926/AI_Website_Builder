from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.agents.requirement_agent import requirement_agent
from app.agents.content_agent import content_agent
from app.agents.design_agent import design_agent
from app.services.supabase_service import supabase_service
from app.services.openai_service import openai_service
from app.core.security import get_current_user

router = APIRouter()

# Schema structures
class RequirementsRequest(BaseModel):
    business_name: str
    business_type: str
    theme: str
    pages: List[str]

class ContentRequest(BaseModel):
    business_name: str
    business_type: str
    theme: str
    pages: List[str]
    target_audience: Optional[str] = None
    goals: Optional[List[str]] = None

class DesignRequest(BaseModel):
    business_type: str
    theme: str
    color_preferences: Optional[Dict[str, str]] = None

class GenerateWebsiteRequest(BaseModel):
    business_name: str
    business_category: str
    theme: str
    pages: List[str]
    color_preference: Optional[Dict[str, str]] = None

class GenerateImageRequest(BaseModel):
    website_id: str
    prompt: str


@router.post("/generate-requirements")
async def generate_reqs(req: RequirementsRequest):
    """
    Executes RequirementAgent to parse raw inputs.
    """
    try:
        return await requirement_agent.generate_requirements(
            business_name=req.business_name,
            business_type=req.business_type,
            theme=req.theme,
            pages=req.pages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-content")
async def generate_text(req: ContentRequest):
    """
    Executes ContentAgent to generate website copy.
    """
    try:
        reqs_payload = req.model_dump()
        return await content_agent.generate_content(reqs_payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-design")
async def generate_style(req: DesignRequest):
    """
    Executes DesignAgent to generate design tokens.
    """
    try:
        mock_reqs = {"business_type": req.business_type, "theme": req.theme}
        return await design_agent.generate_design(mock_reqs, req.color_preferences)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-website")
async def generate_full_website(
    payload: GenerateWebsiteRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Orchestrates the entire website generator pipeline:
    1. Triggers Requirement Agent
    2. Triggers Content Agent
    3. Triggers Design Agent
    4. Creates Database Website details
    5. Saves content, designs, default SEO, and settings
    """
    try:
        # Step 1: Create Draft Website Record
        new_ws = supabase_service.create_website(
            user_id=current_user["id"],
            business_name=payload.business_name,
            business_type=payload.business_category,
            theme=payload.theme
        )
        website_id = new_ws["id"]

        # Step 2: Generate Requirements
        reqs = await requirement_agent.generate_requirements(
            business_name=payload.business_name,
            business_type=payload.business_category,
            theme=payload.theme,
            pages=payload.pages
        )

        # Step 3: Generate Design tokens
        design_tokens = await design_agent.generate_design(reqs, payload.color_preference)
        supabase_service.save_website_design(website_id, design_tokens)

        # Step 4: Generate Page Contents
        generated_pages = await content_agent.generate_content(reqs)
        for page_name, page_content in generated_pages.items():
            supabase_service.save_website_content(website_id, page_name, page_content)

        # Step 5: Generate default SEO details
        seo_title = f"{payload.business_name} | Professional {payload.business_category}"
        seo_desc = reqs.get("target_audience", f"Official website of {payload.business_name}")
        seo_keywords = reqs.get("seo_hints", f"{payload.business_name}, {payload.business_category}")
        
        # Default category og image
        default_og_image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
        if payload.business_category.lower() == "bakery":
            default_og_image = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
        elif payload.business_category.lower() == "cafe":
            default_og_image = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"

        supabase_service.save_seo(
            website_id=website_id,
            title=seo_title,
            description=seo_desc,
            keywords=seo_keywords,
            og_image=default_og_image
        )

        # Step 6: Create default settings
        supabase_service.save_settings(website_id, {
            "analytics_id": "",
            "custom_domain": "",
            "enable_contact_form": True
        })

        return {
            "website_id": website_id,
            "website": new_ws,
            "content": generated_pages,
            "design": design_tokens
        }

    except Exception as e:
        print(f"Error in full website generation orchestrator: {e}")
        raise HTTPException(status_code=500, detail=f"Generation pipeline failed: {str(e)}")


@router.post("/generate-image")
async def generate_image_endpoint(
    req: GenerateImageRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Triggers the DALL-E Image Generation service and saves the asset.
    """
    try:
        # Check website ownership
        existing_ws = supabase_service.get_website_by_id(req.website_id)
        if not existing_ws or existing_ws["user_id"] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not authorized to edit this website")

        media_item = await openai_service.generate_image(req.website_id, req.prompt)
        return media_item
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")
