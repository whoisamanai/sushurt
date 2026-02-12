import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

type FirebaseEnvKey =
  | 'VITE_FIREBASE_API_KEY'
  | 'VITE_FIREBASE_AUTH_DOMAIN'
  | 'VITE_FIREBASE_PROJECT_ID'
  | 'VITE_FIREBASE_STORAGE_BUCKET'
  | 'VITE_FIREBASE_MESSAGING_SENDER_ID'
  | 'VITE_FIREBASE_APP_ID';

function getEnvValue(key: FirebaseEnvKey): string {
  const rawValue = import.meta.env[key];
  const value = typeof rawValue === 'string' ? rawValue.trim().replace(/^['"]|['"]$/g, '') : '';

  const placeholderValues = new Set([
    '',
    'your_api_key',
    'your_project.firebaseapp.com',
    'your_project_id',
    'your_project.appspot.com',
    'your_messaging_sender_id',
    'your_app_id'
  ]);

  if (placeholderValues.has(value)) {
    throw new Error(
      `[Firebase Config] ${key} is missing or still set to a placeholder value. ` +
        'Update your .env file with real Firebase Web App credentials from Firebase Console.'
    );
  }

  return value;
}

const firebaseConfig = {
  apiKey: getEnvValue('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvValue('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvValue('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvValue('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvValue('VITE_FIREBASE_APP_ID')
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
