// User activity tracking utilities
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
    id: string;
    user_id: string;
    activity_type: string;
    activity_date: string;
    metadata?: any;
    created_at: string;
}

/**
 * Get user activity for a specific month
 */
export async function getUserActivity(
    userId: string,
    year: number,
    month: number
): Promise<number[]> {
    try {
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('user_activity')
            .select('activity_date')
            .eq('user_id', userId)
            .gte('activity_date', startDate)
            .lte('activity_date', endDate);

        if (error) {
            throw error;
        }

        // Extract unique days with activity
        const activeDays = new Set<number>();
        data?.forEach((activity) => {
            const day = new Date(activity.activity_date).getDate();
            activeDays.add(day);
        });

        return Array.from(activeDays).sort((a, b) => a - b);
    } catch (error: any) {
        console.error('Get user activity error:', error);
        return [];
    }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(userId: string): Promise<{
    totalDocuments: number;
    totalChats: number;
    totalDownloads: number;
    streakDays: number;
}> {
    try {
        const { data, error } = await supabase
            .from('user_activity')
            .select('activity_type, activity_date')
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        const stats = {
            totalDocuments: 0,
            totalChats: 0,
            totalDownloads: 0,
            streakDays: 0,
        };

        data?.forEach((activity) => {
            if (activity.activity_type === 'document_upload') {
                stats.totalDocuments++;
            } else if (activity.activity_type === 'chat') {
                stats.totalChats++;
            } else if (activity.activity_type === 'document_download') {
                stats.totalDownloads++;
            }
        });

        // Calculate streak
        stats.streakDays = calculateStreak(data?.map((a) => a.activity_date) || []);

        return stats;
    } catch (error: any) {
        console.error('Get activity stats error:', error);
        return {
            totalDocuments: 0,
            totalChats: 0,
            totalDownloads: 0,
            streakDays: 0,
        };
    }
}

/**
 * Calculate activity streak
 */
function calculateStreak(dates: string[]): number {
    if (dates.length === 0) return 0;

    const uniqueDates = Array.from(new Set(dates)).sort().reverse();
    const today = new Date().toISOString().split('T')[0];

    let streak = 0;
    let currentDate = new Date(today);

    for (const dateStr of uniqueDates) {
        const activityDate = new Date(dateStr);
        const diffDays = Math.floor(
            (currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === streak) {
            streak++;
        } else if (diffDays > streak) {
            break;
        }
    }

    return streak;
}
