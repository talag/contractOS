from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import io
import pandas as pd

from backend.database import get_db
from backend.schemas.contract import ContractResponse
from backend.services.file_service import extract_text_from_file
from backend.services.ai_service import extract_contract_details
from backend.services.contract_service import (
    create_contract,
    get_all_contracts,
    get_contract_by_id,
    delete_contract_by_id
)

router = APIRouter(prefix="/api/contracts", tags=["contracts"])

@router.post("/upload", response_model=ContractResponse)
async def upload_contract(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and process a contract file."""
    try:
        # Validate file type
        allowed_extensions = ['pdf', 'docx', 'doc']
        file_extension = file.filename.lower().split('.')[-1]
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Read file content
        content = await file.read()
        
        # Extract text from file
        text = extract_text_from_file(content, file.filename)
        
        # Extract contract details using AI
        details = await extract_contract_details(text)
        
        # Create contract in database
        contract = create_contract(db, details, file.filename)
        
        return contract
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ContractResponse])
def get_contracts(db: Session = Depends(get_db)):
    """Get all contracts."""
    return get_all_contracts(db)

@router.get("/{contract_id}", response_model=ContractResponse)
def get_contract(contract_id: int, db: Session = Depends(get_db)):
    """Get a specific contract by ID."""
    contract = get_contract_by_id(db, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@router.delete("/{contract_id}")
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    """Delete a contract by ID."""
    success = delete_contract_by_id(db, contract_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contract not found")
    return {"message": "Contract deleted successfully"}

@router.get("/export/csv")
def export_contracts_csv(db: Session = Depends(get_db)):
    """Export all contracts to CSV."""
    contracts = get_all_contracts(db)
    
    # Convert to DataFrame
    data = [{
        "ID": c.id,
        "File Name": c.file_name,
        "Contact Name": c.contact_name,
        "Contact Email": c.contact_email,
        "Contact Phone": c.contact_phone,
        "Start Date": c.start_date,
        "End Date": c.end_date,
        "Contract Value": c.contract_value,
        "Payment Terms": c.payment_terms,
        "Termination Terms": c.termination_terms,
        "Summary": c.summary,
        "Created At": c.created_at
    } for c in contracts]
    
    df = pd.DataFrame(data)
    
    # Create CSV in memory
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    stream.seek(0)
    
    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=contracts.csv"}
    )
