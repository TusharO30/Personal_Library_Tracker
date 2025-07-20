import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

// --- NEW: Define a list of genres ---
const genres = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Historical Fiction",
  "Non-Fiction",
  "Biography",
  "Classic",
];

function AddBookForm({ onBookAdded, closeModal }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('To Read');
  const [genre, setGenre] = useState(''); // State remains the same

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('status', status);
    formData.append('genre', genre || 'Uncategorized'); // Use 'Uncategorized' if none is selected

    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
    });
    onBookAdded();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Enter book title" required value={title} onChange={e => setTitle(e.target.value)} />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control type="text" placeholder="Enter author's name" required value={author} onChange={e => setAuthor(e.target.value)} />
      </Form.Group>
      
      {/* --- UPDATED: Genre field is now a dropdown --- */}
      <Form.Group className="mb-3">
        <Form.Label>Genre</Form.Label>
        <Form.Select value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="">Select a genre</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </Form.Select>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Reading Status</Form.Label>
        <Form.Select value={status} onChange={e => setStatus(e.target.value)} >
          <option className="text-black font-bold" value="To Read">To Read</option>
          <option className="text-black font-bold" value="Reading">Reading</option>
          <option className="text-black font-bold" value="Read">Read</option>
        </Form.Select>
      </Form.Group>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="outline-secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Book
          </Button>
      </div>
    </Form>
  );
}

export default AddBookForm;