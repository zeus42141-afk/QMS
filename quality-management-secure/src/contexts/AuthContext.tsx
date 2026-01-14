import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  departement: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; demoToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<boolean>;
  sessionExpiresAt: Date | null;
}

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role?: string;
  departement?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'qtrack_auth_token';
const USER_KEY = 'qtrack_auth_user';

// Demo users for offline/fallback mode
const DEMO_USERS: AuthUser[] = [
  {
    id: 'demo-admin',
    email: 'admin@riahisolutions.com',
    nom: 'RIAHI',
    prenom: 'Mohamed Aziz',
    role: 'admin',
    departement: 'Direction Qualité',
    is_active: true,
    created_at: '2024-01-15',
    last_login: new Date().toISOString(),
  },
  {
    id: 'demo-qualite',
    email: 'sarah.benali@riahisolutions.com',
    nom: 'Ben Ali',
    prenom: 'Sarah',
    role: 'qualite',
    departement: 'Qualité',
    is_active: true,
    created_at: '2024-02-10',
    last_login: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);

  // Initialize from storage
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setSessionExpiresAt(new Date(Date.now() + 30 * 60 * 1000));
      } catch (e) {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    // Demo mode - check against demo users
    const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (demoUser && password === 'Admin123!') {
      const token = 'demo-token-' + Date.now();
      const expiresAt = new Date(Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000));
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      storage.setItem(USER_KEY, JSON.stringify(demoUser));
      
      setUser(demoUser);
      setSessionExpiresAt(expiresAt);
      return { success: true };
    }

    return { success: false, error: 'Email ou mot de passe incorrect' };
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
    setSessionExpiresAt(null);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // Demo mode - simulate registration
    return { success: true };
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<{ success: boolean; error?: string; demoToken?: string }> => {
    return { success: true, demoToken: 'demo-reset-token' };
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    return { success: true };
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    return { success: true };
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    return !!user;
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    changePassword,
    refreshSession,
    sessionExpiresAt,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
