from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ContractCreate(BaseModel):
    file_name: str
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    contract_value: Optional[float] = None
    payment_terms: Optional[str] = None
    termination_terms: Optional[str] = None
    summary: Optional[str] = None

class ContractResponse(BaseModel):
    id: int
    file_name: str
    contact_name: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    start_date: Optional[str]
    end_date: Optional[str]
    contract_value: Optional[float]
    payment_terms: Optional[str]
    termination_terms: Optional[str]
    summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
