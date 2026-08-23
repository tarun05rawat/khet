import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN || "khet-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_PROJECTID || "khet-demo",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "khet-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_APP_ID || "1:1234567890:web:khetdemo",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
