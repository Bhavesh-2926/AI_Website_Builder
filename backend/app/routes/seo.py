from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
from app.services.supabase_service import supabase_service
from app.core.security import get_current_user
from app.core.config import settings
from openai import OpenAI

router = APIRouter()

class SEOSchema(BaseModel):
    website_id: str
    title: str
    description: Optional[str] = None
    keywords: Optional[str] = None
    og_image: Optional[str] = None

class GenerateSEORequest(BaseModel):
    website_id: str


@router.get("/{website_id}")
def get_seo_settings(website_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Retrieves SEO properties for the website.
    """
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=403, detail="Not authorized to access these SEO settings")
         
    seo_data = supabase_service.get_seo(website_id)
    if not seo_data:
         # Return a standard default representation
         return {
             "website_id": website_id,
             "title": existing_ws["business_name"],
             "description": f"Welcome to {existing_ws['business_name']}.",
             "keywords": f"{existing_ws['business_name']}, {existing_ws['business_type']}",
             "og_image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
         }
    return seo_data


@router.post("")
def save_seo_settings(seo: SEOSchema, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Upserts the website's SEO settings.
    """
    existing_ws = supabase_service.get_website_by_id(seo.website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=403, detail="Not authorized to edit these SEO settings")

    saved_seo = supabase_service.save_seo(
        website_id=seo.website_id,
        title=seo.title,
        description=seo.description or "",
        keywords=seo.keywords or "",
        og_image=seo.og_image or ""
    )
    return saved_seo


@router.post("/generate")
def generate_seo_meta(req: GenerateSEORequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Generates SEO title, tags, and keywords automatically using OpenAI, or falls back to template metadata.
    """
    existing_ws = supabase_service.get_website_by_id(req.website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
         raise HTTPException(status_code=403, detail="Not authorized")

    # Smart mock fallbacks
    title = f"{existing_ws['business_name']} | Professional {existing_ws['business_type']}"
    description = f"Welcome to the official website of {existing_ws['business_name']}. We specialize in professional {existing_ws['business_type']} services and high-quality experiences. Get in touch today!"
    keywords = f"{existing_ws['business_name']}, local {existing_ws['business_type']}, services near me"

    if settings.OPENAI_API_KEY:
        try:
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            prompt = (
                f"Generate highly optimized search engine metadata for this local business:\n"
                f"Business Name: {existing_ws['business_name']}\n"
                f"Category: {existing_ws['business_type']}\n\n"
                f"Respond with a JSON object containing keys 'title' (under 60 characters), "
                f"'description' (under 160 characters), and 'keywords' (comma separated list of 5 tags).\n"
                f"Do not write markdown backticks. Just output JSON."
            )
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional SEO optimizer. Output strictly JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            result = response.choices[0].message.content.strip()
            if result.startswith("```"):
                result = result.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
                if result.startswith("json"):
                    result = result[4:].strip()

            seo_json = json.loads(result)
            return seo_json
        except Exception as e:
            print(f"Error generating SEO meta tags with AI: {e}")

    return {"title": title, "description": description, "keywords": keywords}
