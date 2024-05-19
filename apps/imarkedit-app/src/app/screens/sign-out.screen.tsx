import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { LoadingScreen } from './loading.screen';
import { useError } from 'react-use';

export function SignOutScreen() {
  const navigate = useNavigate();
  const dispatch = useError();
  const { logout } = useAuth();
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
      dispatch(error as Error);
    }
  }, [dispatch, logout, navigate]);

  useEffect(() => {
    signOut();
  }, [signOut]);

  return <LoadingScreen />;
}
