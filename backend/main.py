from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from backend.config import settings
from backend.database import init_db
from backend.routers import contracts_router, analytics_router
from backend.routers.auth import router as auth_router

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(title="Contract Management API")

# CORS middleware - must be added FIRST to handle preflight requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session middleware (required for OAuth)
app.add_middleware(SessionMiddleware, secret_key="your-secret-key-change-this-in-production")

# Include routers
app.include_router(auth_router)
app.include_router(contracts_router)
app.include_router(analytics_router)

@app.get("/")
def read_root():
    return {"message": "Contract Management API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
