from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.analysis import router as analysis_router
from src.api.routes.health import router as health_router
from src.core.settings import settings


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(analysis_router)

    return app