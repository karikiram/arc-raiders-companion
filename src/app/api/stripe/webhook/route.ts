import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type Stripe from 'stripe';

async function updateSubscriptionInFirestore(
  userId: string,
  subscription: Stripe.Subscription
) {
  const db = getAdminDb();

  // Determine period from price interval
  const priceId = subscription.items.data[0]?.price.id;
  const interval = subscription.items.data[0]?.price.recurring?.interval;
  const period = interval === 'year' ? 'yearly' : 'monthly';

  // Access subscription period dates (handle both old and new Stripe API versions)
  const periodStart = (subscription as unknown as { current_period_start: number }).current_period_start;
  const periodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;

  const subscriptionData = {
    id: subscription.id,
    status: subscription.status,
    tier: subscription.status === 'active' || subscription.status === 'trialing' ? 'pro' : 'free',
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    period,
    currentPeriodStart: Timestamp.fromDate(new Date(periodStart * 1000)),
    currentPeriodEnd: Timestamp.fromDate(new Date(periodEnd * 1000)),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: FieldValue.serverTimestamp(),
  };

  // Update the subscription document in the user's subscriptions subcollection
  await db
    .collection('users')
    .doc(userId)
    .collection('subscriptions')
    .doc(subscription.id)
    .set(subscriptionData, { merge: true });

  // Also update the main user document with current subscription status
  await db.collection('users').doc(userId).set(
    {
      currentSubscription: {
        tier: subscriptionData.tier,
        status: subscriptionData.status,
        period: subscriptionData.period,
        currentPeriodEnd: subscriptionData.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
      },
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`Updated subscription for user ${userId}:`, subscriptionData.status, subscriptionData.tier);
}

async function handleSubscriptionDeleted(userId: string, subscriptionId: string) {
  const db = getAdminDb();

  // Update the subscription document
  await db
    .collection('users')
    .doc(userId)
    .collection('subscriptions')
    .doc(subscriptionId)
    .set(
      {
        status: 'canceled',
        tier: 'free',
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  // Update the main user document
  await db.collection('users').doc(userId).set(
    {
      currentSubscription: {
        tier: 'free',
        status: 'canceled',
        period: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`Subscription canceled for user ${userId}`);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  console.log('Received Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.firebaseUserId;

        if (userId && session.subscription) {
          // Fetch the full subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await updateSubscriptionInFirestore(userId, subscription);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.firebaseUserId;

        if (userId) {
          await updateSubscriptionInFirestore(userId, subscription);
        } else {
          // Try to find user by customer ID
          const db = getAdminDb();
          const usersSnapshot = await db
            .collection('users')
            .where('stripeCustomerId', '==', subscription.customer)
            .limit(1)
            .get();

          if (!usersSnapshot.empty) {
            const userDoc = usersSnapshot.docs[0];
            await updateSubscriptionInFirestore(userDoc.id, subscription);
          } else {
            console.error('Could not find user for subscription:', subscription.id);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.firebaseUserId;

        if (userId) {
          await handleSubscriptionDeleted(userId, subscription.id);
        } else {
          // Try to find user by customer ID
          const db = getAdminDb();
          const usersSnapshot = await db
            .collection('users')
            .where('stripeCustomerId', '==', subscription.customer)
            .limit(1)
            .get();

          if (!usersSnapshot.empty) {
            const userDoc = usersSnapshot.docs[0];
            await handleSubscriptionDeleted(userDoc.id, subscription.id);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Subscription renewed successfully
        const invoiceSubscription = (invoice as unknown as { subscription: string | null }).subscription;
        if (invoiceSubscription) {
          const subscription = await stripe.subscriptions.retrieve(invoiceSubscription);
          const userId = subscription.metadata?.firebaseUserId;

          if (userId) {
            await updateSubscriptionInFirestore(userId, subscription);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Payment failed - subscription might go to past_due
        const failedInvoiceSubscription = (invoice as unknown as { subscription: string | null }).subscription;
        if (failedInvoiceSubscription) {
          const subscription = await stripe.subscriptions.retrieve(failedInvoiceSubscription);
          const userId = subscription.metadata?.firebaseUserId;

          if (userId) {
            await updateSubscriptionInFirestore(userId, subscription);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
