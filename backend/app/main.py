# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.auth_routes import router as auth_router
from .api.dashboard_routes import router as dashboard_router  # new dashboard routes

app = FastAPI()

# CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    # Allow both common dev ports; use a stricter list in production
    allow_origins=["https://invault.pages.dev/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router)
app.include_router(dashboard_router)  # <-- register dashboard routes