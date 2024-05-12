import { createContext } from 'react';
import { AppToken } from '@imarkedit/lib/imarkedit-crypto';

export enum AuthState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  RegisteredDevice = 'RegisteredDevice',
  SignedUp = 'SignedUp',
}

export interface AuthContext {
  state: AuthState;
  accountId?: string;
  username?: string;
  otp_data?: string;
  token?: AppToken;
  login: () => Promise<void>;
  signup: (username: string) => Promise<void>;
  confirmSignup: (username: string, otp: string) => Promise<void>;
  registerDevice: (username: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const authContext = createContext<AuthContext | undefined>(undefined);
