// Supabase Storage configuration and utilities
import { supabase } from '@/integrations/supabase/client';

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
    AVATARS: 'avatars',
    DOCUMENTS: 'documents',
} as const;

/**
 * Initialize storage buckets
 * Note: This should be run once during setup or via Supabase dashboard
 */
export async function initializeStorageBuckets(): Promise<void> {
    try {
        // Check if buckets exist, create if they don't
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketNames = buckets?.map((b) => b.name) || [];

        // Create avatars bucket if it doesn't exist
        if (!bucketNames.includes(STORAGE_BUCKETS.AVATARS)) {
            await supabase.storage.createBucket(STORAGE_BUCKETS.AVATARS, {
                public: true,
                fileSizeLimit: 2097152, // 2MB
                allowedMimeTypes: ['image/*'],
            });
        }

        // Create documents bucket if it doesn't exist
        if (!bucketNames.includes(STORAGE_BUCKETS.DOCUMENTS)) {
            await supabase.storage.createBucket(STORAGE_BUCKETS.DOCUMENTS, {
                public: false,
                fileSizeLimit: 52428800, // 50MB
                allowedMimeTypes: [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword',
                    'text/plain',
                ],
            });
        }

        console.log('Storage buckets initialized successfully');
    } catch (error) {
        console.error('Storage initialization error:', error);
        // Don't throw error - buckets might already exist
    }
}

/**
 * Get public URL for a file in a public bucket
 */
export function getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Get signed URL for a file in a private bucket
 */
export async function getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
): Promise<string> {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    if (error) {
        throw error;
    }

    return data.signedUrl;
}

/**
 * Upload file to storage
 */
export async function uploadFile(
    bucket: string,
    path: string,
    file: File
): Promise<string> {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
    });

    if (error) {
        throw error;
    }

    return data.path;
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
        throw error;
    }
}

/**
 * List files in a directory
 */
export async function listFiles(bucket: string, path: string = '') {
    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) {
        throw error;
    }

    return data;
}
