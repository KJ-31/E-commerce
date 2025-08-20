import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserType = 'user' | 'seller' | null;

interface UserInfo {
  user_id: number;
  email: string;
  user_name: string;
  user_addr?: string;
  user_phone_num?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  userInfo: UserInfo | null;
  login: (email: string, password: string, type?: UserType) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 세션 복구
  const restoreSession = () => {
    try {
      const savedUserInfo = sessionStorage.getItem('userInfo');
      const savedUserType = sessionStorage.getItem('userType');
      if (savedUserInfo && savedUserType) {
        setIsLoggedIn(true);
        setUserInfo(JSON.parse(savedUserInfo));
        setUserType(savedUserType as UserType);
      }
    } catch (error) {
      console.error('세션 복구 실패:', error);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  // API 기반 로그인
  const login = async (email: string, password: string, type: UserType = 'user') => {
    try {
      const response = await fetch(`http://localhost:3001/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType: type }),
      });

      if (!response.ok) return false;

      const result = await response.json();
      const data = result.data.user;

      const userInfo: UserInfo = {
        user_id: data.id || data.user_id,
        email: data.email,
        user_name: data.name || data.user_name,
        user_addr: data.user_addr,
        user_phone_num: data.user_phone_num,
      };

      setIsLoggedIn(true);
      setUserType(type);
      setUserInfo(userInfo);

      // 세션 저장
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      sessionStorage.setItem('userType', type);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserInfo(null);
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userInfo, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
};
