'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserDataType } from '@/schemaValidation/auth.schema';

export interface IAppContext {
  user: UserDataType;
  setUser: (user: UserDataType) => void;
  isActioned: boolean;
  setIsActioned: (isActioned: boolean) => void;
  token: string | null;
  login: (newToken: string) => void;
}

const DEFAULT_CONTEXT: IAppContext = {
  user: {} as UserDataType,
  setUser: () => {},
  isActioned: false,
  setIsActioned: () => {},
  token: null,
  login: () => {},
};

const AppContext = createContext<IAppContext>(DEFAULT_CONTEXT);

export const useAppContext = (): IAppContext => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider.');
  }
  return context;
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserDataType>({} as UserDataType);
  const [isActioned, setIsActioned] = useState<boolean>(false);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('sessionToken', newToken);
    setToken(newToken);
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, isActioned, setIsActioned, token, login }}
    >
      {children}
    </AppContext.Provider>
  );
}
