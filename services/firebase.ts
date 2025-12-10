import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "mock_key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mock_domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mock_project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mock_bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID || "mock_sender",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "mock_app_id"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);