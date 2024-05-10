import { useContext } from 'react';
import { authContext } from './context';

export function useAuth() {
  return useContext(authContext);
}
