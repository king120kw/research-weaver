import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendChatMessage, ChatMessage, analyzeDocument } from '@/lib/ai-service';
import { uploadDocument, processDocument } from '@/lib/document-service';
import { toast } from 'sonner';

interface ChatScreenProps {
    onNavigate: (screenIndex: number) => void;
}

export default function ChatScreen({ onNavigate }: ChatScreenProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('chat_messages');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            } catch (e) {
                console.error('Error loading messages:', e);
            }
        }
        return [{
            role: 'assistant',
            content: "Hello! I'm your AI assistant powered by Google Gemini 2.0. I can help you with research, academic writing, and general questions. I also support images, files, and voice input!",
            timestamp: new Date()
        }];
    });
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);

    // Document configuration
    const [pageCount, setPageCount] = useState(10);
    const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
    const [documentType, setDocumentType] = useState('research-paper');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...files]);
            toast.success(`${files.length} file(s) attached`);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if ((!input.trim() && attachments.length === 0) || isTyping) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input.trim() || '[Sent files]',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        const currentAttachments = [...attachments];
        setAttachments([]);
        setIsTyping(true);

        try {
            const userContext = {
                userId: user?.id,
                userName: user?.user_metadata?.full_name || user?.email,
                email: user?.email,
            };

            // For now, send text-based messages (multimodal API integration would go here)
            const response = await sendChatMessage([...messages, userMessage], userContext);

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.message,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Chat error:', error);
            toast.error(error.message || 'Failed to get AI response');

            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: "I apologize, but I encountered an error. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleGenerateDocument = async () => {
        if (!user?.id) {
            toast.error('Please sign in to generate documents');
            return;
        }

        if (messages.length < 2) {
            toast.error('Please have a conversation first to generate a document');
            return;
        }

        try {
            setIsTyping(true);
            toast.info('Generating document from conversation...');

            // Combine all messages into document content
            const conversationText = messages
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n\n');

            // Create a text file from the conversation
            const blob = new Blob([conversationText], { type: 'text/plain' });
            const file = new File([blob], `conversation-${Date.now()}.txt`, { type: 'text/plain' });

            // Upload as document
            const doc = await uploadDocument(file, user.id, {
                pageCount,
                outputFormat,
                documentType
            });

            toast.success('Document created! Starting AI processing...');

            // Start processing
            await processDocument(doc.id, user.id);

            // Navigate to progress screen
            onNavigate(4);
        } catch (error: any) {
            console.error('Document generation error:', error);
            toast.error(error.message || 'Failed to generate document');
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: "Hello! I'm your AI assistant powered by Google Gemini 2.0. I can help you with research, academic writing, and general questions. I also support images, files, and voice input!",
            timestamp: new Date()
        }]);
        localStorage.removeItem('chat_messages');
        toast.success('Chat cleared');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate(0)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-slate-200">AI Assistant</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Google Gemini 2.0</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowConfig(!showConfig)}
                        className={`p-2 rounded-full transition-colors ${showConfig ? 'bg-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                        title="Document settings"
                    >
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <button
                        onClick={clearChat}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        title="Clear chat"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">delete</span>
                    </button>
                </div>
            </div>

            {/* Configuration Panel */}
            {showConfig && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Document Generation Settings</h3>

                    {/* Page Count */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Target Pages: <span className="text-primary">{pageCount}</span>
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
                    </div>

                    {/* Output Format */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Output Format
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['pdf', 'docx', 'txt'] as const).map((format) => (
                                <button
                                    key={format}
                                    onClick={() => setOutputFormat(format)}
                                    className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${outputFormat === format
                                        ? 'border-primary bg-primary/10 text-primary'
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Document Type
                        </label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
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

                    <button
                        onClick={handleGenerateDocument}
                        disabled={isTyping || messages.length < 2}
                        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">auto_awesome</span>
                            Generate Document from Conversation
                        </span>
                    </button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            <p className={`text-xs mt-2 ${message.role === 'user'
                                ? 'text-primary-foreground/70'
                                : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                <span className="material-symbols-outlined text-primary text-sm">attach_file</span>
                                <span className="text-slate-700 dark:text-slate-300">{file.name}</span>
                                <button
                                    onClick={() => removeAttachment(index)}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        title="Attach files"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">attach_file</span>
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything... (supports files, images, voice)"
                        className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-500"
                        rows={2}
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={(!input.trim() && attachments.length === 0) || isTyping}
                        className="px-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-none"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    💡 Tip: Press Enter to send, Shift+Enter for new line. Click settings to generate documents.
                </p>
            </div>
        </div>
    );
}
