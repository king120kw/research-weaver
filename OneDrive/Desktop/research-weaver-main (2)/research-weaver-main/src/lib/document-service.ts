// Document service for handling document operations with Supabase
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromFile, generateFilename, formatFileSize } from './file-utils';
import { analyzeDocument } from './ai-service';

export interface DocumentConfig {
    pageCount: number;
    outputFormat: 'pdf' | 'docx' | 'txt';
    documentType: string;
}

export interface Document {
    id: string;
    user_id: string;
    title: string;
    original_filename: string;
    file_path: string;
    file_type: string;
    file_size: number;
    page_count?: number;
    output_format?: string;
    document_type?: string;
    status: 'uploaded' | 'processing' | 'completed' | 'failed';
    processed_content?: string;
    original_content?: string;
    processing_stage?: string;
    processing_progress?: number;
    processing_message?: string;
    created_at: string;
    updated_at: string;
    processed_at?: string;
}

/**
 * Upload document to Supabase Storage and create database record
 */
export async function uploadDocument(
    file: File,
    userId: string,
    config: DocumentConfig
): Promise<Document> {
    try {
        // Generate unique filename
        const filePath = generateFilename(file.name, userId);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            throw uploadError;
        }

        // Extract text from document
        const extractedText = await extractTextFromFile(file);

        // Create database record
        const { data: docData, error: dbError } = await supabase
            .from('documents')
            .insert({
                user_id: userId,
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                original_filename: file.name,
                file_path: filePath,
                file_type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
                file_size: file.size,
                page_count: config.pageCount,
                output_format: config.outputFormat,
                document_type: config.documentType,
                status: 'uploaded',
                original_content: extractedText,
            })
            .select()
            .single();

        if (dbError) {
            // Cleanup uploaded file if database insert fails
            await supabase.storage.from('documents').remove([filePath]);
            throw dbError;
        }

        // Track activity
        await trackActivity(userId, 'document_upload', {
            document_id: docData.id,
            filename: file.name,
        });

        return docData;
    } catch (error: any) {
        console.error('Document upload error:', error);
        throw new Error(error.message || 'Failed to upload document');
    }
}

/**
 * Process document with AI and track progress
 */
export async function processDocument(
    documentId: string,
    userId: string,
    onProgress?: (stage: string, progress: number, message: string) => void
): Promise<Document> {
    try {
        // Get document from database
        const { data: doc, error: fetchError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !doc) {
            throw new Error('Document not found');
        }

        // Update status to processing
        await updateProcessingProgress(documentId, 'uploading', 10, 'Starting document processing...');
        onProgress?.('uploading', 10, 'Starting document processing...');

        // Process with AI with progress tracking
        const processedContent = await analyzeDocument(
            doc.original_content || '',
            doc.document_type || 'research-paper',
            doc.page_count,
            async (stage, progress, message) => {
                await updateProcessingProgress(documentId, stage, progress, message);
                onProgress?.(stage, progress, message);
            }
        );

        // Update document with processed content
        const { data: updatedDoc, error: updateError } = await supabase
            .from('documents')
            .update({
                processed_content: processedContent,
                status: 'completed',
                processing_stage: 'completed',
                processing_progress: 100,
                processing_message: 'Document processing complete!',
                processed_at: new Date().toISOString(),
            })
            .eq('id', documentId)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        // Track activity
        await trackActivity(userId, 'document_processed', {
            document_id: documentId,
        });

        return updatedDoc;
    } catch (error: any) {
        // Update status to failed
        await supabase
            .from('documents')
            .update({
                status: 'failed',
                processing_stage: 'failed',
                processing_message: error.message || 'Processing failed'
            })
            .eq('id', documentId);

        console.error('Document processing error:', error);
        throw new Error(error.message || 'Failed to process document');
    }
}

/**
 * Update processing progress in database
 */
