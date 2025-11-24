-- Add progress tracking columns to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS processing_stage TEXT,
ADD COLUMN IF NOT EXISTS processing_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_message TEXT;

-- Add index for faster queries on status and user_id
CREATE INDEX IF NOT EXISTS idx_documents_status_user ON documents(status, user_id);
