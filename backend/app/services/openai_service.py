from typing import Dict, Any, Optional
import os
import httpx
from app.core.config import settings
from app.services.supabase_service import supabase_service
from openai import OpenAI

class OpenAIService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    async def generate_image(self, website_id: str, prompt: str) -> Dict[str, Any]:
        """
        Generates an image from prompt.
        Saves the image buffer to Supabase storage, registers it in the media table, and returns the details.
        """
        if not self.client:
            return await self._generate_mock_image(website_id, prompt)

        try:
            # Request image generation from DALL-E
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="url"
            )
            image_url = response.data[0].url

            # Download the image content to upload to Supabase Storage
            async with httpx.AsyncClient() as client:
                res = await client.get(image_url)
                if res.status_code != 200:
                    raise Exception("Failed to download generated image from OpenAI")
                img_data = res.content

            # Define filename and upload path
            safe_prompt = "".join([c if c.isalnum() else "_" for c in prompt[:20]]).strip("_")
            filename = f"gen_{safe_prompt}_{os.urandom(4).hex()}.png"
            storage_path = f"websites/{website_id}/media/{filename}"

            # Upload to Supabase Storage
            bucket_name = "website-assets"
            public_url = supabase_service.upload_file(
                bucket=bucket_name,
                path=storage_path,
                file_content=img_data,
                content_type="image/png"
            )

            # Insert database record into Media table
            media_record = supabase_service.add_media(
                website_id=website_id,
                file_url=public_url,
                file_type="image/png"
            )
            return media_record

        except Exception as e:
            print(f"OpenAI Image generation failed: {e}. Falling back to mock image.")
            return await self._generate_mock_image(website_id, prompt)

    async def _generate_mock_image(self, website_id: str, prompt: str) -> Dict[str, Any]:
        """
        Fallback mock generator mapping prompt keywords to beautiful curated Unsplash stock images.
        """
        prompt_lower = prompt.lower()
        
        # Keyword mappings to high quality Unsplash images
        keywords = {
            "bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            "bread": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
            "cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
            "pastry": "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=800&q=80",
            "cafe": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
            "coffee": "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
            "restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            "food": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
            "gym": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
            "fitness": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
            "workout": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
            "office": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            "workspace": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
            "agency": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
            "ecommerce": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
            "product": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
            "fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
        }

        # Try to match keyword, otherwise default to tech code background
        selected_url = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
        for kw, url in keywords.items():
            if kw in prompt_lower:
                selected_url = url
                break

        # Register in media database and return
        media_record = supabase_service.add_media(
            website_id=website_id,
            file_url=selected_url,
            file_type="image/jpeg"
        )
        return media_record

openai_service = OpenAIService()
