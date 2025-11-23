import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface ResearchPlanProps {
    onNavigate: (screenIndex: number) => void;
}

export default function ResearchPlan({ onNavigate }: ResearchPlanProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Configuration options
    const [pageCount, setPageCount] = useState(10);
    const [outputFormat, setOutputFormat] = useState('pdf');
    const [documentType, setDocumentType] = useState('research-paper');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            toast.success(`Selected: ${file.name}`);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        try {
            setUploading(true);

            // TODO: Implement actual upload to Supabase Storage
            // For now, simulate upload
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Document uploaded successfully!');
            toast.info(`Configuration: ${pageCount} pages, ${outputFormat.toUpperCase()}, ${documentType.replace('-', ' ')}`);

            // Reset form
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            toast.error(error.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-white dark:bg-slate-900 z-10">
                <button
                    onClick={() => onNavigate(0)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
                </button>
                <div>
                    <h2 className="font-bold text-slate-800 dark:text-slate-200">New Research Plan</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Upload and configure your research document</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* File Upload Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">upload_file</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Research Document</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                Drag and drop your PDF, DOCX, or TXT file here, or click to browse.
                            </p>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            {selectedFile ? (
                                <div className="flex items-center justify-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl">description</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedFile.name}</span>
                                    <span className="text-slate-500 text-sm">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                                </div>
                            ) : (
                                <div className="text-slate-500 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-4xl mb-2 block">cloud_upload</span>
                                    Click to select a file
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".pdf,.docx,.txt"
                        />
                    </div>

                    {/* Configuration Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Document Configuration</h3>

                        {/* Page Count Slider */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Number of Pages: <span className="text-primary">{pageCount}</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-500">1</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="200"
                                    value={pageCount}
                                    onChange={(e) => setPageCount(parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <span className="text-xs text-slate-500">200</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Specify the target page count for your research document
                            </p>
                        </div>

                        {/* Output Format */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Output Format
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {['pdf', 'docx', 'txt'].map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setOutputFormat(format)}
                                        className={`p-3 rounded-lg border-2 transition-all ${outputFormat === format
                                                ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                                            }`}
                                    >
                                        {format.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Document Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Document Type
                            </label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="research-paper">Research Paper</option>
                                <option value="thesis">Thesis</option>
                                <option value="dissertation">Dissertation</option>
                                <option value="literature-review">Literature Review</option>
                                <option value="case-study">Case Study</option>
                                <option value="technical-report">Technical Report</option>
                                <option value="white-paper">White Paper</option>
                            </select>
                        </div>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Uploading...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">cloud_upload</span>
                                Generate Research Plan
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
