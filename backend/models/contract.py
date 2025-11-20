from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    file_name = Column(String, nullable=False)
    contact_name = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    contract_value = Column(Float)
    payment_terms = Column(Text)
    termination_terms = Column(Text)
    summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="contracts")
