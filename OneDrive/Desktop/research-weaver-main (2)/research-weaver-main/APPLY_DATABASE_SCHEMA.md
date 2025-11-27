# Apply Database Schema to Supabase

## ✅ Fixed Issue
The previous error occurred because the SQL script tried to create RLS policies **before** creating the tables. This new schema creates everything in the correct order:

1. ✅ Create tables first
2. ✅ Create indexes
3. ✅ Enable RLS
4. ✅ Create policies
5. ✅ Create functions and triggers

## 🚀 How to Apply

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste**
   - Open the file: `supabase/migrations/20251128_complete_schema_fix.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor

4. **Run the Script**
   - Click "Run" or press `Ctrl+Enter`
   - Wait for completion (should take 5-10 seconds)

5. **Verify Success**
   - You should see "Success. No rows returned"
   - Check the "Table Editor" to see your new tables

### Option 2: Supabase CLI

```bash
# Make sure you're in the project directory
cd "c:\Users\najib\OneDrive\Desktop\research-weaver-main (2)\research-weaver-main"

# Link to your Supabase project (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
npx supabase db push
```

## 📊 What Gets Created

### Tables
- ✅ `user_profiles` - User profile information
- ✅ `documents` - Uploaded research documents
- ✅ `chat_sessions` - Chat conversation sessions
- ✅ `chat_messages` - Individual chat messages
- ✅ `user_activity` - User activity tracking

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies ensure users can only access their own data
- ✅ Automatic user profile creation on signup

### Features
- ✅ Auto-updating timestamps
- ✅ Cascade deletes (when user is deleted, all their data is removed)
- ✅ Proper foreign key relationships
- ✅ Performance indexes

## 🔍 Verify Schema

After running the script, verify it worked:

1. **Check Tables**
   - Go to "Table Editor" in Supabase Dashboard
   - You should see all 5 tables listed

2. **Check Policies**
   - Click on any table
   - Click "Policies" tab
   - You should see RLS policies listed

3. **Test Insert** (optional)
   - Try creating a test record through your app
   - It should work without errors

## ⚠️ Important Notes

- **Safe to Re-run**: This script uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS`, so it's safe to run multiple times
- **No Data Loss**: Existing data will be preserved
- **Idempotent**: Running it twice won't cause errors

## 🐛 Troubleshooting

### If you get "permission denied"
- Make sure you're logged in as the project owner
- Check that you're using the correct project

### If tables already exist
- The script will skip creating them (uses `IF NOT EXISTS`)
- Policies will be recreated with the latest version

### If you need to start fresh
```sql
-- WARNING: This deletes ALL data!
DROP TABLE IF EXISTS public.user_activity CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Then run the main schema script
```

## 📝 Next Steps

After applying the schema:

1. ✅ Update your `.env` file with Supabase credentials
2. ✅ Test authentication flow
3. ✅ Test document upload
4. ✅ Test chat functionality

## 🔗 Key Differences from Previous Schema

### ✅ Fixed
- Tables are created **before** RLS policies
- Added `user_id` to `chat_messages` for better tracking
- Added `document_id` to `chat_messages` for context
- Proper policy names (no duplicates)
- Better indexes for performance

### ✅ Enhanced
- More comprehensive policies
- Better error handling
- Clearer comments
- Verification queries included
