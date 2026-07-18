import { useEffect, useState, type ReactNode } from 'react';

import LoadingState from '@/components/LoadingState';
import { useAppDispatch } from '@/hooks';
import { getAuthSession } from '@/services/auth/session';
import { restoreSession } from '@/store/slices/authSlice';

interface AuthBootstrapProps {
  children: ReactNode;
}

export default function AuthBootstrap({ children }: AuthBootstrapProps) {
  const dispatch = useAppDispatch();
  const [isRestoring, setIsRestoring] = useState(true);

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
