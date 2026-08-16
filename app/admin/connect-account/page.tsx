'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ConnectedAccount {
  id: string;
  email: string;
  business_name: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  is_ready: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
  };
}

export default function ConnectAccountPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<ConnectedAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load connected account from localStorage
    const stored = localStorage.getItem('stripe-connected-account');
    if (stored) {
      try {
        setConnected(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored account:', e);
      }
    }
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = window.location.origin;
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh_url: `${baseUrl}/admin/connect-account?refresh=true`,
          return_url: `${baseUrl}/admin/connect-account?return=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start onboarding');
      }

      // Redirect to Stripe's onboarding flow
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure? Customers will no longer be able to make deposits.')) {
      localStorage.removeItem('stripe-connected-account');
      setConnected(null);
    }
  };

  // Check for return from Stripe onboarding
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('return') === 'true') {
      // Account connection completed, fetch the details
      const accountId = params.get('account');
      if (accountId) {
        fetch(`/api/stripe/connect/callback?account=${accountId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              localStorage.setItem('stripe-connected-account', JSON.stringify(data.account));
              setConnected(data.account);
              // Clean up URL
              router.replace('/admin/connect-account');
            } else {
              setError(data.error || 'Failed to connect account');
            }
          })
          .catch((err) => setError(err.message));
      }
    }
  }, [router]);

  return (
    <main className="shell py-section">
      <div className="max-w-measure">
        <Link href="/admin" className="btn-outline mb-8 inline-block">
          ← Dashboard
        </Link>

        <h1 className="text-display-lg mb-6">Stripe Account Connection</h1>

        {error && (
          <div className="mb-6 border-l-4 border-rose bg-rose/5 p-4">
            <p className="text-sm text-rose-text font-medium">{error}</p>
          </div>
        )}

        {connected ? (
          <div className="space-y-6">
            <div className="border border-ink/10 p-6">
              <h2 className="text-display-sm mb-4">Connected Account</h2>

              <dl className="space-y-3">
                <div>
                  <dt className="font-medium text-ink-muted text-sm uppercase tracking-wider">
                    Account ID
                  </dt>
                  <dd className="font-mono text-sm mt-1">{connected.id}</dd>
                </div>

                <div>
                  <dt className="font-medium text-ink-muted text-sm uppercase tracking-wider">
                    Business Name
                  </dt>
                  <dd className="mt-1">{connected.business_name}</dd>
                </div>

                <div>
                  <dt className="font-medium text-ink-muted text-sm uppercase tracking-wider">
                    Email
                  </dt>
                  <dd className="mt-1">{connected.email}</dd>
                </div>

                <div>
                  <dt className="font-medium text-ink-muted text-sm uppercase tracking-wider">
                    Status
                  </dt>
                  <dd className="mt-1 flex gap-2 flex-wrap">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        connected.charges_enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      Charges: {connected.charges_enabled ? '✓ Enabled' : '✗ Pending'}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        connected.payouts_enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      Payouts: {connected.payouts_enabled ? '✓ Enabled' : '✗ Pending'}
                    </span>
                  </dd>
                </div>

                {connected.requirements?.currently_due?.length > 0 && (
                  <div>
                    <dt className="font-medium text-ink-muted text-sm uppercase tracking-wider">
                      Still Needed
                    </dt>
                    <dd className="mt-1">
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {connected.requirements.currently_due.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleConnect}
                  className="btn-outline"
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Update Account'}
                </button>
                <button onClick={handleDisconnect} className="btn-quiet">
                  Disconnect
                </button>
              </div>
            </div>

            <div className="bg-cream-deep p-4 border border-ink/10">
              <p className="text-sm text-ink-muted">
                <strong>Platform fee:</strong> 0.25% + $0.25 per transaction. Customers see these
                as charges, but they cover the platform's service fee and are retained by you.
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-ink/10 p-8 text-center">
            <h2 className="text-display-sm mb-4">No Account Connected</h2>
            <p className="mb-8 text-ink-muted max-w-prose">
              Connect your Stripe account to start accepting payment deposits from customers. You'll
              be able to review requirements and complete your account setup with Stripe.
            </p>
            <button onClick={handleConnect} className="btn-primary" disabled={loading}>
              {loading ? 'Connecting...' : 'Connect Stripe Account'}
            </button>
          </div>
        )}

        <div className="mt-12 border-t border-ink/10 pt-8">
          <h3 className="text-display-sm mb-4">How it works</h3>
          <ol className="space-y-3 text-ink-muted">
            <li className="flex gap-4">
              <span className="font-medium text-ink flex-none w-6">1.</span>
              <span>Click "Connect Stripe Account" to start the onboarding flow.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-medium text-ink flex-none w-6">2.</span>
              <span>Complete your business information with Stripe.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-medium text-ink flex-none w-6">3.</span>
              <span>Verify your identity and bank account.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-medium text-ink flex-none w-6">4.</span>
              <span>Your salon is ready to accept deposits on the booking page.</span>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
