import { NextRequest, NextResponse } from 'next/server';
import { mercadopago, PLAN_DETAILS } from '@/lib/mercadopago';
import { Preference } from 'mercadopago';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mercadopago) {
      return NextResponse.json({ error: 'MercadoPago not configured' }, { status: 500 });
    }

    const { planType, successUrl, cancelUrl } = await request.json();

    if (!planType || !PLAN_DETAILS[planType as keyof typeof PLAN_DETAILS]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const plan = PLAN_DETAILS[planType as keyof typeof PLAN_DETAILS];

    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: `plan-${planType.toLowerCase()}`,
            title: plan.name,
            description: plan.description,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'CLP',
          }
        ],
        back_urls: {
          success: successUrl || `${request.nextUrl.origin}/dashboard?success=true&plan=${planType}`,
          failure: cancelUrl || `${request.nextUrl.origin}/pricing?canceled=true`,
          pending: `${request.nextUrl.origin}/dashboard?pending=true&plan=${planType}`,
        },
        auto_return: 'approved',
        external_reference: `user-${session.user.id}-plan-${planType}`,
        notification_url: `${request.nextUrl.origin}/api/mercadopago/webhook`,
        payer: {
          email: session.user.email || '',
          name: session.user.name || '',
        },
      },
    });

    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    console.error('Error creating MercadoPago checkout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}