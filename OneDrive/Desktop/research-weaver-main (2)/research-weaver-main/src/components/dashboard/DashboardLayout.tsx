import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHome from './screens/DashboardHome';
import ResearchPlan from './screens/ResearchPlan';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProgressScreen from './screens/ProgressScreen';

export type DashboardView = 'home' | 'upload' | 'chat' | 'history' | 'progress';

export default function DashboardLayout() {
    const [currentView, setCurrentView] = useState<DashboardView>('home');
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth');
        }
    }, [user, loading, navigate]);

    if (loading || !user) return null;

    const handleNavigate = (screenIndex: number) => {
        // Map numeric index to view for backward compatibility with sub-components
        // 0: home, 1: upload, 2: chat, 3: history, 4: progress
        const views: DashboardView[] = ['home', 'upload', 'chat', 'history', 'progress'];
        if (screenIndex >= 0 && screenIndex < views.length) {
            setCurrentView(views[screenIndex]);
        }
    };

    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return <DashboardHome onNavigate={handleNavigate} />;
            case 'upload':
                return <ResearchPlan onNavigate={handleNavigate} />;
            case 'chat':
                return <ChatScreen onNavigate={handleNavigate} />;
            case 'history':
                return <HistoryScreen onNavigate={handleNavigate} />;
            case 'progress':
                return <ProgressScreen onNavigate={handleNavigate} />;
            default:
                return <DashboardHome onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="font-display bg-background text-foreground min-h-screen w-full">
            <div className="flex items-center justify-between gap-2 mb-8 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">R</span>
                    </div>
                    <span className="text-xl font-bold">Research Helper</span>
                </div>
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
            {renderContent()}
        </div>
    );
}
