import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./contracts.db")
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
settings = Settings()
