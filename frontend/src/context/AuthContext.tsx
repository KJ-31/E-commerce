import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserType = 'general' | 'seller' | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  token: string | null;
  login: (type: UserType, token: string) => void;
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
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
