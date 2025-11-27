// File utility functions for document processing

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return fileExtension ? allowedTypes.includes(fileExtension) : false;
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'doc': 'application/msword',
        'txt': 'text/plain',
    };

    return extension ? (mimeTypes[extension] || 'application/octet-stream') : 'application/octet-stream';
}

/**
 * Extract text from file based on type
 */
export async function extractTextFromFile(file: File): Promise<string> {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    try {
        if (fileType === 'txt') {
            return await extractTextFromTxt(file);
        } else if (fileType === 'pdf') {
            return await extractTextFromPdf(file);
        } else if (fileType === 'docx') {
            return await extractTextFromDocx(file);
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error) {
        console.error('Text extraction error:', error);
        throw new Error(`Failed to extract text from ${fileType} file`);
    }
}

/**
 * Extract text from TXT file
 */
async function extractTextFromTxt(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            resolve(text);
        };
        reader.onerror = () => reject(new Error('Failed to read TXT file'));
        reader.readAsText(file);
    });
}

/**
 * Extract text from PDF file
 */
async function extractTextFromPdf(file: File): Promise<string> {
    try {
        // Dynamic import to reduce bundle size
        const pdfjsLib = await import('pdfjs-dist');

        // Set worker path
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText.trim();
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDocx(file: File): Promise<string> {
    try {
        // Dynamic import to reduce bundle size
        const mammoth = await import('mammoth');

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        return result.value;
    } catch (error) {
        console.error('DOCX extraction error:', error);
        throw new Error('Failed to extract text from DOCX');
    }
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');

    return `${userId}/${timestamp}_${sanitizedName}.${extension}`;
}

/**
 * Download file from blob
 */
export function downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
