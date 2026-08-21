import admin from 'firebase-admin';
import { env } from './env';
import { logger } from '../utils/logger';

let initialized = false;

export const RTDB_URL = 'https://medmatch-ai-dbd96-default-rtdb.asia-southeast1.firebasedatabase.app';

export function initializeFirebase(): admin.app.App {
  if (initialized && admin.apps.length > 0) {
    return admin.app();
  }

  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_DATABASE_URL,
    FIREBASE_DATABASE_EMULATOR_HOST,
    FIREBASE_AUTH_EMULATOR_HOST
  } = env;

  const databaseURL = FIREBASE_DATABASE_URL || RTDB_URL;

  // Format private key correctly if escaped newlines are present
  const formattedPrivateKey = FIREBASE_PRIVATE_KEY
    ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const isEmulatorMode = Boolean(FIREBASE_DATABASE_EMULATOR_HOST || FIREBASE_AUTH_EMULATOR_HOST);

  try {
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && formattedPrivateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: formattedPrivateKey
        }),
        projectId: FIREBASE_PROJECT_ID,
        databaseURL
      });
      logger.info('Firebase Admin SDK initialized with Service Account Credentials & Realtime Database', { databaseURL });
    } else if (isEmulatorMode) {
      admin.initializeApp({
        projectId: FIREBASE_PROJECT_ID || 'medmatch-ai-emulator',
        databaseURL
      });
      logger.info('Firebase Admin SDK initialized in EMULATOR mode', {
        databaseURL,
        authHost: FIREBASE_AUTH_EMULATOR_HOST
      });
    } else {
      // Local fallback configuration with exact Realtime Database URL
      admin.initializeApp({
        projectId: FIREBASE_PROJECT_ID || 'medmatch-ai-dbd96',
        databaseURL
      });
      logger.info('Firebase Admin SDK initialized with Realtime Database URL', { databaseURL });
    }

    initialized = true;
  } catch (error) {
    if (admin.apps.length > 0) {
      return admin.app();
    }
    logger.error('Failed to initialize Firebase Admin SDK', error);
    throw error;
  }

  return admin.app();
}

// Auto-initialize on import
export const firebaseApp = initializeFirebase();
export const rtdb = admin.database();
export const db = rtdb;
export const auth = admin.auth();

export const hasDatabaseCredentials = Boolean(
  !env.DEMO_MODE &&
  ((env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY && !env.FIREBASE_PRIVATE_KEY.includes('...')) ||
  env.FIREBASE_DATABASE_EMULATOR_HOST)
);
