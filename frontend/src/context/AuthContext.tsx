import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const login = (type: UserType, userInfo?: UserInfo) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (userInfo) {
      setUserInfo(userInfo);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
