import { createContext } from 'react';

export interface AuthContext {
  accountId?: string;
  login: (kid: string, accountId: string) => void;
  register: (kid: string, publicKey: string) => void;
  logout: () => void;
  ready: boolean;
}

export const authContext = createContext<AuthContext | undefined>(undefined);
