import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  name: string;
}

interface StoredAuth {
  user: User;
  expiresAt: number | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS: Record<string, { password: string; name: string }> = {
  [import.meta.env.VITE_AUTH_USER || 'demo']: { 
    password: import.meta.env.VITE_AUTH_PASS || 'demo', 
    name: import.meta.env.VITE_AUTH_NAME || 'Demo User' 
  }
};

const AUTH_STORAGE_KEY = 'vertex_auth';
const TOKEN_DURATION_DAYS = 30;

function getStoredAuth(): StoredAuth | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed: StoredAuth = JSON.parse(stored);

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    if (!parsed.user?.username || !USERS[parsed.user.username]) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      setUser(storedAuth.user);
    }
  }, []);

  const login = (username: string, password: string, rememberMe: boolean = false): boolean => {
    const lowerUsername = username.toLowerCase();
    const userData = USERS[lowerUsername];

    if (userData && userData.password === password) {
      const newUser = { username: lowerUsername, name: userData.name };
      setUser(newUser);

      const authData: StoredAuth = {
        user: newUser,
        expiresAt: rememberMe ? Date.now() + (TOKEN_DURATION_DAYS * 24 * 60 * 60 * 1000) : null
      };

      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);

      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
