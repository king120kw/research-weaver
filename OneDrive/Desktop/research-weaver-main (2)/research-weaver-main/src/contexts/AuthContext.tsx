import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useSession, useClerk, useSignIn } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { signOut: clerkSignOut } = useClerk();
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Sync Clerk session with Supabase (optional)
  useEffect(() => {
    const syncSupabaseSession = async () => {
      if (!session || !isSessionLoaded) return;

      try {
        const supabaseToken = await session.getToken({ template: 'supabase' });

        if (supabaseToken) {
          await supabase.auth.setSession({
            access_token: supabaseToken,
            refresh_token: supabaseToken,
          });
        }
      } catch (error: any) {
        // Silently fail if JWT template doesn't exist
        if (!error.message?.includes('No JWT template')) {
          console.warn('Supabase sync skipped:', error.message);
        }
      }
    };

    syncSupabaseSession();
  }, [session, isSessionLoaded]);

  useEffect(() => {
    if (isUserLoaded && isSessionLoaded) {
      setLoading(false);
    }
  }, [isUserLoaded, isSessionLoaded]);

  const signInWithGoogle = async () => {
    try {
      if (!signIn) return;
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  const signInWithFacebook = async () => {
    try {
      if (!signIn) return;
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_facebook',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error: any) {
      console.error('Facebook sign in error:', error);
      toast.error(error.message || 'Failed to sign in with Facebook');
    }
  };

  const signInAsGuest = async () => {
    toast.info('Guest mode is limited. Please create an account to save your work.');
    navigate('/dashboard');
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGoogle,
      signInWithFacebook,
      signInAsGuest,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
