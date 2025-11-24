import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDocumentProgress, getUserDocuments, Document } from '@/lib/document-service';
import { toast } from 'sonner';

interface ProgressScreenProps {
    onNavigate: (screenIndex: number) => void;
}

export default function ProgressScreen({ onNavigate }: ProgressScreenProps) {
    const { user } = useAuth();
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(true);
    const [stage, setStage] = useState('Initializing...');
    const [activeDocId, setActiveDocId] = useState<string | null>(null);
    const [logs, setLogs] = useState<{ text: string; time: string }[]>([]);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    // Find the active document on mount
    useEffect(() => {
        const findActiveDocument = async () => {
            if (!user?.id) return;

            try {
                // Get most recent document
                const docs = await getUserDocuments(user.id);
                const processingDoc = docs.find(d => d.status === 'processing');

                if (processingDoc) {
                    setActiveDocId(processingDoc.id);
                    setStage(processingDoc.processing_stage || 'Processing...');
                    setProgress(processingDoc.processing_progress || 0);
                    addLog('Resuming progress tracking...');
                } else {
                    // Check for recently completed document (within last minute)
                    const recentCompleted = docs.find(d =>
                        d.status === 'completed' &&
                        d.processed_at &&
                        new Date(d.processed_at).getTime() > Date.now() - 60000
                    );

                    if (recentCompleted) {
                        setActiveDocId(recentCompleted.id);
                        setStage('Completed');
                        setProgress(100);
                        setIsProcessing(false);
                        addLog('Document processing completed.');
                    } else {
                        setIsProcessing(false);
                        setStage('No active processing');
                        addLog('No active document found.');
                    }
                }
            } catch (error) {
                console.error('Error finding active document:', error);
                toast.error('Failed to load processing status');
            }
        };

        findActiveDocument();
    }, [user]);

    // Poll for updates
    useEffect(() => {
        if (!activeDocId || !isProcessing || !user?.id) return;

        const pollProgress = async () => {
            try {
                const status = await getDocumentProgress(activeDocId, user.id);

                if (status) {
                    if (status.progress !== undefined) setProgress(status.progress);
                    if (status.stage) setStage(status.stage);

                    // Add log if message changed
                    if (status.message && logs[0]?.text !== status.message) {
                        addLog(status.message);
                    }

                    if (status.status === 'completed') {
                        setIsProcessing(false);
                        setProgress(100);
                        setStage('Processing Complete!');
                        toast.success('Document processing finished!');
                        if (pollingInterval.current) clearInterval(pollingInterval.current);
                    } else if (status.status === 'failed') {
                        setIsProcessing(false);
                        setStage('Processing Failed');
                        toast.error('Document processing failed');
                        if (pollingInterval.current) clearInterval(pollingInterval.current);
                    }
                }
            } catch (error) {
                console.error('Error polling progress:', error);
            }
        };

        // Poll every 2 seconds
        pollingInterval.current = setInterval(pollProgress, 2000);

        // Initial poll
        pollProgress();

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [activeDocId, isProcessing, user, logs]);

    const addLog = (text: string) => {
        setLogs(prev => {
            // Avoid duplicates
            if (prev.length > 0 && prev[0].text === text) return prev;
            return [{ text, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)];
        });
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
                    <h2 className="font-bold text-slate-800 dark:text-slate-200">Processing Status</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Real-time enhancement tracking</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/50">
                <div className="flex flex-col lg:flex-row gap-6 h-full max-w-6xl mx-auto">
                    {/* Main Progress Area */}
                    <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                            {/* Circular Progress Bar Background */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="120"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-slate-100 dark:text-slate-800"
                                />
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="120"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 120}
                                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                    className="text-primary transition-all duration-500 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-slate-900 dark:text-white">{Math.round(progress)}%</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400 mt-2">Completed</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">{stage}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
                            {isProcessing
                                ? "Our AI is analyzing your document, searching for recent sources, and enhancing the content."
                                : progress === 100
                                    ? "Document processing complete! You can now view and download your enhanced document."
                                    : "No active processing task found."}
                        </p>

                        <div className="flex gap-4">
                            {!isProcessing && progress === 100 ? (
                                <button
                                    onClick={() => onNavigate(1)} // Go back to upload/plan
                                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">upload_file</span>
                                    Process Another
                                </button>
                            ) : isProcessing ? (
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                                    <span className="material-symbols-outlined animate-spin">sync</span>
                                    <span>Updating in real-time...</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => onNavigate(1)}
                                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                                >
                                    Start New Document
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Logs Panel */}
                    <div className="w-full lg:w-96 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm h-[500px] lg:h-auto">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">Activity Log</h3>
                            <span className="text-xs text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">Live</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {logs.length === 0 ? (
                                <div className="text-center text-slate-400 py-8 text-sm">
                                    Waiting for updates...
                                </div>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${index === 0 ? 'bg-primary animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                        <div>
                                            <p className={`text-sm ${index === 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'}`}>{log.text}</p>
                                            <span className="text-xs text-slate-400">{log.time}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
