import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
  databaseURL: import.meta.env.VITE_FIREBASE_REALTIME_DATABASE_URL as string,
};

// Firebase 초기화
const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics | undefined = getAnalytics(app);

// FireStore DB 초기화
const fireStoreDB = getFirestore(app);

// RealTime DB 초기화
const realTimeDB = getDatabase(app);

export { app, analytics, fireStoreDB, realTimeDB };
