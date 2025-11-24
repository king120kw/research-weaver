# 🚀 Quick Database Setup Instructions

## You're in the SQL Editor! Here's what to do:

### Step 1: Copy the SQL Code

1. Open this file: `supabase/migrations/apply_schema.sql`
2. **Select ALL the code** (Ctrl+A)
3. **Copy it** (Ctrl+C)

### Step 2: Paste and Run

1. Go back to your Supabase SQL Editor (already open in your browser)
2. **Click in the editor area** (where it says "Hit CTRL+K to generate query or just start typing")
3. **Paste the code** (Ctrl+V)
4. **Click the "RUN" button** (or press Ctrl+Enter)

### Step 3: Wait for Success

- You should see a success message
- Tables will be created automatically

### Step 4: Verify Tables Created

1. Click **"Table Editor"** in the left sidebar
2. You should see these new tables:
   - ✅ `user_profiles`
   - ✅ `documents`
   - ✅ `chat_sessions`
   - ✅ `chat_messages`
   - ✅ `user_activity`

---

## Next: Create Storage Buckets

### Create 'avatars' Bucket:
1. Click **"Storage"** in left sidebar
2. Click **"New bucket"**
3. Name: `avatars`
4. Public: ✅ **YES**
5. Click **"Create bucket"**

### Create 'documents' Bucket:
1. Click **"New bucket"** again
2. Name: `documents`
3. Public: ❌ **NO**
4. Click **"Create bucket"**

---

## ✅ That's It!

Once done, **refresh your application** and everything will work with full database persistence!

- ✅ Chat messages saved to database
- ✅ Profile pictures in Supabase Storage
- ✅ Document uploads and processing
- ✅ Activity tracking
- ✅ Full data persistence

---

**Need help?** Just let me know if you encounter any errors!
