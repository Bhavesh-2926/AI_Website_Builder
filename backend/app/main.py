from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import auth, websites, ai, media, seo, publish

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for frontend requests
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(websites.router, prefix=f"{settings.API_V1_STR}/websites", tags=["websites"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])
app.include_router(media.router, prefix=f"{settings.API_V1_STR}/media", tags=["media"])
app.include_router(seo.router, prefix=f"{settings.API_V1_STR}/seo", tags=["seo"])
app.include_router(publish.router, prefix=f"{settings.API_V1_STR}", tags=["publishing"])

@app.get("/")
def get_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "mode": "mock-active" if not settings.SUPABASE_URL else "production-active"
    }
