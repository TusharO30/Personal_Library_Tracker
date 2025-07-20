import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'; // <-- Import new page

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // If firebase auth state is lost, clear our token too
        localStorage.removeItem('token');
        setToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchBooks = async (jwtToken) => {
    try {
      const res = await axios.get('http://localhost:5000/api/books', { headers: { 'x-auth-token': jwtToken } });
      setBooks(res.data);
    } catch (err) { console.error("Failed to fetch books:", err); }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && user) {
      setToken(storedToken);
      fetchBooks(storedToken);
    }
  }, [user]); // Fetch books when user logs in

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    auth.signOut(); // Also sign out from Firebase
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      {token && user ? (
        <Routes>
          <Route path="/" element={<DashboardPage user={user} books={books} onLogout={handleLogout} fetchBooks={fetchBooks} />} />
          <Route path="/profile" element={<ProfilePage user={user} books={books} />} />
        </Routes>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </Router>
  );
}

export default App;