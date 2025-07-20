import React from 'react';
import axios from 'axios';
// --- CHANGED: Import signInWithRedirect instead of signInWithPopup ---
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Book } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // --- CHANGED: Use signInWithRedirect ---
      // This will navigate the user away and then back to your app
      await signInWithRedirect(auth, provider);
      
      // Note: The rest of the logic (sending the token to your backend)
      // is now handled by the onAuthStateChanged listener in your App.js
      // when the user is redirected back to your site.
      
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Sign-in failed. Please check the console for details.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-indigo-200">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-sm w-full animate-fade-in">
        <Book className="mx-auto h-12 w-12 text-indigo-600" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Personal Library</h1>
        <p className="mt-2 text-md text-gray-600">
          Sign in to track your book collection.
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        >
          {/* ... (SVG icon) ... */}
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;