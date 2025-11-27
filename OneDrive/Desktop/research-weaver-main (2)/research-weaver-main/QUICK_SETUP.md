# Quick Setup Guide for Research Weaver

## 🚀 Apply Database Schema (5 minutes)

### Step 1: Login to Supabase
1. Go to: https://supabase.com/dashboard/project/wripeviofzxghjdouifk
2. Login with your Supabase account

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 3: Apply Schema
1. Open this file: `supabase/migrations/apply_schema.sql`
2. **Copy ALL the SQL code** (Ctrl+A, Ctrl+C)
3. **Paste into Supabase SQL Editor** (Ctrl+V)
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify Tables Created
1. Click **"Table Editor"** in the left sidebar
2. You should see these new tables:
   - ✅ `user_profiles`
   - ✅ `documents`
   - ✅ `chat_sessions`
   - ✅ `chat_messages`
   - ✅ `user_activity`

### Step 5: Create Storage Buckets

#### Create 'avatars' Bucket:
1. Go to **"Storage"** in left sidebar
2. Click **"New bucket"**
3. Name: `avatars`
4. Public: ✅ **YES**
5. Click **"Create bucket"**

#### Create 'documents' Bucket:
1. Click **"New bucket"** again
2. Name: `documents`
3. Public: ❌ **NO**
4. Click **"Create bucket"**

---

## ✅ That's It!

Your database is now ready! The application will now work with:
- ✅ Chat with AI (text, images, voice)
- ✅ Document upload and processing
- ✅ Profile picture upload
- ✅ Activity calendar
- ✅ Full data persistence

---

## 🎯 What's New

### Enhanced AI Features:
1. **Image Support** - Send images and get AI analysis
2. **Voice Notes** - Record voice messages (transcribed automatically)
3. **Smarter Responses** - More accurate and contextual
4. **Better Understanding** - Handles research AND general questions

### Working Features:
- ✅ Profile picture upload
- ✅ Activity calendar tracking
- ✅ Document processing
- ✅ Intelligent chat
- ✅ All data saved to YOUR Supabase

---

## 📝 Optional: OAuth Setup

If you want Google/Facebook login (not required):
- Follow the detailed guide in `DATABASE_SETUP.md`
- Guest login works perfectly without OAuth!

---

## 🐛 Troubleshooting

**TypeScript Errors?**
- These will disappear after applying the database schema
- They're just type mismatches, not real errors

**Chat Not Working?**
- Make sure you applied the database schema
- Check that storage buckets are created
- Try refreshing the page

**Can't Upload Images/Voice?**
- Storage buckets must be created
- Check browser permissions for microphone

---

## 🎉 You're All Set!

Your Research Weaver is now fully functional with:
- Google Gemini AI (using YOUR API key)
- Image and voice support
- Full database persistence
- Profile management
- Activity tracking

**Enjoy your AI-powered research assistant!** 🚀
