# Fix Authentication and Storage Issues

Follow these 2 steps to fix the errors you're seeing.

## Step 1: Fix Storage RLS (Supabase)

1.  Open [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to **SQL Editor** -> **New Query**.
3.  Copy and paste the code below:

```sql
-- Storage Policies for 'documents' bucket

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Allow users to upload their own files
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own files
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own files
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

4.  Click **Run**.

## Step 2: Fix Clerk Token Error (Clerk Dashboard)

The 404 error happens because your code asks for a "supabase" token, but Clerk doesn't know how to generate it yet.

1.  Go to [Clerk Dashboard](https://dashboard.clerk.com/).
2.  Select your application.
3.  Go to **JWT Templates** (in the sidebar).
4.  Click **New Template**.
5.  Select **Supabase** from the list.
6.  **Name**: Ensure the name is exactly `supabase` (lowercase).
7.  **Signing Key**:
    - Go to your Supabase Dashboard -> Project Settings -> API.
    - Copy the **JWT Secret**.
    - Paste it into the "Signing key" field in Clerk.
8.  Click **Save**.

## Verification

1.  Refresh your application.
2.  Try to upload a document again.
3.  It should work now!
