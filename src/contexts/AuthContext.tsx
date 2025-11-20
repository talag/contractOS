import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  setTokenAndFetchUser: (token: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Fetch user info
      fetchUserInfo(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async (authToken: string) => {
    try {
      const userInfo = await api.getCurrentUser(authToken);
      setUser(userInfo);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Token might be invalid, clear it
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await api.login(username, password);
    const newToken = response.access_token;

    setToken(newToken);
    localStorage.setItem('token', newToken);

    // Fetch user info after login
    await fetchUserInfo(newToken);
  };

  const signup = async (email: string, username: string, password: string) => {
    const newUser = await api.signup(email, username, password);

    // After signup, automatically log in
    await login(username, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const setTokenAndFetchUser = async (authToken: string) => {
    setToken(authToken);
    localStorage.setItem('token', authToken);
    await fetchUserInfo(authToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, setTokenAndFetchUser, isLoading }}>
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
