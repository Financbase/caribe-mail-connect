import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, User } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is remembered in localStorage
    const rememberedUser = localStorage.getItem('prmcms-user');
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('prmcms-user');
      }
    }
  }, []);

  const login = (email: string, password: string, rememberMe = false): boolean => {
    // Simple mock authentication - in real app, this would validate against backend
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password.length > 0) {
      setUser(foundUser);
      
      if (rememberMe) {
        localStorage.setItem('prmcms-user', JSON.stringify(foundUser));
      } else {
        sessionStorage.setItem('prmcms-session', JSON.stringify(foundUser));
      }
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prmcms-user');
    sessionStorage.removeItem('prmcms-session');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: user !== null
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