# Supabase Migration Complete

The ContractMind app has been successfully migrated from FastAPI + SQLite to Supabase for authentication and database management.

## What Was Changed

### 1. Authentication System
- **Before**: FastAPI backend with JWT tokens and local user management
- **After**: Supabase Auth with built-in Google OAuth support

### 2. Database
- **Before**: SQLite database managed by backend
- **After**: PostgreSQL database managed by Supabase with Row Level Security

### 3. Files Modified

#### Frontend Files:
- [src/lib/supabase.ts](src/lib/supabase.ts) - NEW: Supabase client configuration
- [src/lib/contracts.ts](src/lib/contracts.ts) - NEW: Contracts service using Supabase
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) - Updated to use Supabase Auth
- [src/pages/Login.tsx](src/pages/Login.tsx) - Updated to use email instead of username
- [src/pages/Signup.tsx](src/pages/Signup.tsx) - Updated to use Supabase
- [src/pages/AuthCallback.tsx](src/pages/AuthCallback.tsx) - Updated for Supabase OAuth
- [src/stores/contractStore.ts](src/stores/contractStore.ts) - Updated to use contractsService
- [src/components/contracts/AddContractModal.tsx](src/components/contracts/AddContractModal.tsx) - Updated to use contractsService
- [src/components/contracts/ContractTable.tsx](src/components/contracts/ContractTable.tsx) - Updated to use contractsService
- [src/components/contracts/ContractDrawer.tsx](src/components/contracts/ContractDrawer.tsx) - Updated to use contractsService

#### Configuration Files:
- [.env](.env) - Contains Supabase credentials
- [supabase_schema.sql](supabase_schema.sql) - Database schema to run in Supabase
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Setup instructions

## Next Steps

### Step 1: Set Up Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard/project/mobiplwrtazuewjskxpt
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of [supabase_schema.sql](supabase_schema.sql)
5. Click **Run** to create the tables and Row Level Security policies

### Step 2: Configure Google OAuth in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and toggle it **ON**
3. Enter your credentials:
   - Client ID: `96804919262-nua0uadjt6f9760hctp6diifo0i43rpf.apps.googleusercontent.com`
   - Client Secret: `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`
4. Click **Save**

### Step 3: Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Add this authorized redirect URI:
   ```
   https://mobiplwrtazuewjskxpt.supabase.co/auth/v1/callback
   ```
4. Save the changes

### Step 4: Configure Supabase Auth URLs

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:5173`
3. Add **Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/dashboard`

### Step 5: Test the Application

Once you've completed the above steps, you can test:

1. **Email/Password Signup**: Create a new account with email and password
2. **Email/Password Login**: Sign in with your credentials
3. **Google OAuth**: Click "Sign in with Google" button
4. **Contract Management**: Upload, view, edit, and delete contracts
5. **Analytics**: Use the AI chat feature (still uses backend for AI processing)

## Important Notes

### What Still Uses the Backend

The following features still require the Python backend to be running:

1. **Contract Extraction**: AI-powered contract data extraction from PDF/DOCX files
   - Endpoint: `POST /api/contracts/extract`

2. **Analytics Chat**: AI-powered contract analytics
   - Endpoint: `POST /api/analytics/chat`

These features use OpenAI and require the backend service. Make sure to keep the backend running with:

```bash
npm run backend
```

### What Now Uses Supabase

1. **User Authentication**: Login, signup, Google OAuth
2. **Contract Storage**: All CRUD operations for contracts
3. **User Profiles**: Custom user data (username, profile picture, etc.)

### Environment Variables

The app now uses these environment variables in [.env](.env):

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key
- `VITE_OPENAI_API_KEY`: OpenAI API key (for backend AI features)

## Architecture

### Authentication Flow

```
User → Frontend (Supabase Auth) → Supabase Auth Service
                                       ↓
                                  auth.users table
                                       ↓
                                  custom users table
```

### Contract Management Flow

```
User → Frontend → Supabase Client → PostgreSQL
                                       ↓
                                  contracts table
                                  (with RLS policies)
```

### AI Features Flow

```
User → Frontend → FastAPI Backend → OpenAI API
                       ↓
                  Supabase (for auth token validation)
```

## Security Features

1. **Row Level Security (RLS)**: Users can only access their own data
2. **JWT-based Authentication**: Secure token-based auth
3. **Encrypted Connections**: All data transmitted over HTTPS
4. **OAuth 2.0**: Secure Google sign-in

## Troubleshooting

### If login doesn't work:
- Check that you ran the SQL schema in Supabase
- Verify Google OAuth is configured correctly
- Check browser console for errors

### If contracts don't load:
- Ensure RLS policies are set up correctly
- Check that user profile exists in custom users table
- Verify Supabase credentials in .env file

### If Google OAuth fails:
- Verify redirect URI is added in Google Cloud Console
- Check that Google provider is enabled in Supabase
- Ensure credentials are entered correctly

## Support

For issues or questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