export async function updateProcessingProgress(
    documentId: string,
    stage: string,
    progress: number,
    message: string
): Promise<void> {
    try {
        await supabase
            .from('documents')
            .update({
                status: 'processing',
                processing_stage: stage,
                processing_progress: progress,
                processing_message: message,
                updated_at: new Date().toISOString(),
            })
            .eq('id', documentId);
    } catch (error) {
        console.error('Progress update error:', error);
        // Don't throw - progress updates shouldn't break the flow
    }
}

/**
 * Get document processing progress
 */
export async function getDocumentProgress(documentId: string, userId: string): Promise<{
    status: string;
    stage?: string;
    progress?: number;
    message?: string;
} | null> {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('status, processing_stage, processing_progress, processing_message')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            status: data.status,
            stage: data.processing_stage,
            progress: data.processing_progress,
            message: data.processing_message,
        };
    } catch (error) {
        console.error('Get progress error:', error);
        return null;
    }
}

/**
 * Get user's documents
 */
export async function getUserDocuments(userId: string): Promise<Document[]> {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data || [];
    } catch (error: any) {
        console.error('Get documents error:', error);
        throw new Error('Failed to fetch documents');
    }
}

/**
 * Download processed document
 */
export async function downloadDocument(
    documentId: string,
    userId: string
): Promise<Blob> {
    try {
        // Get document from database
        const { data: doc, error: fetchError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !doc) {
            throw new Error('Document not found');
        }

        const content = doc.processed_content || doc.original_content || '';
        const format = doc.output_format || 'txt';

        let blob: Blob;

        if (format === 'txt') {
            blob = new Blob([content], { type: 'text/plain' });
        } else if (format === 'pdf') {
            blob = await generatePDF(content, doc.title);
        } else if (format === 'docx') {
            blob = await generateDOCX(content, doc.title);
        } else {
            throw new Error('Unsupported format');
        }

        // Track activity
        await trackActivity(userId, 'document_download', {
            document_id: documentId,
            format: format,
        });

        return blob;
    } catch (error: any) {
        console.error('Download document error:', error);
        throw new Error('Failed to download document');
    }
}

/**
 * Generate PDF from text content
 */
async function generatePDF(content: string, title: string): Promise<Blob> {
    try {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text(title, 20, 20);

        // Add content
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, 40);

        return doc.output('blob');
    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error('Failed to generate PDF');
    }
}

/**
 * Generate DOCX from text content
 */
async function generateDOCX(content: string, title: string): Promise<Blob> {
    try {
        const { Document, Packer, Paragraph, TextRun } = await import('docx');

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: title,
                                    bold: true,
                                    size: 32,
                                }),
                            ],
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: '' })],
                        }),
                        ...content.split('\n').map(
                            (line) =>
                                new Paragraph({
                                    children: [new TextRun({ text: line })],
                                })
                        ),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        return blob;
    } catch (error) {
        console.error('DOCX generation error:', error);
        throw new Error('Failed to generate DOCX');
    }
}

/**
 * Delete document
 */
export async function deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
        // Get document to find file path
        const { data: doc, error: fetchError } = await supabase
            .from('documents')
            .select('file_path')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !doc) {
            throw new Error('Document not found');
        }

        // Delete from storage
        await supabase.storage.from('documents').remove([doc.file_path]);

        // Delete from database
        const { error: deleteError } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentId)
            .eq('user_id', userId);

        if (deleteError) {
            throw deleteError;
        }
    } catch (error: any) {
        console.error('Delete document error:', error);
        throw new Error('Failed to delete document');
    }
}

/**
 * Track user activity
 */
async function trackActivity(
    userId: string,
    activityType: string,
    metadata?: any
): Promise<void> {
    try {
        // Activity tracking is optional - don't fail if table doesn't exist
        await supabase.from('user_activity').insert({
            user_id: userId,
            activity_type: activityType,
            activity_date: new Date().toISOString().split('T')[0],
            metadata: metadata,
        });
    } catch (error) {
        console.error('Activity tracking error:', error);
        // Don't throw error for activity tracking failures
    }
}
