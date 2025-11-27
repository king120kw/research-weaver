# Research Weaver - Database Setup Guide

## Overview
This guide will help you set up the Supabase database schema and configure OAuth providers for your Research Weaver application.

## Prerequisites
- Supabase account with a project created
- Access to your Supabase dashboard
- Google Gemini API key (already configured ✅)

---

## Step 1: Apply Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project: `wripeviofzxghjdouifk`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Execute Migration**
   - Open the file: `supabase/migrations/20250124_create_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these new tables:
     - `user_profiles`
     - `documents`
     - `chat_sessions`
     - `chat_messages`
     - `user_activity`

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref wripeviofzxghjdouifk

# Apply migrations
supabase db push
```

---

## Step 2: Create Storage Buckets

### Create 'avatars' Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**
3. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Yes
   - **File size limit**: 2 MB
   - **Allowed MIME types**: `image/*`
4. Click **"Create bucket"**

### Create 'documents' Bucket

1. Click **"New bucket"** again
2. Configure:
   - **Name**: `documents`
   - **Public bucket**: ❌ No (private)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: 
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `text/plain`
3. Click **"Create bucket"**

### Set Storage Policies

For the `documents` bucket, add RLS policies:

```sql
-- Allow users to upload their own documents
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Step 3: Configure Google OAuth

### Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: [https://console.cloud.google.com/](https://console.cloud.google.com/)

2. **Create or Select Project**
   - Create a new project or select existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Research Weaver"
   - Authorized redirect URIs:
     ```
     https://wripeviofzxghjdouifk.supabase.co/auth/v1/callback
     ```
   - Click "Create"

5. **Copy Credentials**
   - Copy the **Client ID**
   - Copy the **Client Secret**

### Configure in Supabase

1. **Go to Supabase Dashboard**
   - Navigate to "Authentication" → "Providers"

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it **ON**

3. **Enter Credentials**
   - Paste your **Client ID**
   - Paste your **Client Secret**
   - Click "Save"

---

## Step 4: Configure Facebook OAuth

### Get Facebook OAuth Credentials

1. **Go to Facebook Developers**
   - Visit: [https://developers.facebook.com/](https://developers.facebook.com/)

2. **Create App**
   - Click "Create App"
   - Choose "Consumer" as app type
   - Fill in app details:
     - App name: "Research Weaver"
     - Contact email: your email

3. **Add Facebook Login**
   - In your app dashboard, click "Add Product"
   - Find "Facebook Login" and click "Set Up"

4. **Configure OAuth Redirect**
   - Go to "Facebook Login" → "Settings"
   - Add to "Valid OAuth Redirect URIs":
     ```
     https://wripeviofzxghjdouifk.supabase.co/auth/v1/callback
     ```
   - Click "Save Changes"

5. **Get App Credentials**
   - Go to "Settings" → "Basic"
   - Copy the **App ID**
   - Click "Show" next to **App Secret** and copy it

### Configure in Supabase

1. **Go to Supabase Dashboard**
   - Navigate to "Authentication" → "Providers"

2. **Enable Facebook Provider**
   - Find "Facebook" in the list
   - Toggle it **ON**

3. **Enter Credentials**
   - Paste your **App ID** as Client ID
   - Paste your **App Secret** as Client Secret
   - Click "Save"

---

## Step 5: Update Environment Variables (Optional)

If you want to add OAuth redirect URLs to your `.env` file:

```env
VITE_SUPABASE_PROJECT_ID="wripeviofzxghjdouifk"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://wripeviofzxghjdouifk.supabase.co"
VITE_GOOGLE_GEMINI_API_KEY="AIzaSyCFB1kcufknsGDejIuqzpRfNU7ORtTKNBY"
```

---

## Step 6: Test the Application

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Test Features**
   - ✅ Google OAuth login
   - ✅ Facebook OAuth login
   - ✅ Document upload
   - ✅ AI chat functionality
   - ✅ Document processing and download

---

## Troubleshooting

### Database Tables Not Created
- Make sure you ran the entire SQL migration script
- Check for errors in the SQL Editor
- Verify you have the correct permissions

### OAuth Not Working
- Double-check redirect URIs match exactly
- Ensure OAuth providers are enabled in Supabase
- Verify credentials are correct

### Storage Upload Fails
- Confirm storage buckets are created
- Check RLS policies are applied
- Verify file size limits

### TypeScript Errors
- After applying the database schema, you may need to regenerate Supabase types:
  ```bash
  npx supabase gen types typescript --project-id wripeviofzxghjdouifk > src/integrations/supabase/types.ts
  ```

---

## Next Steps

Once everything is set up:

1. **Test all features** thoroughly
2. **Monitor usage** in Supabase dashboard
3. **Set up backups** for your database
4. **Configure rate limiting** if needed
5. **Add monitoring** and error tracking

---

## Support

If you encounter any issues:
- Check Supabase logs in the dashboard
- Review browser console for errors
- Verify all environment variables are set correctly

**Your application is now fully configured with:**
- ✅ Google Gemini AI integration
- ✅ OAuth authentication (Google & Facebook)
- ✅ Document processing and storage
- ✅ Intelligent chat assistant
- ✅ User activity tracking
