import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardHomeProps {
    onNavigate: (index: number) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
    const [activityDays, setActivityDays] = useState<number[]>([]);

    useEffect(() => {
        if (user?.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
        }
        // Fetch user activity data
        fetchUserActivity();
    }, [user]);

    const fetchUserActivity = async () => {
        if (!user) return;

        try {
            // For now, we'll use empty array for new users
            // In production, fetch from Supabase user_activity table
            setActivityDays([]);
        } catch (error) {
            console.error('Error fetching activity:', error);
        }
    };

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) {
                throw updateError;
            }

            setAvatarUrl(publicUrl);
            toast.success('Profile picture updated!');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
            const dayNum = prevMonthDays - firstDay + i + 1;
            days.push(
                <div key={`prev-${i}`} className="text-slate-400 dark:text-slate-600 w-10 h-10 flex items-center justify-center rounded-full text-sm">
                    {dayNum}
                </div>
            );
        }

        // Add days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate();
            const hasActivity = activityDays.includes(i);

            days.push(
                <div
                    key={i}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm ${isToday
                            ? 'bg-blue-500 text-white font-bold ring-2 ring-blue-300 dark:ring-blue-700'
                            : hasActivity
                                ? 'bg-blue-100 dark:bg-blue-900/50'
                                : ''
                        }`}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">
                {/* Profile Section */}
                <section className="flex flex-col items-center gap-8">
                    {/* Avatar with Gradient Glow */}
                    <div className="relative group cursor-pointer" onClick={handleProfileClick}>
                        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-600 to-red-700 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-40 h-40">
                            {avatarUrl ? (
                                <img
                                    alt="User Avatar"
                                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                                    src={avatarUrl}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 shadow-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-slate-400">person</span>
                                </div>
                            )}
                            {/* Fire Icon Badge */}
                            <div className="absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <span className="material-symbols-outlined text-3xl text-orange-400" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                                    local_fire_department
                                </span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            disabled={uploading}
                        />
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                        <button
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => onNavigate(1)}
                        >
                            <span className="material-symbols-outlined text-3xl text-primary">upload_file</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload</span>
                        </button>
                        <button
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => onNavigate(2)}
                        >
                            <span className="material-symbols-outlined text-3xl text-primary">forum</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chat</span>
                        </button>
                        <button
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => onNavigate(3)}
                        >
                            <span className="material-symbols-outlined text-3xl text-primary">history</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">History</span>
                        </button>
                        <button
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => onNavigate(4)}
                        >
                            <span className="material-symbols-outlined text-3xl text-primary">trending_up</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progress</span>
                        </button>
                    </div>
                </section>

                {/* Activity Calendar */}
                <section className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Activity Calendar</h3>
                        <div className="flex items-center gap-2">
                            <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <span className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                {currentMonthYear}
                            </span>
                            <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">SUN</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">MON</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">TUE</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">WED</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">THU</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">FRI</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">SAT</div>
                        {renderCalendarDays()}
                    </div>
                </section>
            </div>
        </main>
    );
}
