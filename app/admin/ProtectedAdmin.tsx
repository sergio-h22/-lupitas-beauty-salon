'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { addAuditLog } from '@/lib/audit-log';
import AdminClient from './AdminClient';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export default function ProtectedAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout>();
  const userEmailRef = useRef<string>('');

  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = setTimeout(async () => {
      addAuditLog('LOGOUT', userEmailRef.current || 'unknown', true, { reason: 'inactivity' });
      await supabase.auth.signOut();
      router.push('/admin/login?reason=session-expired');
    }, INACTIVITY_TIMEOUT_MS);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          router.push('/admin/login');
          return;
        }

        userEmailRef.current = data.session.user?.email || '';
        addAuditLog('LOGIN', userEmailRef.current, true);
        setIsAuthenticated(true);
        resetInactivityTimer();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    // Set up inactivity listener
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/admin/login');
      }
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      subscription?.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-ink/20 border-t-ink"></div>
          <p className="text-ink-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminClient />;
}
