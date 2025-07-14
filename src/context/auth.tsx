import '@app/globals.css'
import React, { createContext, useContext, useState, ReactNode, FC, JSX } from 'react';
import {User, userManager} from '@lib/user'

interface AuthContextType {
  user: User | undefined;
  address: string | undefined,
  login: (user: User|undefined, mnemonic: string, address: string) => User;
  logout: () => void;
  urlKey: string;
  setUrlKey: (key: string) => void;
  shortWallet: () => JSX.Element | string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [user, setUser] = useState<User | undefined>(undefined)
  const [urlKey, setUrlKey] = useState("")
  const login = (user: User|undefined, mnemonic: string, address: string) : User => {
    let localUser = user
    if(localUser === undefined) {
      localUser = {
        mnemonic: mnemonic,
        account: "account" + (userManager.size()+1),
        chain: "ethereum"
      }
      userManager.saveUser(localUser)
    }

    setAddress(address);
    setUser(localUser)
    return localUser
  }
  const logout = () => {
    setAddress(undefined)
    setUser(undefined)
  };

  const shortWallet = (): JSX.Element | string => {
    if (address === undefined) return '';
    return address.length > 10 ? (
      <span>
        {address.slice(0, 6)}
        <span className="ellipsis">...</span>
        {address.slice(-4)}
      </span>
    ) : (
      address
    );
  };

  return (
    <AuthContext.Provider value={{ 
      address, 
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