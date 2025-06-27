import '../globals.css'
import React, { createContext, useContext, useState, ReactNode, FC, JSX } from 'react';

interface AuthContextType {
  loggedWallet: string;
  login: (addr: string) => void;
  logout: () => void;
  shortWallet: () => JSX.Element | string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [loggedWallet, setIsLoggedIn] = useState('');  
  const login = (addr: string) => {
    setIsLoggedIn(addr);
  }
  const logout = () => setIsLoggedIn('');

  const shortWallet = (): JSX.Element | string => {
    if (!loggedWallet) return '';
    return loggedWallet.length > 10 ? (
      <span>
        {loggedWallet.slice(0, 6)}
        <span className="ellipsis">...</span>
        {loggedWallet.slice(-4)}
      </span>
    ) : (
      loggedWallet // 修正了原代码中写成了不存在的变量 wallet
    );
  };

  return (
    <AuthContext.Provider value={{ loggedWallet, login, logout, shortWallet }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};