import { NextRequest, NextResponse } from 'next/server';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require('stripe')(key);
}

export async function GET(req: NextRequest) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  const searchParams = req.nextUrl.searchParams;
  const accountId = searchParams.get('account');

  if (!accountId) {
    return NextResponse.json(
      { error: 'No account ID returned from Stripe' },
      { status: 400 }
    );
  }

  try {
    const account = await stripe.accounts.retrieve(accountId);

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const isReady =
      account.charges_enabled &&
      account.payouts_enabled &&
      !account.requirements?.currently_due?.length;

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        email: account.email,
        business_name: account.business_profile?.name || 'Connected Account',
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        requirements: account.requirements,
        is_ready: isReady,
      },
    });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve account details' },
      { status: 500 }
    );
  }
}
