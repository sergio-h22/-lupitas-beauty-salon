'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/lib/supabase';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmail(email, password);
      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';

      // User-friendly error messages
      if (message.includes('Invalid login credentials')) {
        setError('Email or password is incorrect');
      } else if (message.includes('too many requests')) {
        setError('Too many login attempts. Please try again in 15 minutes');
      } else if (message.includes('Email not confirmed')) {
        setError('Please verify your email address first');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone px-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl text-ink">Jaeso Studio</h1>
          <p className="mt-2 text-ink-muted">Owner Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-ink/10 bg-white p-8">
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@studio.com"
              required
              className="field-input"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="field-input"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded border border-alert-text/30 bg-alert/10 p-3 text-sm font-medium text-alert-text">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 border border-sand/50 bg-bone-deep p-4 text-center text-xs text-ink-muted">
          <p className="font-semibold text-ink">First time?</p>
          <p className="mt-1">Contact the studio owner to create your admin account in Supabase.</p>
        </div>
      </div>
    </div>
  );
}
