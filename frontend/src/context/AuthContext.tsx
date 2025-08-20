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
  login: (type: UserType, userInfo?: UserInfo) => void;
  logout: () => void;
  restoreSession: () => void; // 세션 복구 함수 추가
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 세션 복구 함수
  const restoreSession = () => {
    try {
      const savedUserInfo = sessionStorage.getItem('userInfo');
      const savedUserType = sessionStorage.getItem('userType');
      
      if (savedUserInfo && savedUserType) {
        const userInfo = JSON.parse(savedUserInfo);
        const userType = savedUserType as UserType;
        
        console.log('세션 복구:', { userInfo, userType });
        setIsLoggedIn(true);
        setUserType(userType);
        setUserInfo(userInfo);
        
        return true;
      }
    } catch (error) {
      console.error('세션 복구 실패:', error);
    }
    return false;
  };

  // 컴포넌트 마운트 시 세션 복구 시도
  useEffect(() => {
    restoreSession();
  }, []);

  const login = (type: UserType, userInfo?: UserInfo) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (userInfo) {
      setUserInfo(userInfo);
    }
    
    // 로그인 정보를 세션에 저장
    if (userInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    if (type) {
      sessionStorage.setItem('userType', type);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserInfo(null);
    
    // 세션에서 로그인 정보 제거
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userInfo, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
};
