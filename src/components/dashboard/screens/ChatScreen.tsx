import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendChatMessage, ChatMessage } from '@/lib/ai-service';
import { toast } from 'sonner';

interface ChatScreenProps {
    onNavigate: (screenIndex: number) => void;
}

export default function ChatScreen({ onNavigate }: ChatScreenProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        // Load messages from localStorage
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
            content: "Hello! I'm your AI assistant powered by Google Gemini. I can help you with research, academic writing, and even general questions like recipes or directions. How can I assist you today?",
            timestamp: new Date()
        }];
    });
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Build user context
            const userContext = {
                userId: user?.id,
                userName: user?.user_metadata?.full_name || user?.email,
                email: user?.email,
            };

            // Send to AI
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

            // Add error message
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: "I apologize, but I encountered an error. Please make sure your Google Gemini API key is configured correctly in the .env file.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
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
            content: "Hello! I'm your AI assistant powered by Google Gemini. I can help you with research, academic writing, and even general questions like recipes or directions. How can I assist you today?",
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
                        <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Google Gemini</p>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title="Clear chat"
                >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">delete</span>
                </button>
            </div>

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

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything... (research, recipes, directions, etc.)"
                        className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-500"
                        rows={2}
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="px-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-none"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    💡 Tip: Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
