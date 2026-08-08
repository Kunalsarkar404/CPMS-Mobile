import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'expo-router';

import LoadingState from '@/components/LoadingState';
import { useAppDispatch } from '@/hooks';
import { getAuthSession, clearAuthSession } from '@/services/auth/session';
import { onSessionExpired } from '@/services/api/client';
import { restoreSession, logout } from '@/store/slices/authSlice';

interface AuthBootstrapProps {
  children: ReactNode;
}

export default function AuthBootstrap({ children }: AuthBootstrapProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    onSessionExpired(() => {
      void clearAuthSession();
      dispatch(logout());
      router.replace('/(auth)/login');
    });
  }, [dispatch, router]);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      const session = await getAuthSession();
      if (!active) return;

      if (session) {
        dispatch(restoreSession(session));
      }
      setIsRestoring(false);
    };

    void restore();

    return () => {
      active = false;
    };
  }, [dispatch]);

  if (isRestoring) {
    return <LoadingState message="Restoring your session..." fullScreen />;
  }

  return children;
}
