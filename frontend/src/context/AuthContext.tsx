import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserType = 'general' | 'seller' | null;

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
    
  token: string | null;
  userInfo: UserInfo | null;

  login: (email: string, password: string, type?: UserType) => Promise<boolean>;
    
  logout: () => void;
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType') as UserType;
    if (storedToken && storedUserType) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUserType(storedUserType);
    }
  }, []);

  const login = (type: UserType, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', type || '');
    setIsLoggedIn(true);
    setToken(token);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setToken(null);
    setUserType(null);
    setUserInfo(null);
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, userInfo, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
