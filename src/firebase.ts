// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDY7fkRA6auW1jbwPh5YLtGp38SNeirIKw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gymrat-club-04.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gymrat-club-04",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gymrat-club-04.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "42427574808",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:42427574808:web:2d46672790733614bf316d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CR9P9C9C2R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom parameters for clean Google account prompt
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics conditionally
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}
