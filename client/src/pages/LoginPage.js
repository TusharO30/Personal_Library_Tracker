import React from 'react';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Book } from 'lucide-react';

const LoginPage = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
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
          <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C322.3 121.3 287.4 96 248 96c-88.8 0-160.1 71.1-160.1 160s71.3 160 160.1 160c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.8z"></path></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;