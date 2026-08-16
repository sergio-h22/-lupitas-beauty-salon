import { NextRequest, NextResponse } from 'next/server';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require('stripe')(key);
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const stripe = getStripe();

  if (!stripe || !webhookSecret) {
    console.warn('Stripe or webhook secret not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'account.updated': {
        const account = event.data.object;
        // In production, update your database with the account status.
        // For now, log it for debugging.
        console.log('Account updated:', {
          id: account.id,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          requirements: account.requirements,
        });
        break;
      }

      case 'account.external_account.created': {
        const account = event.data.object;
        console.log('External account created (payout method added):', account.id);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object;
        // Platform fee was collected successfully. In production, you might
        // update appointment records, send confirmations, etc.
        console.log('Charge succeeded:', {
          id: charge.id,
          amount: charge.amount,
          application_fee_amount: charge.application_fee_amount,
        });
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object;
        console.error('Charge failed:', {
          id: charge.id,
          failure_message: charge.failure_message,
        });
        break;
      }

      default:
        // Unhandled event type, but don't fail the webhook
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
