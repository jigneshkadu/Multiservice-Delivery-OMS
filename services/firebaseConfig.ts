
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOUKkKTNvx67VmI3kxG3UFJ3dIfI37ZeQ",
  authDomain: "mydahanu-d01f5.firebaseapp.com",
  projectId: "mydahanu-d01f5",
  storageBucket: "mydahanu-d01f5.firebasestorage.app",
  messagingSenderId: "444935418464",
  appId: "1:444935418464:web:d5941c9e38bac35b5fc905",
  measurementId: "G-PFBMB19LFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');
export const appleProvider = new OAuthProvider('apple.com');

export default app;
