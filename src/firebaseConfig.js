// Import Firebase SDK (modular version)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (Replace with your actual keys if needed)
const firebaseConfig = {
  apiKey: "AIzaSyDtueNXkYoEuoXg4nK3vSImh1NI1BmzOLQ",
  authDomain: "ai-human-2c1e7.firebaseapp.com",
  projectId: "ai-human-2c1e7",
  storageBucket: "ai-human-2c1e7.appspot.com",  // Fixed storageBucket URL
  messagingSenderId: "362584359441",
  appId: "1:362584359441:web:7d5bf42859c5e1679167b0",
  measurementId: "G-DS41Q4B277",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
