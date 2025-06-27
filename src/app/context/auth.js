import '../globals.css'
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [loggedWallet, setIsLoggedIn] = useState('');  
  const login = (addr) => {
    setIsLoggedIn(addr);
  }
  const logout = () => setIsLoggedIn('');

  const shortWallet = () => {
    if (!loggedWallet) return '';
    return loggedWallet.length > 10 ? 
      <span>
        {`${loggedWallet.slice(0, 6)}`}
        <span className="ellipsis">...</span>
        {`${loggedWallet.slice(-4)}`}
      </span> : wallet;
  };

  return (
    <AuthContext.Provider value={{ loggedWallet, login, logout, shortWallet }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);