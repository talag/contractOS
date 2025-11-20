-- Supabase Database Schema for ContractMind
-- Run this SQL in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
-- Note: Supabase has a built-in auth.users table, but we'll create our own users table
-- for additional profile information
-- IMPORTANT: id must be UUID to match Supabase Auth user IDs
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  profile_picture TEXT,  -- Profile picture URL
  auth_provider TEXT DEFAULT 'local',  -- 'local' or 'google'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  start_date TEXT,
  end_date TEXT,
  contract_value DECIMAL(10, 2),
  payment_terms TEXT,
  termination_terms TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON public.contracts(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow inserts for new user registration
CREATE POLICY "Allow user registration" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Contracts table policies
-- Users can view their own contracts
CREATE POLICY "Users can view own contracts" ON public.contracts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own contracts
CREATE POLICY "Users can insert own contracts" ON public.contracts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own contracts
CREATE POLICY "Users can update own contracts" ON public.contracts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own contracts
CREATE POLICY "Users can delete own contracts" ON public.contracts
  FOR DELETE
  USING (auth.uid() = user_id);
