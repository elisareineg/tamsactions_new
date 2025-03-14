// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, OAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1R5U_kzA4Q3SnuF_osIrKjvOwbUYCwDE",
  authDomain: "tamsactions.firebaseapp.com",
  projectId: "tamsactions",
  storageBucket: "tamsactions.firebasestorage.app",
  messagingSenderId: "542400737671",
  appId: "1:542400737671:web:ad206ffd1642ffd9006322",
  measurementId: "G-TSY2H97JXL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Microsoft Auth Provider
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: "select_account",
  tenant: "consumers",
  redirect_uri: 'https://tamsactions.firebaseapp.com/__/auth/handler'
});

export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return result;
  } catch (error) {
    throw error;
  }
};

export const db = getFirestore(app);