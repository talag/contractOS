# Backend Deployment Guide

This guide will help you deploy the FastAPI backend to Railway so that AI contract extraction works on your Vercel deployment.

## Prerequisites

- GitHub account (you already have this)
- Railway account (free tier available)
- OpenAI API key

## Step 1: Sign up for Railway

1. Go to https://railway.app
2. Click "Login" and sign in with your GitHub account
3. Authorize Railway to access your GitHub

## Step 2: Deploy the Backend

### Option A: Deploy from GitHub (Recommended)

1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `contractOS` repository
4. Railway will detect it's a Python project

### Option B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up
```

## Step 3: Set Environment Variables in Railway

In your Railway project dashboard:

1. Go to **Variables** tab
2. Add these environment variables:

```
OPENAI_API_KEY=your-openai-api-key-here
PORT=8000
```

**Note**: Replace `your-openai-api-key-here` with your actual OpenAI API key from the `.env` file in the backend folder.

## Step 4: Get Your Railway Backend URL

1. After deployment completes, Railway will give you a URL like:
   `https://your-app.up.railway.app`
2. Copy this URL

## Step 5: Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Click on your **contract-os-sigma** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-app.up.railway.app` (your Railway URL from Step 4)
   - **Environments**: Check all (Production, Preview, Development)
5. Click **Save**

## Step 6: Redeploy Vercel

1. Go to the **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the three dots (**···**) menu
4. Click **Redeploy**
5. Uncheck "Use existing Build Cache"
6. Click **Redeploy**

## Step 7: Test It!

1. Wait 2-3 minutes for the Vercel deployment to complete
2. Visit https://contract-os-sigma.vercel.app
3. Login and try uploading a contract
4. The AI extraction should now work!

## Troubleshooting

### Backend not starting on Railway

Check the logs in Railway dashboard:
- Go to your project
- Click **Deployments**
- Click on the latest deployment
- Check the **Deploy Logs** tab

Common issues:
- Missing `OPENAI_API_KEY` environment variable
- Wrong Python version (Railway should auto-detect from requirements.txt)

### CORS errors on Vercel

The backend is already configured to allow requests from `https://contract-os-sigma.vercel.app`. If you change your Vercel domain, update `backend/config.py` line 20 with your new domain.

### "Failed to extract" error on Vercel

1. Check that `VITE_API_BASE_URL` is set correctly in Vercel
2. Make sure your Railway backend is running (check Railway dashboard)
3. Try the Railway URL directly in your browser: `https://your-app.up.railway.app`
   - You should see: `{"message":"Contract Management API"}`

## Alternative: Render.com

If you prefer Render over Railway:

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Set:
   - **Name**: contract-backend
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (same as Railway)
7. Click "Create Web Service"

Then follow steps 4-7 above with your Render URL instead.
