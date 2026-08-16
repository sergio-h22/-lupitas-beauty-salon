function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require('stripe')(key);
}

export async function POST(req: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { refresh_url, return_url } = body;

    if (!refresh_url || !return_url) {
      return Response.json(
        { error: 'Missing refresh_url or return_url' },
        { status: 400 }
      );
    }

    const accountLink = await stripe.accountLinks.create({
      type: 'account_onboarding',
      refresh_url,
      return_url,
      collect: 'currently_due',
    });

    return Response.json({ url: accountLink.url });
  } catch (error) {
    console.error('Express onboarding error:', error);
    return Response.json(
      { error: 'Failed to create account link' },
      { status: 500 }
    );
  }
}
