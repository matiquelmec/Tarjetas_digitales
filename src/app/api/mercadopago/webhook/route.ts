import { NextRequest, NextResponse } from 'next/server';
import { mercadopago } from '@/lib/mercadopago';
import { prisma } from '@/lib/db';
import { Plan } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    if (!mercadopago) {
      return NextResponse.json({ error: 'MercadoPago not configured' }, { status: 500 });
    }

    const body = await request.json();
    console.log('MercadoPago webhook received:', body);

    // MercadoPago sends payment notifications
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Get payment details from MercadoPago
      const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        }
      });

      if (!payment.ok) {
        console.error('Failed to fetch payment from MercadoPago');
        return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 400 });
      }

      const paymentData = await payment.json();
      
      // Only process approved payments
      if (paymentData.status === 'approved') {
        const externalReference = paymentData.external_reference;
        
        // Parse external reference: "user-{userId}-plan-{planType}"
        const match = externalReference?.match(/^user-(.+)-plan-(.+)$/);
        if (!match) {
          console.error('Invalid external reference format:', externalReference);
          return NextResponse.json({ error: 'Invalid external reference' }, { status: 400 });
        }

        const [, userId, planType] = match;
        
        // Validate plan type
        if (!['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'].includes(planType)) {
          console.error('Invalid plan type:', planType);
          return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
        }

        // Update user's plan in database
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: planType as Plan }
          });

          // Create subscription record
          await prisma.subscription.create({
            data: {
              userId,
              stripeSubscriptionId: paymentId, // Using payment ID as subscription ID for now
              stripePriceId: `mp-${planType.toLowerCase()}`,
              status: 'active',
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            }
          });

          console.log(`Updated user ${userId} to plan ${planType}`);
        } catch (dbError) {
          console.error('Database error:', dbError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('MercadoPago webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}