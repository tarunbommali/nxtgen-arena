import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyATRTsjVNYrtoc3whqxFOzw3L1UaEBqNCU",
    authDomain: "daysfoundation-2f204.firebaseapp.com",
    projectId: "daysfoundation-2f204",
    storageBucket: "daysfoundation-2f204.firebasestorage.app",
    messagingSenderId: "240249283605",
    appId: "1:240249283605:web:4e20efc6780fd5d17fda1c",
    measurementId: "G-TZ24213HQW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
