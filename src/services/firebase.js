import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// STEP 2 OF SETUP: replace every value below with your real Firebase
// config. Find it in the Firebase console under:
// Project settings (gear icon) > General tab > "Your apps" > SDK setup and configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD0soL3kpsdIBbjnpFrC3a9TDCJMUlVGwg',
  authDomain: 'elderlynk-d1b43.firebaseapp.com',
  projectId: 'elderlynk-d1b43',
  storageBucket: 'elderlynk-d1b43.firebasestorage.app',
  messagingSenderId: '491200355877',
  appId: '1:491200355877:web:11ad86c55a1ebae9d029cc',
};

const app = initializeApp(firebaseConfig);

// initializeAuth (instead of the simpler getAuth) is required in React
// Native so a logged-in user stays logged in after closing the app.
// Without this, Firebase would silently fall back to memory-only
// storage and everyone would get logged out every time they reopened it.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
