// Chat service for managing chat sessions and messages
import { supabase } from '@/integrations/supabase/client';
import { sendChatMessage, ChatMessage, UserContext } from './ai-service';

export interface ChatSession {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface ChatMessageDB {
    id: string;
    session_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

/**
 * Create a new chat session
 */
export async function createChatSession(userId: string, title?: string): Promise<ChatSession> {
    try {
        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({
                user_id: userId,
                title: title || `Chat ${new Date().toLocaleDateString()}`,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error('Create chat session error:', error);
        throw new Error('Failed to create chat session');
    }
}

/**
 * Get user's chat sessions
 */
export async function getChatSessions(userId: string): Promise<ChatSession[]> {
    try {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data || [];
    } catch (error: any) {
        console.error('Get chat sessions error:', error);
        throw new Error('Failed to fetch chat sessions');
    }
}

/**
 * Get messages for a chat session
 */
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }

        return (data || []).map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at),
        }));
    } catch (error: any) {
        console.error('Get chat messages error:', error);
        throw new Error('Failed to fetch chat messages');
    }
}

/**
 * Save a message to the database
 */
export async function saveChatMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<void> {
    try {
        const { error } = await supabase.from('chat_messages').insert({
            session_id: sessionId,
            role: role,
            content: content,
        });

        if (error) {
            throw error;
        }
    } catch (error: any) {
        console.error('Save chat message error:', error);
        throw new Error('Failed to save message');
    }
}

/**
 * Send a message and get AI response
 */
export async function sendMessage(
    sessionId: string,
    userId: string,
    userMessage: string,
    userContext?: UserContext
): Promise<ChatMessage> {
    try {
        // Save user message
        await saveChatMessage(sessionId, 'user', userMessage);

        // Get chat history
        const messages = await getChatMessages(sessionId);

        // Get AI response
        const response = await sendChatMessage(messages, userContext);

        // Save AI response
        await saveChatMessage(sessionId, 'assistant', response.message);

        // Track activity
        await trackChatActivity(userId, sessionId);

        return {
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
        };
    } catch (error: any) {
        console.error('Send message error:', error);
        throw error;
    }
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(sessionId: string, userId: string): Promise<void> {
    try {
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId)
            .eq('user_id', userId);

        if (error) {
            throw error;
        }
    } catch (error: any) {
        console.error('Delete chat session error:', error);
        throw new Error('Failed to delete chat session');
    }
}

/**
 * Track chat activity
 */
async function trackChatActivity(userId: string, sessionId: string): Promise<void> {
    try {
        await supabase.from('user_activity').insert({
            user_id: userId,
            activity_type: 'chat',
            activity_date: new Date().toISOString().split('T')[0],
            metadata: { session_id: sessionId },
        });
    } catch (error) {
        console.error('Activity tracking error:', error);
        // Don't throw error for activity tracking failures
    }
}
