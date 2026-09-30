'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { SEED_CUSTOMERS, SEED_FARMERS } from '@/lib/seedData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchRoleForDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('agrovista_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to Priya Sharma (Customer) or Ramulu Goud (Farmer) for convenient immediate demonstration
        const defaultUser: User = {
          id: SEED_CUSTOMERS[0].user_id,
          name: SEED_CUSTOMERS[0].name,
          phone: SEED_CUSTOMERS[0].phone,
          email: SEED_CUSTOMERS[0].email,
          role: "CUSTOMER",
          language: "en",
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(defaultUser);
        localStorage.setItem('agrovista_user', JSON.stringify(defaultUser));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('agrovista_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrovista_user');
  };

  const switchRoleForDemo = (role: UserRole) => {
    let targetUser: User;
    if (role === 'FARMER') {
      const f = SEED_FARMERS[1]; // Lakshmi Bai
      targetUser = {
        id: f.user_id,
        name: f.name,
        phone: f.phone,
        email: f.email,
        role: 'FARMER',
        language: f.language,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (role === 'CUSTOMER') {
      const c = SEED_CUSTOMERS[0]; // Priya Sharma
      targetUser = {
        id: c.user_id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        role: 'CUSTOMER',
        language: 'en',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (role === 'DELIVERY_PARTNER') {
      targetUser = {
        id: 'u_delivery_1',
        name: 'Suresh Express',
        phone: '9888888888',
        role: 'DELIVERY_PARTNER',
        language: 'te',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      targetUser = {
        id: 'u_admin_1',
        name: 'AgroVista State Admin',
        phone: '9999999999',
        role: 'ADMIN',
        language: 'en',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    login(targetUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRoleForDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
