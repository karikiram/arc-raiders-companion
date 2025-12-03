import { NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';

// This endpoint creates the Stripe products and prices
// Run once: curl -X POST http://localhost:3000/api/stripe/setup
export async function POST() {
  try {
    // Check if product already exists
    const products = await stripe.products.list({ limit: 10 });
    let product = products.data.find(p => p.name === STRIPE_CONFIG.productName);

    if (!product) {
      // Create the product
      product = await stripe.products.create({
        name: STRIPE_CONFIG.productName,
        description: STRIPE_CONFIG.productDescription,
        metadata: {
          app: 'arc-raiders-companion',
        },
      });
      console.log('Created product:', product.id);
    } else {
      console.log('Product already exists:', product.id);
    }

    // Check for existing prices
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
    });

    const monthlyPrice = existingPrices.data.find(
      p => p.recurring?.interval === 'month'
    );
    const yearlyPrice = existingPrices.data.find(
      p => p.recurring?.interval === 'year'
    );

    let monthlyPriceId = monthlyPrice?.id;
    let yearlyPriceId = yearlyPrice?.id;

    // Create monthly price if it doesn't exist
    if (!monthlyPriceId) {
      const newMonthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: STRIPE_CONFIG.prices.monthly.amount,
        currency: 'usd',
        recurring: {
          interval: STRIPE_CONFIG.prices.monthly.interval,
        },
        metadata: {
          period: 'monthly',
        },
      });
      monthlyPriceId = newMonthlyPrice.id;
      console.log('Created monthly price:', monthlyPriceId);
    } else {
      console.log('Monthly price already exists:', monthlyPriceId);
    }

    // Create yearly price if it doesn't exist
    if (!yearlyPriceId) {
      const newYearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: STRIPE_CONFIG.prices.yearly.amount,
        currency: 'usd',
        recurring: {
          interval: STRIPE_CONFIG.prices.yearly.interval,
        },
        metadata: {
          period: 'yearly',
        },
      });
      yearlyPriceId = newYearlyPrice.id;
      console.log('Created yearly price:', yearlyPriceId);
    } else {
      console.log('Yearly price already exists:', yearlyPriceId);
    }

    return NextResponse.json({
      success: true,
      productId: product.id,
      prices: {
        monthly: monthlyPriceId,
        yearly: yearlyPriceId,
      },
      message: 'Add these price IDs to your .env.local file as STRIPE_PRICE_MONTHLY and STRIPE_PRICE_YEARLY',
    });
  } catch (error) {
    console.error('Error setting up Stripe:', error);
    return NextResponse.json(
      { error: 'Failed to setup Stripe products' },
      { status: 500 }
    );
  }
}

// GET for checking current setup
export async function GET() {
  try {
    const products = await stripe.products.list({ limit: 10 });
    const raiderProProduct = products.data.find(p => p.name === STRIPE_CONFIG.productName);

    if (!raiderProProduct) {
      return NextResponse.json({
        setup: false,
        message: 'Product not created yet. POST to this endpoint to create.',
      });
    }

    const prices = await stripe.prices.list({
      product: raiderProProduct.id,
      active: true,
    });

    return NextResponse.json({
      setup: true,
      productId: raiderProProduct.id,
      productName: raiderProProduct.name,
      prices: prices.data.map(p => ({
        id: p.id,
        amount: p.unit_amount,
        currency: p.currency,
        interval: p.recurring?.interval,
      })),
    });
  } catch (error) {
    console.error('Error checking Stripe setup:', error);
    return NextResponse.json(
      { error: 'Failed to check Stripe setup' },
      { status: 500 }
    );
  }
}
