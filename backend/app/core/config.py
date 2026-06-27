from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SwiftSite API"
    API_V1_STR: str = "/api"
    
    # Supabase Configuration
    SUPABASE_URL: str = Field(default="", validation_alias="SUPABASE_URL")
    SUPABASE_ANON_KEY: str = Field(default="", validation_alias="SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="", validation_alias="SUPABASE_SERVICE_ROLE_KEY")
    
    # OpenAI API Configuration
    OPENAI_API_KEY: str = Field(default="", validation_alias="OPENAI_API_KEY")
    
    # CORS Origins (Comma separated or asterisks)
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Server configuration
    PORT: int = Field(default=8000, validation_alias="PORT")
    HOST: str = "0.0.0.0"
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
```
