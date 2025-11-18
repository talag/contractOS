from fastapi import HTTPException
from backend.services.pdf_service import extract_text_from_pdf
from backend.services.docx_service import extract_text_from_docx

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from a file based on its extension."""
    file_extension = filename.lower().split('.')[-1]
    
    if file_extension == 'pdf':
        return extract_text_from_pdf(file_content)
    elif file_extension in ['docx', 'doc']:
        return extract_text_from_docx(file_content)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_extension}. Please upload PDF or DOCX files."
        )
