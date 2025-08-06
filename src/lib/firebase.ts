
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "***REMOVED***",
  appId: "1:***REMOVED***:web:27e0f32ccb52438751253b",
  storageBucket: "***REMOVED***.firebasestorage.app",
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***.firebaseapp.com",
  messagingSenderId: "***REMOVED***",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
