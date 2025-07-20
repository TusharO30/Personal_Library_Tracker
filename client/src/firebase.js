import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3PI6qZTPZjE-KOdbrv6YqCjxCaUZB6jw",
  authDomain: "personal-library-tracker-2.firebaseapp.com",
  projectId: "personal-library-tracker-2",
  storageBucket: "personal-library-tracker-2.firebasestorage.app",
  messagingSenderId: "896286890861",
  appId: "1:896286890861:web:0e082b32cbbb5cc9f7d864",
  measurementId: "G-NGKXQL4BJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);