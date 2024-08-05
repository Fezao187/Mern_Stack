// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    authDomain: "spotify-api-app-4e4c4.firebaseapp.com",
    projectId: "spotify-api-app-4e4c4",
    storageBucket: "spotify-api-app-4e4c4.appspot.com",
    messagingSenderId: "997138643364",
    appId: "1:997138643364:web:5968f4d860000c90bb6931",
    measurementId: "G-PMBBRE20YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;
