'use client';

import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import { getCurrentUser } from '@/lib/actions/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed inset-0 bg-[var(--gray-black)] blur-sm pointer-events-none overflow-hidden">
          {children}
        </div>
        <AuthModal isOpen={true} onClose={checkAuth} />
      </>
    );
  }

  return <>{children}</>;
}
