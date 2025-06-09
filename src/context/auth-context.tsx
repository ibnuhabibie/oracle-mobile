import React, { createContext, FC, ReactNode, useState } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => { },
  logout: () => { },
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
