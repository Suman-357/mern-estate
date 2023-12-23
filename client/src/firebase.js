// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ded05.firebaseapp.com",
  projectId: "mern-estate-ded05",
  storageBucket: "mern-estate-ded05.appspot.com",
  messagingSenderId: "650128316450",
  appId: "1:650128316450:web:01f2d57c7a30e76a5e527b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);