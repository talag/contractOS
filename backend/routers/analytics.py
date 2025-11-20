from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas.contract import ChatMessage, ChatResponse
from backend.services.ai_service import chat_with_contracts
from backend.services.contract_service import get_user_contracts
from backend.utils.auth import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.post("/chat", response_model=ChatResponse)
async def chat_analytics(
    message: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Chat with AI about the current user's contracts."""
    try:
        contracts = get_user_contracts(db, current_user.id)
        response = await chat_with_contracts(message.message, contracts)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
