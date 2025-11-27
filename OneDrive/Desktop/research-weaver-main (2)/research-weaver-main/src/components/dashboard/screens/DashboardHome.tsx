import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Calendar Todo State
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [todos, setTodos] = useState<{ [key: string]: { id: string, text: string, completed: boolean }[] }>(() => {
        const saved = localStorage.getItem('calendar_todos');
        return saved ? JSON.parse(saved) : {};
    });
    const [newTodoText, setNewTodoText] = useState('');
    const [showTodoModal, setShowTodoModal] = useState(false);

    useEffect(() => {
        // Load avatar from localStorage first, then fallback to user metadata
        const savedAvatar = localStorage.getItem('user_avatar');
        if (savedAvatar) {
            setAvatarUrl(savedAvatar);
        } else if (user?.user_metadata?.avatar_url) {
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

    // Calendar Todo Functions
    const handleDayClick = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setShowTodoModal(true);
    };

    const addTodo = () => {
        if (!selectedDate || !newTodoText.trim()) return;

        const newTodo = {
            id: Date.now().toString(),
            text: newTodoText.trim(),
            completed: false
        };

        const updatedTodos = {
            ...todos,
            [selectedDate]: [...(todos[selectedDate] || []), newTodo]
        };

        setTodos(updatedTodos);
        localStorage.setItem('calendar_todos', JSON.stringify(updatedTodos));
        setNewTodoText('');
        toast.success('Todo added!');
    };

    const toggleTodo = (todoId: string) => {
        if (!selectedDate) return;

        const updatedTodos = {
            ...todos,
            [selectedDate]: todos[selectedDate].map(todo =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            )
        };

        setTodos(updatedTodos);
        localStorage.setItem('calendar_todos', JSON.stringify(updatedTodos));
    };

    const deleteTodo = (todoId: string) => {
        if (!selectedDate) return;

        const updatedTodos = {
            ...todos,
            [selectedDate]: todos[selectedDate].filter(todo => todo.id !== todoId)
        };

        setTodos(updatedTodos);
        localStorage.setItem('calendar_todos', JSON.stringify(updatedTodos));
        toast.success('Todo deleted!');
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

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please select an image file');
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('Image size must be less than 2MB');
            }

            // Convert to base64 and store in localStorage
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                localStorage.setItem('user_avatar', base64String);
                setAvatarUrl(base64String);
                toast.success('Profile picture updated!');
                setUploading(false);
            };
            reader.onerror = () => {
                throw new Error('Failed to read image file');
            };
            reader.readAsDataURL(file);
        } catch (error: any) {
            toast.error(error.message);
            setUploading(false);
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        const today = new Date();
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
            const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const hasTodos = todos[dateStr] && todos[dateStr].length > 0;

            days.push(
                <button
                    key={i}
                    onClick={() => handleDayClick(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm relative transition-all cursor-pointer hover:ring-2 hover:ring-primary/50 group ${isToday
                        ? 'bg-blue-500 text-white font-bold ring-2 ring-blue-300 dark:ring-blue-700'
                        : hasTodos
                            ? 'bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                >
                    {i}
                    <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px] transition-opacity shadow-sm z-10">
                        <span className="material-symbols-outlined text-[10px]">add</span>
                    </span>
                    {hasTodos && (
                        <span className="absolute bottom-0.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                    )}
                </button>
            );
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    const currentMonthYear = `${monthNames[currentMonth]} ${currentYear}`;

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
                            <button
                                onClick={() => {
                                    const today = new Date();
                                    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                    setSelectedDate(dateStr);
                                    setShowTodoModal(true);
                                }}
                                className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mr-2 shadow-sm"
                                title="Add task for today"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                            <button
                                onClick={goToPreviousMonth}
                                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-3 py-1 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                Today
                            </button>
                            <span className="text-base font-semibold text-slate-700 dark:text-slate-300 min-w-[140px] text-center">
                                {currentMonthYear}
                            </span>
                            <button
                                onClick={goToNextMonth}
                                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                            >
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

            {/* Todo Modal */}
            {showTodoModal && selectedDate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTodoModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Tasks for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </h3>
                            <button onClick={() => setShowTodoModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                <span className="material-symbols-outlined text-slate-500">close</span>
                            </button>
                        </div>

                        {/* Add Todo Input */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newTodoText}
                                onChange={(e) => setNewTodoText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                                placeholder="Add a new task..."
                                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button
                                onClick={addTodo}
                                disabled={!newTodoText.trim()}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                Add
                            </button>
                        </div>

                        {/* Todo List */}
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {todos[selectedDate] && todos[selectedDate].length > 0 ? (
                                todos[selectedDate].map(todo => (
                                    <div
                                        key={todo.id}
                                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleTodo(todo.id)}
                                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {todo.text}
                                        </span>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-red-500 text-sm">delete</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                    No tasks for this day. Add one above!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
