import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  userRole: 'teacher' | 'student' | null;
  setUserRole: (role: 'teacher' | 'student' | null) => void;
  clearUserRole: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [userRole, setUserRoleState] = useState<'teacher' | 'student' | null>(null);

  // Load user and role from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('yadalearn-user');
    const savedRole = localStorage.getItem('yadalearn-user-role');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedRole && (savedRole === 'teacher' || savedRole === 'student')) {
      setUserRoleState(savedRole as 'teacher' | 'student');
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate authentication
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = {
            email,
            name: email.split('@')[0]
          };
          setUser(userData);
          localStorage.setItem('yadalearn-user', JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setUserRoleState(null);
    localStorage.removeItem('yadalearn-user');
    localStorage.removeItem('yadalearn-user-role');
  };

  const setUserRole = (role: 'teacher' | 'student' | null) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem('yadalearn-user-role', role);
    } else {
      localStorage.removeItem('yadalearn-user-role');
    }
  };

  const clearUserRole = () => {
    setUserRoleState(null);
    localStorage.removeItem('yadalearn-user-role');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoaded,
      userRole,
      setUserRole,
      clearUserRole,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
