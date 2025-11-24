# Backend Setup Guide

This guide will help you configure the backend for Research Weaver, including Supabase (Database) and Clerk (Authentication).

## 1. Database Setup (Supabase)

### Step 1.1: Run Migrations
You need to add progress tracking columns and RLS policies to your database.

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open the **SQL Editor**.
3.  Click **New Query**.
4.  Paste and run the following SQL:

```sql
-- 1. Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS Policy for Clerk Users
-- This allows users to see only their own documents based on the 'sub' claim in the JWT
CREATE POLICY "Users can only access their own documents"
ON documents
FOR ALL
USING (auth.uid()::text = user_id);

-- 3. Add Progress Tracking Columns (if you haven't already)
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS processing_stage TEXT,
ADD COLUMN IF NOT EXISTS processing_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_message TEXT;

-- 4. Add Indexes
CREATE INDEX IF NOT EXISTS idx_documents_status_user ON documents(status, user_id);
```

## 2. Authentication Setup (Clerk)

### Step 2.1: Create Application
1.  Go to [Clerk Dashboard](https://dashboard.clerk.com/).
2.  Create a new application.
3.  Select **Google** and **Email** as authentication methods.

### Step 2.2: Get API Keys
1.  In your Clerk Dashboard, go to **API Keys**.
2.  Copy the `Publishable Key`.
3.  Open your project's `.env` file and update:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
    ```

### Step 2.3: Integrate with Supabase
To let Supabase recognize Clerk users, you need to create a JWT Template.

1.  In Clerk Dashboard, go to **JWT Templates** (under Configure).
2.  Click **New Template** and select **Supabase**.
3.  Name it `supabase` (lowercase).
4.  **Signing Key**: You need the "JWT Secret" from Supabase.
    *   Go to Supabase Dashboard > Project Settings > API.
    *   Scroll to "JWT Settings" and copy the **JWT Secret**.
    *   Paste this into the "Signing key" field in Clerk.
5.  Click **Save**.

## 3. Environment Variables
Ensure your `.env` file has all the required keys:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 4. Verify Setup
1.  Restart your development server (`npm run dev`).
2.  Click "Sign In" (it should open Clerk).
3.  Sign in with Google.
4.  Upload a document.
5.  If it works, the document will appear in your list, and RLS is working correctly!
