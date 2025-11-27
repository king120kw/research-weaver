import { toast } from "sonner";

interface Config {
    gemini: {
        apiKey: string;
    };
    supabase: {
        url: string;
        anonKey: string;
    };
    clerk: {
        publishableKey: string;
    };
}

const getEnvVar = (key: string, required = true): string => {
    const value = import.meta.env[key];
    if (!value && required) {
        const error = `Missing environment variable: ${key}`;
        console.error(error);
        // Only toast in development to avoid spamming users in prod if something is misconfigured
        if (import.meta.env.DEV) {
            toast.error(error);
        }
        return '';
    }
    return value || '';
};

export const config: Config = {
    gemini: {
        apiKey: getEnvVar('VITE_GEMINI_API_KEY'),
    },
    supabase: {
        url: getEnvVar('VITE_SUPABASE_URL'),
        anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
    },
    clerk: {
        publishableKey: getEnvVar('VITE_CLERK_PUBLISHABLE_KEY'),
    },
};

export const validateConfig = () => {
    const missing = [];
    if (!config.gemini.apiKey) missing.push('VITE_GEMINI_API_KEY');
    if (!config.supabase.url) missing.push('VITE_SUPABASE_URL');
    if (!config.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY');
    if (!config.clerk.publishableKey) missing.push('VITE_CLERK_PUBLISHABLE_KEY');

    if (missing.length > 0) {
        const error = `Missing required configuration: ${missing.join(', ')}`;
        console.error(error);
        return false;
    }
    return true;
};
