import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS: Record<string, { password: string; name: string }> = {
  anders: { password: 'vertex2025', name: 'Dr. Anderson' }
};

const AUTH_STORAGE_KEY = 'vertex_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.username && USERS[parsed.username]) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const lowerUsername = username.toLowerCase();
    const userData = USERS[lowerUsername];
    
    if (userData && userData.password === password) {
      const newUser = { username: lowerUsername, name: userData.name };
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
