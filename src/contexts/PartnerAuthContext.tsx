import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Partner } from '../types/partners';

interface PartnerCredentials {
  email: string;
  password: string;
}

interface PartnerAuthContextType {
  partner: Partner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: PartnerCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updatePartner: (partner: Partial<Partner>) => void;
}

const PartnerAuthContext = createContext<PartnerAuthContextType | undefined>(undefined);

export const usePartnerAuth = () => {
  const context = useContext(PartnerAuthContext);
  if (context === undefined) {
    throw new Error('usePartnerAuth must be used within a PartnerAuthProvider');
  }
  return context;
};

interface PartnerAuthProviderProps {
  children: ReactNode;
}

export const PartnerAuthProvider: React.FC<PartnerAuthProviderProps> = ({ children }) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('partnerToken');
      if (token) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: PartnerCredentials) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/partners/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { partner: partnerData, token, refreshToken: refreshTokenValue } = await response.json();
      
      // Store tokens
      localStorage.setItem('partnerToken', token);
      localStorage.setItem('partnerRefreshToken', refreshTokenValue);
      
      // Update state
      setPartner(partnerData);
      setIsAuthenticated(true);
      
      // Update API service token
      if (window.partnerApi) {
        window.partnerApi.setAuthToken(token);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('partnerToken');
    localStorage.removeItem('partnerRefreshToken');
    
    // Clear state
    setPartner(null);
    setIsAuthenticated(false);
    
    // Clear API service token
    if (window.partnerApi) {
      window.partnerApi.setAuthToken('');
    }
    
    // Redirect to login page
    window.location.href = '/partners/login';
  };

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('partnerRefreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/partners/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { partner: partnerData, token, refreshToken: newRefreshToken } = await response.json();
      
      // Update tokens
      localStorage.setItem('partnerToken', token);
      localStorage.setItem('partnerRefreshToken', newRefreshToken);
      
      // Update state
      setPartner(partnerData);
      setIsAuthenticated(true);
      
      // Update API service token
      if (window.partnerApi) {
        window.partnerApi.setAuthToken(token);
      }
      
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  };

  const updatePartner = (partnerData: Partial<Partner>) => {
    if (partner) {
      setPartner({ ...partner, ...partnerData });
    }
  };

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!isAuthenticated) return;

    const tokenRefreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        logout();
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes (assuming 15-minute token expiry)

    return () => clearInterval(tokenRefreshInterval);
  }, [isAuthenticated]);

  const value: PartnerAuthContextType = {
    partner,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    updatePartner,
  };

  return (
    <PartnerAuthContext.Provider value={value}>
      {children}
    </PartnerAuthContext.Provider>
  );
};

// Extend window object for global API access
declare global {
  interface Window {
    partnerApi?: {
      setAuthToken: (token: string) => void;
    };
  }
} 