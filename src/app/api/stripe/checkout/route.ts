import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, userEmail } = await request.json();

    if (!priceId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, userId, userEmail' },
        { status: 400 }
      );
    }

    let stripeCustomerId: string | undefined;

    // Try to get/set Stripe customer ID from Firestore
    try {
      const db = getAdminDb();
      const userDoc = await db.collection('users').doc(userId).get();
      stripeCustomerId = userDoc.data()?.stripeCustomerId;

      if (!stripeCustomerId) {
        // Create Stripe customer
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            firebaseUserId: userId,
          },
        });
        stripeCustomerId = customer.id;

        // Save customer ID to Firestore
        await db.collection('users').doc(userId).set(
          {
            stripeCustomerId,
            email: userEmail,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (dbError) {
      console.error('Firestore error (continuing with Stripe-only flow):', dbError);

      // Fallback: Create Stripe customer without Firestore
      // Search for existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            firebaseUserId: userId,
          },
        });
        stripeCustomerId = customer.id;
      }
    }

    // Create checkout session
    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: {
        firebaseUserId: userId,
      },
      subscription_data: {
        metadata: {
          firebaseUserId: userId,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
