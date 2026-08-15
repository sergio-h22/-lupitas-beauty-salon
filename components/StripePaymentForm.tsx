'use client';

import { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  amount: number;
  description: string;
  email: string;
  name: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function StripePaymentForm({
  amount,
  description,
  email,
  name,
  onSuccess,
  onError,
  disabled = false,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    async function createPaymentIntent() {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            description,
            email,
            name,
          }),
        });

        if (!response.ok) throw new Error('Failed to create payment intent');

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Payment setup failed');
      }
    }

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, description, email, name, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/book`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientSecret) {
    return <div className="animate-pulse">Loading payment form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={isProcessing || disabled || !stripe || !elements}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-35"
      >
        {isProcessing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}
