import '@app/globals.css'
import React, { createContext, useContext, useState, ReactNode, FC, JSX } from 'react';
import {User, userManager} from '@lib/user'

interface AuthContextType {
  user: User | undefined;
  wallet: Wallet | undefined,
  login: (user: User|undefined, mnemonic: string, wallet: Wallet) => User;
  logout: () => void;
  urlKey: string;
  setUrlKey: (key: string) => void;
  shortWallet: () => JSX.Element | string;
}

export type Wallet = {
    address: string;
    privateKey: string;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [user, setUser] = useState<User | undefined>(undefined)
  const [urlKey, setUrlKey] = useState("")
  const login = (user: User|undefined, mnemonic: string, wallet: Wallet) : User => {
    let localUser = user
    if(localUser === undefined) {
      localUser = {
        mnemonic: mnemonic,
        account: "account" + (userManager.size()+1),
        chain: "ethereum"
      }
      userManager.saveUser(localUser)
    }

    setWallet(wallet);
    setUser(localUser)
    return localUser
  }
  const logout = () => {
    setWallet(undefined)
    setUser(undefined)
  };

  const shortWallet = (): JSX.Element | string => {
    if (wallet === undefined) return '';
    return wallet.address.length > 10 ? (
      <span>
        {wallet.address.slice(0, 6)}
        <span className="ellipsis">...</span>
        {wallet.address.slice(-4)}
      </span>
    ) : (
      wallet.address
    );
  };

  return (
    <AuthContext.Provider value={{ 
      wallet, 
      login,
      logout, 
      user,
      shortWallet,
      urlKey,setUrlKey}}>
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