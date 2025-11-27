-- Minimal Schema: Create tables first, then apply RLS policies
-- This is the MINIMUM you need to run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: CREATE TABLES FIRST
-- =====================================================

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  content text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  document_id uuid REFERENCES public.documents(id),
  message text NOT NULL,
  role text NOT NULL, -- 'user' or 'assistant'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- STEP 2: ENABLE RLS
-- =====================================================

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: CREATE POLICIES
-- =====================================================

-- Documents policies
CREATE POLICY "Allow authenticated inserts on documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Select own documents"
  ON public.documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Update own documents"
  ON public.documents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delete own documents"
  ON public.documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Allow insert own messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow select own messages"
  ON public.chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);
