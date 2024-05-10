import { authContext } from './context';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useStorageService } from '../storage';
import { useAsync } from 'react-use';

interface AuthProviderProps {

}

export function AuthProvider({ children }: PropsWithChildren<AuthProviderProps>) {
  const service = useStorageService<string>('auth');
  const login = (kid: string, accountId: string) => {
    // Make a request to the server to login
  };
  const register = (kid: string, publicKey: string) => {
    // Make a request to the server to register
  };
  const logout = () => {
    // Make a request to the server to logout
  };
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const { value, loading } = useAsync(() => service.get('accountId'), [service]);

  useEffect(() => {
    if (value) {
      setAccountId(value);
    }
  }, [value]);

  return (
    <authContext.Provider value={{ login, logout, accountId, register, ready: !loading }}>
      {children}
    </authContext.Provider>
  );
}
