import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDu42fVseRws-Ce8cxqv98VhzPHtb5HVfo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "health-agent-7079a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "health-agent-7079a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "health-agent-7079a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "814808574323",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:814808574323:web:d123c8b4086a3f6225bd06",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VX34Y1VXLD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
