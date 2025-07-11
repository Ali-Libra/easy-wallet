import '@app/globals.css'
import { HDNodeWallet } from 'ethers'
import React, { createContext, useContext, useState, ReactNode, FC, JSX } from 'react';
import {User, userManager} from '@lib/user'

interface AuthContextType {
  loggedWallet: HDNodeWallet | undefined;
  user: User | undefined;
  login: (user: User | undefined, wallet: HDNodeWallet) => User;
  logout: () => void;
  shortWallet: () => JSX.Element | string;
  urlKey: string;
  setUrlKey: (key: string) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [loggedWallet, setWallet] = useState<HDNodeWallet | undefined>(undefined)
  const [user, setUser] = useState<User | undefined>(undefined)
  const [urlKey, setUrlKey] = useState("")
  const login = (user: User|undefined, wallet: HDNodeWallet) : User => {
    let localUser = user
    if(localUser === undefined) {
      const phrase = wallet.mnemonic?.phrase
      localUser = {
        mnemonic: phrase||"",
        account: "account" + (userManager.size()+1),
        chain: "ethereum"
      }
      userManager.saveUser(localUser)
    }

    setWallet(wallet);
    setUser(user)
    return localUser
  }
  const logout = () => {
    setWallet(undefined)
    setUser(undefined)
  };

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