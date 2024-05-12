import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingScreen } from './loading.screen';

export function SignOutScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const signOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    signOut();
  }, [signOut]);

  return <LoadingScreen />;
}
