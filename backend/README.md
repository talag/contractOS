# Contract Management System

A full-stack contract management application with AI-powered contract extraction using OpenAI GPT-4.

## Architecture Overview

This project uses a modern full-stack architecture with separated frontend and backend:

### Frontend (Vercel)
- **Platform**: Vercel
- **Framework**: React + Vite + TypeScript
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase PostgreSQL
- **URL**: https://contract-os-sigma.vercel.app
- **Features**:
  - React-based UI with TypeScript
  - Supabase authentication and database
  - File upload and contract management
  - AI-powered contract extraction integration

### Backend (Railway)
- **Platform**: Railway
- **Framework**: FastAPI (Python)
- **AI Service**: OpenAI GPT-4
- **URL**: https://contractos-production.up.railway.app
- **Features**:
  - RESTful API for contract operations
  - AI-powered document extraction (PDF, DOCX)
  - Contract data processing
  - Analytics and chat endpoints

### Database (Supabase)
- **Platform**: Supabase
- **Type**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Built-in auth with Google OAuth
- **Features**:
  - User management
  - Contract storage
  - Real-time capabilities
  - Secure row-level access control

## Project Structure

```
.
├── backend/                    # FastAPI backend (deployed to Railway)
│   ├── main.py                # FastAPI app setup and CORS configuration
│   ├── config.py              # Environment variables and settings
│   ├── database.py            # Database connection (legacy SQLite)
│   ├── models/
│   │   ├── contract.py        # SQLAlchemy Contract model
│   │   └── user.py            # User model
│   ├── schemas/
│   │   └── contract.py        # Pydantic schemas for validation
│   ├── services/
│   │   ├── pdf_service.py     # PDF text extraction
│   │   ├── docx_service.py    # DOCX text extraction
│   │   ├── file_service.py    # File type routing
│   │   ├── ai_service.py      # OpenAI GPT-4 integration
│   │   └── contract_service.py # Business logic for contracts
│   ├── routers/
│   │   ├── contracts.py       # Contract CRUD and extraction endpoints
│   │   ├── analytics.py       # Analytics and AI chat endpoints
│   │   └── auth.py            # Authentication endpoints
│   ├── utils/
│   │   └── auth.py            # Authentication utilities
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (not in git)
├── src/                       # React frontend (deployed to Vercel)
│   ├── components/
│   │   ├── contracts/         # Contract-related components
│   │   ├── analytics/         # Analytics components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client configuration
│   │   ├── api.ts             # Backend API client
│   │   └── contracts.ts       # Contract service functions
│   ├── pages/                 # Route pages
│   ├── stores/                # State management
│   └── types/                 # TypeScript type definitions
├── nixpacks.toml              # Railway build configuration
├── Procfile                   # Railway process configuration
└── requirements.txt           # Root requirements (for Railway)
```

## Platform Setup

### 1. Supabase (Database & Auth)
**Purpose**: PostgreSQL database with built-in authentication

**Setup**:
1. Create project at https://supabase.com
2. Run SQL schema from `supabase_schema.sql`
3. Enable Google OAuth in Authentication → Providers
4. Configure redirect URLs:
   - Production: `https://contract-os-sigma.vercel.app/auth/callback`
   - Local: `http://localhost:5173/auth/callback`

**Environment Variables**:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Railway (Backend)
**Purpose**: FastAPI backend hosting with automatic deployments

**Setup**:
1. Create project at https://railway.app
2. Connect GitHub repository
3. Set build configuration in `nixpacks.toml`
4. Add environment variables (see below)

**Environment Variables**:
```bash
OPENAI_API_KEY=sk-proj-your-key
DATABASE_URL=sqlite:///./contracts.db  # Legacy, not used with Supabase
```

**Deployment**:
- Auto-deploys on push to `master` branch
- Build uses Python 3.13
- Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### 3. Vercel (Frontend)
**Purpose**: React frontend hosting with automatic deployments

**Setup**:
1. Create project at https://vercel.com
2. Import GitHub repository
3. Framework: Vite
4. Add environment variables (see below)

**Environment Variables**:
```bash
VITE_API_URL=https://contractos-production.up.railway.app
VITE_API_BASE_URL=https://contractos-production.up.railway.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-key  # Used for client-side features
```

**Deployment**:
- Auto-deploys on push to `master` branch
- Build command: `npm run build`
- Output directory: `dist`

## Local Development

### Backend Setup

1. Install Python dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
OPENAI_API_KEY=your_key
DATABASE_URL=sqlite:///./contracts.db
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

3. Run the backend:
```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

API available at: http://localhost:8000

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000
```

3. Run the frontend:
```bash
npm run dev
```

App available at: http://localhost:5173

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Contracts
- `POST /api/contracts/extract` - Extract contract details from uploaded file (PDF/DOCX)
- `POST /api/contracts/upload` - Save extracted contract to database
- `GET /api/contracts` - Get all contracts for current user
- `GET /api/contracts/{id}` - Get specific contract
- `DELETE /api/contracts/{id}` - Delete contract
- `GET /api/contracts/export/csv` - Export contracts to CSV

### Analytics
- `POST /api/analytics/chat` - Chat with AI about contracts

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/google/login` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback

## Features

### AI-Powered Extraction
- Extracts key information from contracts using OpenAI GPT-4
- Supports PDF and DOCX formats
- Extracts: contact details, dates, values, terms, and summary

### Supported File Formats
- **PDF** (.pdf) - Portable Document Format
- **DOCX** (.docx) - Microsoft Word Document

### Security
- Google OAuth authentication via Supabase
- Row Level Security (RLS) in PostgreSQL
- CORS configuration for cross-origin requests
- Secure API key management

## Technology Stack

**Frontend**:
- React 18
- TypeScript
- Vite
- TailwindCSS
- Supabase Client
- Zustand (state management)

**Backend**:
- Python 3.13
- FastAPI
- OpenAI API (GPT-4)
- PyPDF2 (PDF parsing)
- python-docx (DOCX parsing)
- SQLAlchemy (ORM, legacy)
- Pydantic (validation)

**Infrastructure**:
- Vercel (Frontend hosting)
- Railway (Backend hosting)
- Supabase (Database & Auth)
- GitHub (Version control & CI/CD)

## Architecture Benefits

### Separation of Concerns
- **Frontend**: User interface and interaction
- **Backend**: Business logic and AI processing
- **Database**: Data storage and authentication

### Scalability
- Independent scaling of frontend and backend
- Serverless frontend deployment
- Containerized backend deployment

### Security
- API keys never exposed to client
- Row-level security in database
- OAuth authentication flow

### Developer Experience
- Hot reload in development
- Automatic deployments
- Type safety with TypeScript
- API documentation with Swagger

## Deployment Flow

1. **Push to GitHub** → Triggers CI/CD
2. **Vercel** → Builds and deploys frontend
3. **Railway** → Builds and deploys backend
4. **Supabase** → Manages database and auth

All deployments are automatic on push to `master` branch.
