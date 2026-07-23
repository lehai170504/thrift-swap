/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/features/auth/api/authApi';
import { AuthResponse } from '@/features/auth/types/auth';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: AuthResponse | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}

import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const openLoginModal = () => {
    router.push('/login');
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    router.push('/register');
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  useEffect(() => {
    // Check cookies for existing session on load
    const storedUser = Cookies.get('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        Cookies.remove('user');
      }
    }
  }, [router]);

  // Prevent Admin from accessing normal pages
  useEffect(() => {
    if (user?.role === 'ADMIN' && !pathname.startsWith('/admin')) {
      router.push('/admin');
    }
  }, [user, pathname, router]);

  const login = (data: AuthResponse) => {
    setUser(data);
    Cookies.set('user', JSON.stringify(data), { expires: 7 }); // expires in 7 days
    if (data.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/products'); // Redirect to products after login
    }
  };

  const logout = async () => {
    setUser(null);
    Cookies.remove('user');
    try {
      await authApi.logout();
    } catch (e) { }
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, isAuthenticated: !!user,
      isLoginModalOpen, isRegisterModalOpen,
      openLoginModal, closeLoginModal,
      openRegisterModal, closeRegisterModal
    }}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
        {children}
      </GoogleOAuthProvider>
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
