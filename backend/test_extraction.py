"""
Test script to verify OpenAI extraction is working
Run with: python -m backend.test_extraction
"""
import asyncio
from backend.services.ai_service import extract_contract_details
from backend.config import settings

async def test_extraction():
    print("Testing OpenAI Contract Extraction")
    print("=" * 50)
    
    # Check API key
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "":
        print("❌ ERROR: OpenAI API key not configured!")
        print("Please set OPENAI_API_KEY in backend/.env file")
        return
    
    print(f"✓ API Key configured: {settings.OPENAI_API_KEY[:10]}...")
    
    # Sample contract text
    sample_contract = """
    SERVICE AGREEMENT
    
    This Service Agreement ("Agreement") is entered into as of January 15, 2024
    between TechCorp Solutions Inc. and Global Enterprises Ltd.
    
    Primary Contact: Sarah Johnson
    Email: sarah.johnson@globalenterprises.com
    Phone: +1 (555) 123-4567
    
    Contract Period: This agreement shall commence on February 1, 2024 and 
    continue until January 31, 2025.
    
    Contract Value: The total contract value is $150,000 USD.
    
    Payment Terms: Client shall pay in monthly installments of $12,500, 
    due on the first day of each month. Payment is due within 30 days of invoice.
    
    Termination: Either party may terminate this agreement with 60 days 
    written notice. Early termination fees may apply.
    
    Services: Provider will deliver software development and maintenance services
    including bug fixes, feature updates, and technical support during business hours.
    """
    
    print("\nExtracting from sample contract...")
    print("-" * 50)
    
    result = await extract_contract_details(sample_contract)
    
    print("\n✓ Extraction Results:")
    print("-" * 50)
    for key, value in result.items():
        print(f"{key}: {value}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    asyncio.run(test_extraction())
