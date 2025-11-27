import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDocuments } from '@/lib/document-service';
import { toast } from 'sonner';

interface HistoryScreenProps {
    onNavigate: (screenIndex: number) => void;
}

interface HistoryItem {
    id: string;
    title: string;
    type: 'document' | 'chat';
    date: string;
    status: string;
    icon: string;
    color: string;
}

export default function HistoryScreen({ onNavigate }: HistoryScreenProps) {
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, [user]);

    const loadHistory = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const documents = await getUserDocuments(user.id);

            const items: HistoryItem[] = documents.map(doc => ({
                id: doc.id,
                title: doc.title || 'Untitled Document',
                type: 'document' as const,
                date: new Date(doc.created_at).toLocaleDateString(),
                status: doc.status === 'completed' ? 'Verified' : 'Processing',
                icon: 'description',
                color: 'primary'
            }));

            setHistoryItems(items);
        } catch (error: any) {
            console.error('Error loading history:', error);
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = historyItems.filter(item => {
        const matchesFilter = filter === 'all' || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
                    <h2 className="font-bold text-slate-800 dark:text-slate-200">Research History</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Access your past projects and chats</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Search documents and chats..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('document')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'document' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                Documents
                            </button>
                            <button
                                onClick={() => setFilter('chat')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'chat' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                Chats
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 dark:text-slate-400">Loading history...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <span className="material-symbols-outlined text-3xl">
                                    {searchTerm ? 'search_off' : 'folder_open'}
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                {searchTerm ? 'No items found' : 'No history yet'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                {searchTerm ? 'Try adjusting your search or filters' : 'Upload a document or start a chat to see your history here'}
                            </p>
                        </div>
                    )}

                    {/* List */}
                    {!loading && filteredItems.length > 0 && (
                        <div className="space-y-4">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all duration-300">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${item.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-indigo-500/10 text-indigo-500'
                                        }`}>
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{item.date}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'Verified'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onNavigate(item.type === 'chat' ? 2 : 4)}
                                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
