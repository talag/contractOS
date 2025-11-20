# Supabase Setup Instructions

## 1. Run the Database Schema

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/mobiplwrtazuewjskxpt
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `supabase_schema.sql` into the editor
5. Click **Run** to execute the SQL and create the tables

## 2. Configure Google OAuth

### Step 1: Get Your Google OAuth Credentials
You need your Google OAuth credentials from the Google Cloud Console.
- **Client ID**: Found in your Google Cloud Console
- **Client Secret**: Found in your Google Cloud Console

### Step 2: Update Google OAuth Redirect URIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Add this authorized redirect URI:
   ```
   https://mobiplwrtazuewjskxpt.supabase.co/auth/v1/callback
   ```
4. Save the changes

### Step 3: Enable Google Auth in Supabase
1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list of providers
3. Toggle it **ON**
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Client ID from Google Cloud Console
   - **Client Secret**: Your Client Secret from Google Cloud Console
5. Click **Save**

## 3. Configure Site URL and Redirect URLs

1. Still in **Authentication** settings, go to **URL Configuration**
2. Set the **Site URL** to: `http://localhost:5173`
3. Add **Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/dashboard`

## 4. Verify Setup

After completing these steps:
1. The database tables will be created with proper Row Level Security policies
2. Google OAuth will be configured and ready to use
3. Users will be able to sign up and log in with Google

## Next Steps

Once you've completed these setup steps, let me know and I'll update the frontend code to use Supabase authentication instead of the FastAPI backend.
