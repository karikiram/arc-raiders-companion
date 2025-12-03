import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let adminDb: Firestore | undefined;
let initialized = false;

function getFirebaseAdmin() {
  if (initialized) {
    return { app, adminDb };
  }

  if (!app && getApps().length === 0) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set');
      throw new Error('Firebase Admin SDK not configured: missing service account key');
    }

    const serviceAccount = JSON.parse(serviceAccountKey);
    console.log('Initializing Firebase Admin with project:', serviceAccount.project_id);

    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } else if (getApps().length > 0) {
    app = getApps()[0];
  }

  if (!adminDb && app) {
    adminDb = getFirestore(app);
  }

  initialized = true;
  return { app, adminDb };
}

export const { adminDb: db } = getFirebaseAdmin();

// Helper to get Firestore with lazy initialization
export function getAdminDb(): Firestore {
  const { adminDb } = getFirebaseAdmin();
  if (!adminDb) {
    throw new Error('Firebase Admin Firestore not initialized');
  }
  return adminDb;
}

// Subscription document structure in Firestore
export interface SubscriptionDocument {
  oderId: string;
  oderstatus: 'active' | 'canceled' | 'past_due' | 'trialing' | 'none';
  tier: 'free' | 'pro';
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  period: 'monthly' | 'yearly' | null;
  currentPeriodStart: FirebaseFirestore.Timestamp | null;
  currentPeriodEnd: FirebaseFirestore.Timestamp | null;
  cancelAtPeriodEnd: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

// User document structure
export interface UserDocument {
  oderId: string;
  email: string;
  displayName: string;
  stripeCustomerId?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
