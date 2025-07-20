import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async (jwtToken) => {
    if (!jwtToken) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`, { headers: { 'x-auth-token': jwtToken } });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const idToken = await firebaseUser.getIdToken();
          const res = await axios.post(`${API_BASE_URL}/api/auth/google`, { idToken });
          const backendToken = res.data.token;
          
          localStorage.setItem('token', backendToken);
          setToken(backendToken);
          await fetchBooks(backendToken);

        } catch (error) {
          console.error("Authentication with backend failed.", error);
          auth.signOut(); // Sign out if backend exchange fails
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
        setToken(null);
        setBooks([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchBooks]);

  const handleLogout = () => {
    auth.signOut();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-800 text-white">Loading...</div>;
  }

  return (
    <Router>
      {token && user ? (
        <Routes>
          <Route path="/" element={<DashboardPage user={user} books={books} onLogout={handleLogout} fetchBooks={() => fetchBooks(token)} />} />
          <Route path="/profile" element={<ProfilePage user={user} books={books} />} />
        </Routes>
      ) : (
        <LoginPage />
      )}
    </Router>
  );
}

export default App;