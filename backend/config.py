import os
from pathlib import Path
from dotenv import load_dotenv

# Get the backend directory path
backend_dir = Path(__file__).parent
env_path = backend_dir / '.env'

# Load .env file from backend directory
load_dotenv(dotenv_path=env_path)

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./contracts.db")
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
settings = Settings()
