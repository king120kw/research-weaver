import { useState, useEffect } from 'react';

interface ProgressScreenProps {
    onNavigate: (screenIndex: number) => void;
}

export default function ProgressScreen({ onNavigate }: ProgressScreenProps) {
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stage, setStage] = useState('Stage 1 of 5: Initializing');
    const [logs, setLogs] = useState<{ text: string; time: string }[]>([
        { text: 'Initializing document analysis...', time: 'Just now' }
    ]);

    const stages = [
        'Stage 1 of 5: Analyzing document structure',
        'Stage 2 of 5: Extracting key themes',
        'Stage 3 of 5: Generating content',
        'Stage 4 of 5: Verifying sources',
        'Stage 5 of 5: Finalizing document'
    ];

    useEffect(() => {
        if (!isProcessing) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 5;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setStage('Processing complete!');
                    addLog('Document enhancement completed successfully.');
                    return 100;
                }

                const stageIndex = Math.min(Math.floor(newProgress / 20), 4);
                if (stages[stageIndex] !== stage) {
                    setStage(stages[stageIndex]);
                    addLog(stages[stageIndex]);
                }

                return newProgress;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isProcessing, stage]);

    const addLog = (text: string) => {
        setLogs(prev => [{ text, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
    };

    const startProcessing = () => {
        setIsProcessing(true);
        setProgress(0);
        setLogs([{ text: 'Starting enhancement process...', time: new Date().toLocaleTimeString() }]);
    };

    const cancelProcessing = () => {
        if (confirm('Are you sure you want to cancel the enhancement process?')) {
            setIsProcessing(false);
            setProgress(0);
            onNavigate(0); // Go back to dashboard
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
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

            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Main Progress Area */}
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-xl p-8">
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
                                    className="text-slate-200 dark:text-slate-800"
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

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{stage}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
                            {isProcessing
                                ? "Our AI is currently analyzing and enhancing your document. This may take a few minutes."
                                : "Ready to start processing. Click the button below to begin."}
                        </p>

                        <div className="flex gap-4">
                            {!isProcessing ? (
                                <button
                                    onClick={startProcessing}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                >
                                    Start Processing
                                </button>
                            ) : (
                                <button
                                    onClick={cancelProcessing}
                                    className="px-6 py-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Logs Panel */}
                    <div className="w-full lg:w-96 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">Activity Log</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {logs.map((log, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{log.text}</p>
                                        <span className="text-xs text-slate-400">{log.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
