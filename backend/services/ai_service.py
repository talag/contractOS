import json
from openai import OpenAI
from typing import List
from backend.config import settings
from backend.models.contract import Contract

# Lazy initialization of OpenAI client
_client = None

def get_client():
    """Get or create OpenAI client."""
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client

async def extract_contract_details(text: str) -> dict:
    """Extract contract details using OpenAI."""

    # Check if API key is configured
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "":
        print("WARNING: OpenAI API key not configured!")
        return {
            "contact_name": "API Key Not Configured",
            "contact_email": None,
            "contact_phone": None,
            "start_date": None,
            "end_date": None,
            "contract_value": None,
            "payment_terms": None,
            "termination_terms": None,
            "summary": "Please configure your OpenAI API key in the .env file to enable AI extraction."
        }

    try:
        print(f"Extracting contract details from text (length: {len(text)} chars)...")
        print(f"First 200 chars: {text[:200]}")

        response = get_client().chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are an intelligent contract analysis assistant. You can analyze ANY type of contract or agreement document (employment agreements, vendor contracts, service agreements, leases, NDAs, etc.) and extract relevant information in a structured way.

Your task is to:
1. Identify what type of document this is
2. Extract ALL relevant contractual information found in the document
3. Return a structured JSON response with the information you find

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanations."""
                },
                {
                    "role": "user",
                    "content": f"""Analyze this document and extract all relevant contractual information. Return a JSON object with the following structure:

{{
  "contact_name": "Full name of the primary contact person, signatory, or party (employer, employee, vendor, client, etc.)",
  "contact_email": "Email address if present",
  "contact_phone": "Phone number with country code if present",
  "start_date": "Effective/start date in YYYY-MM-DD format (employment start date, contract effective date, lease start, etc.)",
  "end_date": "End/expiration date in YYYY-MM-DD format if specified (not all contracts have this - employment may be indefinite, some contracts auto-renew)",
  "contract_value": "Numeric value of the contract/agreement (salary, contract amount, lease amount, etc.) - extract the number only without currency symbols. For employment, use annual salary. For recurring payments, use total contract value if stated.",
  "payment_terms": "Description of payment terms, salary structure, or compensation details",
  "termination_terms": "Description of termination, resignation, cancellation, or exit conditions",
  "summary": "A concise 3-5 sentence summary explaining: (1) what type of document this is, (2) the key parties involved, (3) the main purpose/obligations, and (4) key terms or dates"
}}

INSTRUCTIONS:
- Extract information intelligently based on the document type
- If a field doesn't apply to this type of document, use null
- For dates: convert any date format to YYYY-MM-DD
- For values: extract numeric amounts (salary, fees, contract value, rent, etc.)
- Be flexible: "start_date" could be employment start, contract effective date, lease commencement, etc.
- "contact_name" should be the most relevant person (employee for employment agreement, vendor contact for service contract, etc.)
- In the summary, clearly state what type of document this is

Document text:
{text[:6000]}

Return ONLY the JSON object, nothing else."""
                }
            ],
            temperature=0.2,
            max_tokens=1200
        )

        content = response.choices[0].message.content
        print(f"OpenAI Response: {content}")

        # Try to parse JSON from the response
        try:
            # First try direct JSON parsing
            result = json.loads(content)
            print(f"Successfully parsed JSON: {result}")
            return result
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            # If response is not pure JSON, try to extract JSON from markdown code blocks
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
                result = json.loads(json_str)
                print(f"Extracted from ```json block: {result}")
                return result
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
                result = json.loads(json_str)
                print(f"Extracted from ``` block: {result}")
                return result
            else:
                print(f"Could not parse JSON. Raw content: {content}")
                raise ValueError("Could not parse JSON from OpenAI response")
    except Exception as e:
        print(f"Error extracting contract details: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "contact_name": f"Error: {str(e)}",
            "contact_email": None,
            "contact_phone": None,
            "start_date": None,
            "end_date": None,
            "contract_value": None,
            "payment_terms": None,
            "termination_terms": None,
            "summary": f"Error extracting contract details: {str(e)}"
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
        response = get_client().chat.completions.create(
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
