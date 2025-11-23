import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; 

const Home = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); 
    const [searchResults, setSearchResults] = useState([]);
    const [editBookId, setEditBookId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        author: '',
        status: '',
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    
    const filteredBooks = books.filter(book => {
        const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const fetchBooks = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/books', {
                headers: { 'x-auth-token': token }
            });
            setBooks(res.data);
        } catch (err) {
            console.error('Error fetching books:', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;
    
        try {
            const res = await axios.get(`http://localhost:5000/api/books/search?q=${searchTerm}`);
            setSearchResults(res.data.items);
        } catch (err) {
            console.error('Error searching for books:', err);
        }
    };
    

    const handleAddBook = async (bookData) => {
        const token = localStorage.getItem('token');
        const newBook = {
            title: bookData.volumeInfo.title,
            author: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] : 'Unknown',
            genre: bookData.volumeInfo.categories ? bookData.volumeInfo.categories[0] : 'General',
            coverImage: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : null,
            status: 'To Read'
        };
    
        try {
            await axios.post('http://localhost:5000/api/books', newBook, {
                headers: { 'x-auth-token': token }
            });
            setSearchTerm('');
            setSearchResults([]);
            fetchBooks();
        } catch (err) {
            console.error('Error adding book:', err);
        }
    };

    const handleDeleteBook = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchBooks();
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    };

    const handleEditClick = (book) => {
        setEditBookId(book._id);
        setEditFormData({
            title: book.title,
            author: book.author,
            status: book.status,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/books/${editBookId}`, editFormData, {
                headers: { 'x-auth-token': token }
            });
            setEditBookId(null);
            fetchBooks();
        } catch (err) {
            console.error('Error updating book:', err);
        }
    };

    return (
        <div className="container">
            <h2>My Books</h2>
            {/* Main Search Bar for Google Books API */}
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for a book by title or author"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>

            {/* Search Results from Google Books */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    <h3>Search Results</h3>
                    <ul>
                        {searchResults.map(result => (
                            <li key={result.id}>
                                <h4>{result.volumeInfo.title}</h4>
                                <p>by {result.volumeInfo.authors ? result.volumeInfo.authors.join(', ') : 'Unknown'}</p>
                                {result.volumeInfo.imageLinks && (
                                    <img src={result.volumeInfo.imageLinks.thumbnail} alt={result.volumeInfo.title} />
                                )}
                                <button onClick={() => handleAddBook(result)}>Add to Library</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* User's Library and Filter/Search Options */}
            <div className="my-library">
                <h3>My Library</h3>
                
                {/* Filter and Search Controls */}
                <div className="filter-controls">
                    <div className="status-buttons">
                        <button onClick={() => setStatusFilter('All')} className={statusFilter === 'All' ? 'active' : ''}>All</button>
                        <button onClick={() => setStatusFilter('To Read')} className={statusFilter === 'To Read' ? 'active' : ''}>To Read</button>
                        <button onClick={() => setStatusFilter('Reading')} className={statusFilter === 'Reading' ? 'active' : ''}>Reading</button>
                        <button onClick={() => setStatusFilter('Read')} className={statusFilter === 'Read' ? 'active' : ''}>Read</button>
                    </div>
                    <input
                        type="text"
                        placeholder="Filter by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <ul>
                    {filteredBooks.map(book => (
                        <li key={book._id}>
                            {editBookId === book._id ? (
                                <form onSubmit={handleUpdateBook}>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editFormData.title}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="text"
                                        name="author"
                                        value={editFormData.author}
                                        onChange={handleEditChange}
                                    />
                                    <select
                                        name="status"
                                        value={editFormData.status}
                                        onChange={handleEditChange}
                                    >
                                        <option value="To Read">To Read</option>
                                        <option value="Reading">Reading</option>
                                        <option value="Read">Read</option>
                                    </select>
                                    <button type="submit">Save</button>
                                    <button onClick={() => setEditBookId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <>
                                    {book.coverImage && <img src={book.coverImage} alt={book.title} />}
                                    <h4>{book.title}</h4>
                                    <p>by {book.author}</p>
                                    <p>Status: {book.status}</p>
                                    <div className="book-actions">
                                        <button className="edit-button" onClick={() => handleEditClick(book)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;