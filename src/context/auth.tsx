import '@app/globals.css'
import { HDNodeWallet } from 'ethers'
import React, { createContext, useContext, useState, ReactNode, FC, JSX } from 'react';
import {User} from '@lib/user'

interface AuthContextType {
  loggedWallet: HDNodeWallet | undefined;
  chain: string;
  setChain: (chain: string) => void;
  login: (wallet: HDNodeWallet | undefined) => void;
  logout: () => void;
  shortWallet: () => JSX.Element | string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [loggedWallet, setWallet] = useState<HDNodeWallet | undefined>(undefined)
  const [chain, setChain] = useState('');
  const login = (wallet: HDNodeWallet | undefined) => {
    setWallet(wallet);
  }
  const logout = () => setWallet(undefined);

  const shortWallet = (): JSX.Element | string => {
    if (loggedWallet === undefined) return '';
    const walletStr = loggedWallet.address;
    return walletStr.length > 10 ? (
      <span>
        {walletStr.slice(0, 6)}
        <span className="ellipsis">...</span>
        {walletStr.slice(-4)}
      </span>
    ) : (
      walletStr
    );
  };

  return (
    <AuthContext.Provider value={{ 
      loggedWallet, 
      login, 
      logout, 
      shortWallet, 
      chain, setChain }}>
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