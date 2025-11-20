from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for Google OAuth users
    google_id = Column(String, unique=True, index=True, nullable=True)  # Google OAuth ID
    profile_picture = Column(String, nullable=True)  # Profile picture URL
    auth_provider = Column(String, default="local")  # "local" or "google"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    contracts = relationship("Contract", back_populates="user", cascade="all, delete-orphan")
