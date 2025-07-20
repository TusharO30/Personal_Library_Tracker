import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// This line makes your app use the live backend URL when deployed
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] =useState(localStorage.getItem('token'));
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // If there's a Firebase user but we don't have our backend token yet, get one.
        if (!localStorage.getItem('token')) {
          const idToken = await currentUser.getIdToken();
          try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/google`, { idToken });
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            setToken(newToken);
          } catch (error) {
            console.error("Failed to exchange token with backend", error);
          }
        }
      } else {
        // User logged out
        setUser(null);
        localStorage.removeItem('token');
        setToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const fetchBooks = async (jwtToken) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`, { headers: { 'x-auth-token': jwtToken } });
      setBooks(res.data);
    } catch (err) { console.error("Failed to fetch books:", err); }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && user) {
      setToken(storedToken);
      fetchBooks(storedToken);
    }
  }, [user]);

  const handleLogout = () => {
    auth.signOut(); // This will trigger onAuthStateChanged to clear user and token
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