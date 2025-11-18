from sqlalchemy.orm import Session
from typing import List, Optional
from backend.models.contract import Contract
from backend.schemas.contract import ContractCreate

def create_contract(db: Session, contract_data: dict, file_name: str) -> Contract:
    """Create a new contract in the database."""
    contract = Contract(
        file_name=file_name,
        contact_name=contract_data.get("contact_name"),
        contact_email=contract_data.get("contact_email"),
        contact_phone=contract_data.get("contact_phone"),
        start_date=contract_data.get("start_date"),
        end_date=contract_data.get("end_date"),
        contract_value=contract_data.get("contract_value"),
        payment_terms=contract_data.get("payment_terms"),
        termination_terms=contract_data.get("termination_terms"),
        summary=contract_data.get("summary")
    )
    
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract

def get_all_contracts(db: Session) -> List[Contract]:
    """Get all contracts from the database."""
    return db.query(Contract).all()

def get_contract_by_id(db: Session, contract_id: int) -> Optional[Contract]:
    """Get a specific contract by ID."""
    return db.query(Contract).filter(Contract.id == contract_id).first()

def delete_contract_by_id(db: Session, contract_id: int) -> bool:
    """Delete a contract by ID."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        return False
    
    db.delete(contract)
    db.commit()
    return True
