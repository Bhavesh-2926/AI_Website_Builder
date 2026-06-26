from typing import Dict, Any, List, Optional
import os
import uuid
from app.core.config import settings
from supabase import create_client, Client

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        self.client: Optional[Client] = None
        self.is_mock = True

        if self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
                self.is_mock = False
                print("Supabase client initialized successfully.")
            except Exception as e:
                print(f"Failed to initialize Supabase client: {e}. Falling back to Mock mode.")
        else:
            print("Supabase credentials not fully provided. Starting backend in offline Mock mode.")

        # In-memory mock database
        self.mock_users: Dict[str, Dict[str, Any]] = {}
        self.mock_websites: Dict[str, Dict[str, Any]] = {}
        self.mock_content: Dict[str, List[Dict[str, Any]]] = {} # website_id -> list of page contents
        self.mock_design: Dict[str, Dict[str, Any]] = {}      # website_id -> design json
        self.mock_media: Dict[str, List[Dict[str, Any]]] = {}   # website_id -> list of media files
        self.mock_seo: Dict[str, Dict[str, Any]] = {}         # website_id -> seo details
        self.mock_settings: Dict[str, Dict[str, Any]] = {}    # website_id -> settings

    # --- USERS ---
    def sync_user(self, user_id: str, email: str, full_name: str) -> Dict[str, Any]:
        if self.is_mock:
            user = {"id": user_id, "email": email, "full_name": full_name}
            self.mock_users[user_id] = user
            return user
        
        # Real Supabase sync
        response = self.client.table("users").upsert({
            "id": user_id,
            "email": email,
            "full_name": full_name
        }).execute()
        return response.data[0] if response.data else {}

    # --- WEBSITES ---
    def get_websites(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_mock:
            return [ws for ws in self.mock_websites.values() if ws["user_id"] == user_id]
        
        response = self.client.table("websites").select("*").eq("user_id", user_id).execute()
        return response.data

    def get_website_by_id(self, website_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mock:
            return self.mock_websites.get(website_id)
        
        response = self.client.table("websites").select("*").eq("id", website_id).execute()
        return response.data[0] if response.data else None

    def get_website_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        if self.is_mock:
            for ws in self.mock_websites.values():
                if ws.get("published_url") == slug:
                    return ws
            return None
        
        response = self.client.table("websites").select("*").eq("published_url", slug).execute()
        return response.data[0] if response.data else None

    def create_website(self, user_id: str, business_name: str, business_type: str, theme: str) -> Dict[str, Any]:
        ws_id = str(uuid.uuid4())
        website = {
            "id": ws_id,
            "user_id": user_id,
            "business_name": business_name,
            "business_type": business_type,
            "theme": theme,
            "status": "draft",
            "published_url": None,
            "created_at": "2026-06-26T17:28:14Z"
        }
        if self.is_mock:
            self.mock_websites[ws_id] = website
            return website

        response = self.client.table("websites").insert({
            "id": ws_id,
            "user_id": user_id,
            "business_name": business_name,
            "business_type": business_type,
            "theme": theme
        }).execute()
        return response.data[0] if response.data else website

    def update_website(self, website_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_mock:
            if website_id in self.mock_websites:
                self.mock_websites[website_id].update(updates)
                return self.mock_websites[website_id]
            return None

        response = self.client.table("websites").update(updates).eq("id", website_id).execute()
        return response.data[0] if response.data else None

    def delete_website(self, website_id: str) -> bool:
        if self.is_mock:
            if website_id in self.mock_websites:
                del self.mock_websites[website_id]
                self.mock_content.pop(website_id, None)
                self.mock_design.pop(website_id, None)
                self.mock_media.pop(website_id, None)
                self.mock_seo.pop(website_id, None)
                self.mock_settings.pop(website_id, None)
                return True
            return False

        self.client.table("websites").delete().eq("id", website_id).execute()
        return True

    # --- WEBSITE CONTENT ---
    def get_website_content(self, website_id: str) -> List[Dict[str, Any]]:
        if self.is_mock:
            return self.mock_content.get(website_id, [])

        response = self.client.table("website_content").select("*").eq("website_id", website_id).execute()
        return response.data

    def save_website_content(self, website_id: str, page_name: str, content_json: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_mock:
            if website_id not in self.mock_content:
                self.mock_content[website_id] = []
            
            # Find and replace, or append
            pages = self.mock_content[website_id]
            updated = False
            for p in pages:
                if p["page_name"] == page_name:
                    p["content_json"] = content_json
                    updated = True
                    break
            
            if not updated:
                pages.append({
                    "id": str(uuid.uuid4()),
                    "website_id": website_id,
                    "page_name": page_name,
                    "content_json": content_json
                })
            return {"website_id": website_id, "page_name": page_name, "content_json": content_json}

        response = self.client.table("website_content").upsert({
            "website_id": website_id,
            "page_name": page_name,
            "content_json": content_json
        }, on_conflict="website_id,page_name").execute()
        return response.data[0] if response.data else {}

    # --- WEBSITE DESIGN ---
    def get_website_design(self, website_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mock:
            return self.mock_design.get(website_id)

        response = self.client.table("website_design").select("*").eq("website_id", website_id).execute()
        return response.data[0] if response.data else None

    def save_website_design(self, website_id: str, design_json: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_mock:
            self.mock_design[website_id] = {
                "id": str(uuid.uuid4()),
                "website_id": website_id,
                "design_json": design_json
            }
            return self.mock_design[website_id]

        response = self.client.table("website_design").upsert({
            "website_id": website_id,
            "design_json": design_json
        }, on_conflict="website_id").execute()
        return response.data[0] if response.data else {}

    # --- MEDIA ---
    def get_media(self, website_id: str) -> List[Dict[str, Any]]:
        if self.is_mock:
            return self.mock_media.get(website_id, [])

        response = self.client.table("media").select("*").eq("website_id", website_id).execute()
        return response.data

    def add_media(self, website_id: str, file_url: str, file_type: str) -> Dict[str, Any]:
        media_item = {
            "id": str(uuid.uuid4()),
            "website_id": website_id,
            "file_url": file_url,
            "file_type": file_type,
            "created_at": "2026-06-26T17:28:14Z"
        }
        if self.is_mock:
            if website_id not in self.mock_media:
                self.mock_media[website_id] = []
            self.mock_media[website_id].append(media_item)
            return media_item

        response = self.client.table("media").insert(media_item).execute()
        return response.data[0] if response.data else media_item

    def delete_media(self, media_id: str) -> bool:
        if self.is_mock:
            for ws_id, media_list in self.mock_media.items():
                for item in media_list:
                    if item["id"] == media_id:
                        media_list.remove(item)
                        return True
            return False

        self.client.table("media").delete().eq("id", media_id).execute()
        return True

    # --- SEO ---
    def get_seo(self, website_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mock:
            return self.mock_seo.get(website_id)

        response = self.client.table("seo").select("*").eq("website_id", website_id).execute()
        return response.data[0] if response.data else None

    def save_seo(self, website_id: str, title: str, description: str, keywords: str, og_image: str) -> Dict[str, Any]:
        seo_item = {
            "website_id": website_id,
            "title": title,
            "description": description,
            "keywords": keywords,
            "og_image": og_image
        }
        if self.is_mock:
            self.mock_seo[website_id] = {
                "id": str(uuid.uuid4()),
                **seo_item
            }
            return self.mock_seo[website_id]

        response = self.client.table("seo").upsert(seo_item, on_conflict="website_id").execute()
        return response.data[0] if response.data else {}

    # --- SETTINGS ---
    def get_settings(self, website_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mock:
            return self.mock_settings.get(website_id)

        response = self.client.table("settings").select("*").eq("website_id", website_id).execute()
        return response.data[0] if response.data else None

    def save_settings(self, website_id: str, settings_json: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_mock:
            self.mock_settings[website_id] = {
                "id": str(uuid.uuid4()),
                "website_id": website_id,
                "settings_json": settings_json
            }
            return self.mock_settings[website_id]

        response = self.client.table("settings").upsert({
            "website_id": website_id,
            "settings_json": settings_json
        }, on_conflict="website_id").execute()
        return response.data[0] if response.data else {}

    # --- STORAGE UPLOAD ---
    def upload_file(self, bucket: str, path: str, file_content: bytes, content_type: str) -> str:
        """
        Uploads file content to Supabase storage bucket, or returns a local asset/mock path in mock mode.
        """
        if self.is_mock:
            # Mocking upload by returning a standard representation or local static path
            # We can mock it by referencing a placeholder or returning a local dataURI / mock storage URL
            return f"/mock-storage/{bucket}/{path}"

        try:
            # Create bucket if it does not exist (in backend deployment, usually pre-configured)
            # Use supabase-py storage API
            self.client.storage.from_(bucket).upload(
                path=path,
                file=file_content,
                file_options={"content-type": content_type, "x-upsert": "true"}
            )
            # Retrieve public URL
            public_url = self.client.storage.from_(bucket).get_public_url(path)
            return public_url
        except Exception as e:
            print(f"Storage upload failed: {e}. Falling back to default URL.")
            return f"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"

supabase_service = SupabaseService()
