'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthResponse, AuthUser } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{ user: AuthUser | null; isLoading: boolean }>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const user = authApi.getUser();
    setAuthState({ user, isLoading: false });
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  const { user, isLoading } = authState;

  const login = (auth: AuthResponse) => {
    const userObj: AuthUser = { id: auth.id, username: auth.username, email: auth.email, roles: auth.roles || [] };
    authApi.saveAuth(auth);
    setAuthState((prev) => ({ ...prev, user: userObj }));
  };

  const logout = () => {
    authApi.logout();
    setAuthState((prev) => ({ ...prev, user: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
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
