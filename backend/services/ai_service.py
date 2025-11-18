import json
import openai
from typing import List
from backend.config import settings
from backend.models.contract import Contract

openai.api_key = settings.OPENAI_API_KEY

async def extract_contract_details(text: str) -> dict:
    """Extract contract details using OpenAI."""
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a contract analysis assistant. Extract key information from contracts and return it in JSON format."
                },
                {
                    "role": "user",
                    "content": f"""Analyze this contract and extract the following information in JSON format:
                    - contact_name: Name of the point of contact
                    - contact_email: Email address
                    - contact_phone: Phone number
                    - start_date: Contract start date (YYYY-MM-DD format)
                    - end_date: Contract end date (YYYY-MM-DD format)
                    - contract_value: Total contract value (numeric)
                    - payment_terms: Payment terms description
                    - termination_terms: Termination terms description
                    - summary: A summary of the contract in no more than 5 sentences
                    
                    Contract text:
                    {text[:4000]}
                    
                    Return only valid JSON with these exact keys. If information is not found, use null."""
                }
            ],
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        
        # Try to parse JSON from the response
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # If response is not pure JSON, try to extract JSON from markdown code blocks
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
                return json.loads(json_str)
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
                return json.loads(json_str)
            else:
                raise ValueError("Could not parse JSON from OpenAI response")
    except Exception as e:
        print(f"Error extracting contract details: {str(e)}")
        return {
            "contact_name": None,
            "contact_email": None,
            "contact_phone": None,
            "start_date": None,
            "end_date": None,
            "contract_value": None,
            "payment_terms": None,
            "termination_terms": None,
            "summary": "Error extracting contract details"
        }

async def chat_with_contracts(message: str, contracts: List[Contract]) -> str:
    """Chat with AI about contracts data."""
    # Prepare contract data for context
    contract_data = [{
        "id": c.id,
        "file_name": c.file_name,
        "contact_name": c.contact_name,
        "start_date": c.start_date,
        "end_date": c.end_date,
        "contract_value": c.contract_value,
        "summary": c.summary
    } for c in contracts]
    
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a contract analytics assistant. You have access to the following contracts data:
                    {json.dumps(contract_data, indent=2)}
                    
                    Answer questions about these contracts. Provide insights, statistics, and analysis based on the data."""
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error processing chat: {str(e)}")
