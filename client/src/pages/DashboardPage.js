import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import SearchResultCard from '../components/SearchResultCard';
import BookCard from '../components/BookCard';
import FilterTabs from '../components/FilterTabs';

const API_KEY = 'YOUR_GOOGLE_BOOKS_API_KEY_HERE';

const DashboardPage = ({ user, onLogout }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [googleSearchTerm, setGoogleSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const getToken = () => localStorage.getItem('token');

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
  }, []);

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
        
        <div className="my-8 p-6 bg-slate-700 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Find and Add a New Book</h2>
          <form onSubmit={handleGoogleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={googleSearchTerm}
              onChange={(e) => setGoogleSearchTerm(e.target.value)}
              placeholder="Search Google Books by title or author..."
              className="flex-grow px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
            />
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
              Search
            </button>
          </form>
        </div>

        {searchResults.length > 0 && (
          <div className="my-8">
            <h3 className="text-xl font-bold text-white mb-4">Search Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {searchResults.map(book => (
                <SearchResultCard key={book.id} book={book} onAdd={addBookToLibrary} />
              ))}
            </div>
          </div>
        )}
        
        <div className="my-8 p-6 bg-slate-700 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white">My Library</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <input
                    type="text"
                    value={librarySearchTerm}
                    onChange={(e) => setLibrarySearchTerm(e.target.value)}
                    placeholder="Filter by title/author..."
                    className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg w-full sm:w-auto text-white"
                />
                <FilterTabs currentFilter={statusFilter} setFilter={setStatusFilter} />
            </div>
          </div>
          {loading ? <p>Loading...</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredBooks.map(book => (
                      <BookCard key={book._id} book={book} onUpdate={updateBook} onDelete={deleteBook} />
                  ))}
              </div>
          )}
          {!loading && books.length > 0 && filteredBooks.length === 0 && (
              <div className="text-center text-slate-400 py-10">
                  <p>No books match your current filters.</p>
              </div>
          )}
           {!loading && books.length === 0 && (
              <div className="text-center text-slate-400 py-10">
                  <p>Your library is empty. Try searching for a book to add!</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;