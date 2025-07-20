import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import Header from '../components/Header';
import SearchResultCard from '../components/SearchResultCard';
import BookCard from '../components/BookCard';
import FilterTabs from '../components/FilterTabs';

const API_KEY = 'AIzaSyCAGoDo4tbzrib8IlCUA57JGmVKsY6086o';

const DashboardPage = ({ user, onLogout }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [googleSearchTerm, setGoogleSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const getToken = () => localStorage.getItem('token');

  // --- WRAP fetchBooks in useCallback ---
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get('http://localhost:5000/api/books', { headers: { 'x-auth-token': token } });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
    setLoading(false);
  }, []); // Empty dependency array means this function is created only once

  const addBookToLibrary = async (book) => {
    const newBook = {
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
      coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
      status: 'To Read',
      genre: book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'Uncategorized',
      pages: book.volumeInfo.pageCount || 0,
    };
    try {
      await axios.post('http://localhost:5000/api/books', newBook, { headers: { 'x-auth-token': getToken() } });
      setGoogleSearchTerm('');
      setSearchResults([]);
      fetchBooks();
    } catch (err) { console.error("Error adding book:", err); }
  };

  const updateBook = async (bookId, dataToUpdate) => {
    try {
      await axios.put(`http://localhost:5000/api/books/${bookId}`, dataToUpdate, { headers: { 'x-auth-token': getToken() } });
      fetchBooks();
    } catch (err) { console.error("Error updating book:", err); }
  };

  const deleteBook = async (bookId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${bookId}`, { headers: { 'x-auth-token': getToken() } });
        fetchBooks();
      } catch (err) { console.error("Error deleting book:", err); }
    }
  };

  const handleGoogleSearch = async (e) => {
    e.preventDefault();
    if (!googleSearchTerm.trim()) return;
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${googleSearchTerm}&key=${API_KEY}&maxResults=12`);
      setSearchResults(response.data.items || []);
    } catch (error) { console.error("Error searching books:", error); }
  };

  // --- ADD fetchBooks to dependency array ---
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    let booksToFilter = [...books];
    if (statusFilter !== 'All') {
      booksToFilter = booksToFilter.filter(book => book.status === statusFilter);
    }
    if (librarySearchTerm.trim() !== '') {
      const lowercasedQuery = librarySearchTerm.toLowerCase();
      booksToFilter = booksToFilter.filter(book =>
        book.title.toLowerCase().includes(lowercasedQuery) ||
        book.author.toLowerCase().includes(lowercasedQuery)
      );
    }
    setFilteredBooks(booksToFilter);
  }, [books, statusFilter, librarySearchTerm]);

  return (
    <div className="min-h-screen bg-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header user={user} onLogout={onLogout} />
        {/* ... (rest of the JSX is the same) ... */}
      </div>
    </div>
  );
};

export default DashboardPage;