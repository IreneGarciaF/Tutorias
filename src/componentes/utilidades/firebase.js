// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";  
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyByhRViycc3j-BnBaoeGLuuHiZOALwvt9U",
  authDomain: "gestion-tutorias-1.firebaseapp.com",
  projectId: "gestion-tutorias-1",
  storageBucket: "gestion-tutorias-1.appspot.com",
  messagingSenderId: "236473543753",
  appId: "1:236473543753:web:5b056d37e9a1de5864e398",
  measurementId: "G-7SKQLVESW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  
const db = getFirestore(app); 
const realtimeDb = getDatabase(app)

export { db, auth, realtimeDb, app  }; 
