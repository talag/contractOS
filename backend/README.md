# Contract Management Backend

Python FastAPI backend for the Contract Management System.

## Project Structure

```
backend/
├── main.py                 # FastAPI app setup and entry point
├── config.py              # Configuration and environment variables
├── database.py            # Database connection and session management
├── models/
│   ├── __init__.py
│   └── contract.py        # SQLAlchemy Contract model
├── schemas/
│   ├── __init__.py
│   └── contract.py        # Pydantic schemas for validation
├── services/
│   ├── __init__.py
│   ├── pdf_service.py     # PDF text extraction
│   ├── docx_service.py    # DOCX text extraction
│   ├── file_service.py    # File type routing
│   ├── ai_service.py      # OpenAI integration
│   └── contract_service.py # Business logic for contracts
├── routers/
│   ├── __init__.py
│   ├── contracts.py       # Contract CRUD endpoints
│   └── analytics.py       # Analytics endpoints
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_actual_api_key_here
```

4. Run the server:
```bash
python main.py
```

Or from the project root:
```bash
python -m backend.main
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Contracts
- `POST /api/contracts/upload` - Upload and process a contract (PDF or DOCX)
- `GET /api/contracts` - Get all contracts
- `GET /api/contracts/{id}` - Get a specific contract
- `DELETE /api/contracts/{id}` - Delete a contract
- `GET /api/contracts/export/csv` - Export contracts to CSV

### Analytics
- `POST /api/analytics/chat` - Chat with AI about contracts

## Supported File Formats

- **PDF** (.pdf) - Portable Document Format
- **DOCX** (.docx) - Microsoft Word Document

## Architecture

### Separation of Concerns

- **Models**: Database schema definitions (SQLAlchemy)
- **Schemas**: Request/response validation (Pydantic)
- **Services**: Business logic and external integrations
- **Routers**: API endpoint definitions
- **Config**: Centralized configuration management
- **Database**: Database connection and session handling

### Benefits

- ✅ Each file < 100 lines
- ✅ Easy to test individual components
- ✅ Clear separation of concerns
- ✅ Easy to find and modify functionality
- ✅ Can swap implementations easily
