// Import the functions from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase configuration
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

// Set persistence to LOCAL to keep the user signed in
setPersistence(auth, browserLocalPersistence);

// Initialize Microsoft Auth Provider
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: "select_account"
});

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export const signInWithMicrosoft = async () => {
  try {
    console.log("Starting Microsoft sign in...");
    const result = await signInWithPopup(auth, microsoftProvider);
    
    // Verify the email domain
    const email = result.user.email;
    console.log("Sign in email:", email);
    
    if (!email?.endsWith('@queensu.ca')) {
      console.log("Invalid email domain, signing out");
      await auth.signOut();
      throw new Error('Please use your Queen\'s University email to sign in.');
    }
    
    console.log("Sign in successful:", result);
    return result;
  } catch (error: any) {
    console.error("Detailed sign in error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
    
    // Provide more user-friendly error messages
    let errorMessage = "Failed to sign in. Please try again.";
    if (error.code === 'auth/popup-blocked') {
      errorMessage = "Please allow popups for this website to sign in.";
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign in was cancelled. Please try again.";
    } else if (error.code === 'auth/internal-error') {
      errorMessage = "There was an issue with Microsoft authentication. Please try again or contact support if the issue persists.";
    } else if (error.message?.includes('Queen\'s University email')) {
      errorMessage = error.message;
    }
    
    error.userMessage = errorMessage;
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google sign in...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Sign in successful:", result);
    console.log("User UID:", result.user.uid);

    // Store user data in Firestore
    const userDocRef = doc(db, "users", result.user.uid);
    console.log("Creating/updating user document at:", userDocRef.path);
    
    await setDoc(
      userDocRef,
      {
        email: result.user.email,
        createdAt: new Date().toISOString(),
        tamBalance: 200, // Initial TAM balance
      },
      { merge: true }
    );

    // Verify the document was created
    const userDoc = await getDoc(userDocRef);
    console.log("User document exists:", userDoc.exists());
    console.log("User document data:", userDoc.data());

    // Initialize local storage
    localStorage.setItem("tamBalance", "200");

    return result;
  } catch (error: any) {
    console.error("Detailed sign in error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
    
    // Provide more user-friendly error messages
    let errorMessage = "Failed to sign in. Please try again.";
    if (error.code === 'auth/popup-blocked') {
      errorMessage = "Please allow popups for this website to sign in.";
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign in was cancelled. Please try again.";
    } else if (error.code === 'auth/internal-error') {
      errorMessage = "There was an issue with Google authentication. Please try again or contact support if the issue persists.";
    }
    
    error.userMessage = errorMessage;
    throw error;
  }
};

export const db = getFirestore(app); 