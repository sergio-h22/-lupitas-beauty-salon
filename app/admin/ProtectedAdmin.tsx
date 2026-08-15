'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, isAuthConfigured } from '@/lib/supabase';
import { addAuditLog } from '@/lib/audit-log';
import AdminClient from './AdminClient';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export default function ProtectedAdmin() {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'authed' | 'denied' | 'unconfigured'>('checking');
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const userEmailRef = useRef<string>('');

  useEffect(() => {
    // Without Supabase keys there is no auth to enforce. Say so plainly rather
    // than bouncing to a login screen that cannot possibly succeed.
    if (!isAuthConfigured()) {
      setState('unconfigured');
      return;
    }

    const supabase = getSupabase();

    const resetInactivityTimer = () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = setTimeout(async () => {
        addAuditLog('LOGOUT', userEmailRef.current || 'unknown', true, { reason: 'inactivity' });
        await supabase.auth.signOut();
        router.push('/admin/login?reason=session-expired');
      }, INACTIVITY_TIMEOUT_MS);
    };

    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!data.session) {
          setState('denied');
          router.push('/admin/login');
          return;
        }

        userEmailRef.current = data.session.user?.email || '';
        addAuditLog('LOGIN', userEmailRef.current, true);
        setState('authed');
        resetInactivityTimer();
      } catch (error) {
        console.error('Auth check failed:', error);
        if (!cancelled) {
          setState('denied');
          router.push('/admin/login');
        }
      }
    })();

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;
    const handleActivity = () => resetInactivityTimer();
    events.forEach((event) => document.addEventListener(event, handleActivity, { passive: true }));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setState('denied');
        router.push('/admin/login');
      }
    });

    return () => {
      cancelled = true;
      events.forEach((event) => document.removeEventListener(event, handleActivity));
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      subscription?.unsubscribe();
    };
  }, [router]);

  if (state === 'unconfigured') {
    return (
      <div className="shell py-section">
        <div className="max-w-prose border border-alert-text/30 bg-alert/10 p-8">
          <h1 className="text-display-sm">Authentication is not configured</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            This dashboard is unprotected until Supabase keys are set. Add{' '}
            <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
            <code className="font-mono text-ink">.env.local</code>, then create an owner account in
            the Supabase dashboard. Do not deploy this page publicly until that is done.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'checking') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-body text-label font-medium uppercase text-ink-faint">Loading…</p>
      </div>
    );
  }

  if (state !== 'authed') return null;

  return <AdminClient />;
}
