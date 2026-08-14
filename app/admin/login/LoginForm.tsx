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

    try {
      await signInWithEmail(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl text-ink">Lupita's Beauty Salon</h1>
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
              placeholder="owner@salon.com"
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
            <div className="rounded border border-rose-text/30 bg-rose/10 p-3 text-sm font-medium text-rose-text">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 border border-gold/50 bg-cream-deep p-4 text-center text-xs text-ink-muted">
          <p className="font-semibold text-ink">First time?</p>
          <p className="mt-1">Contact the salon owner to create your admin account in Supabase.</p>
        </div>
      </div>
    </div>
  );
}
