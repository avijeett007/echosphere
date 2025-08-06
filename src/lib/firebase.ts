
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "***REMOVED***",
  appId: "1:***REMOVED***:web:27e0f32ccb52438751253b",
  storageBucket: "***REMOVED***.appspot.com",
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***.firebaseapp.com",
  messagingSenderId: "***REMOVED***",
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
