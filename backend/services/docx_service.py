import io
import docx
from fastapi import HTTPException

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text content from a DOCX file."""
    try:
        doc = docx.Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")
