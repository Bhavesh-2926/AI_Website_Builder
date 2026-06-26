from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from typing import Dict, Any, List
import os
from app.services.supabase_service import supabase_service
from app.core.security import get_current_user

router = APIRouter()

@router.post("/upload-media")
async def upload_media(
    website_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Uploads a file to Supabase Storage and logs its metadata in the media table.
    """
    # Verify website ownership
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to upload media for this website"
        )

    try:
        file_content = await file.read()
        
        # Clean file name and upload path
        sanitized_filename = "".join([c if c.isalnum() or c in "._-" else "_" for c in file.filename])
        filename = f"upload_{os.urandom(4).hex()}_{sanitized_filename}"
        storage_path = f"websites/{website_id}/media/{filename}"
        
        # Upload using Supabase storage wrapper
        bucket_name = "website-assets"
        public_url = supabase_service.upload_file(
            bucket=bucket_name,
            path=storage_path,
            file_content=file_content,
            content_type=file.content_type or "image/octet-stream"
        )
        
        # Log entry in database
        media_record = supabase_service.add_media(
            website_id=website_id,
            file_url=public_url,
            file_type=file.content_type or "image/octet-stream"
        )
        return media_record
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload media: {str(e)}"
        )


@router.get("/website/{website_id}")
def get_website_media(website_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    List all media files registered for a given website.
    """
    existing_ws = supabase_service.get_website_by_id(website_id)
    if not existing_ws or existing_ws["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access media library for this website"
        )
    return supabase_service.get_media(website_id)


@router.delete("/{media_id}")
def delete_media_item(media_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Deletes a media item by ID.
    """
    # In mock database, delete_media handles removing by ID. In production, policies dictate deletion permission.
    success = supabase_service.delete_media(media_id)
    if not success:
        raise HTTPException(status_code=404, detail="Media item not found or could not be deleted")
        
    return {"status": "success", "message": "Media item deleted successfully"}
