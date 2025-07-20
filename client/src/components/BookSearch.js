import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup, Image, Row, Col } from 'react-bootstrap';

// IMPORTANT: Replace with your actual API key from the Google Cloud Console
const API_KEY = 'AIzaSyCAGoDo4tbzrib8IlCUA57JGmVKsY6086o';

function BookSearch({ onBookSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`);
      setResults(response.data.items || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="mb-4">
      <Form onSubmit={handleSearch}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search for a book by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Search</Button>
          </Col>
        </Row>
      </Form>

      {error && <p className="text-danger mt-2">{error}</p>}

      {results.length > 0 && (
        <ListGroup className="mt-3">
          {results.map(book => (
            <ListGroup.Item
              key={book.id}
              action
              onClick={() => {
                onBookSelect(book.volumeInfo); // Pass selected book data up to the parent
                setResults([]); // Clear results after selection
                setQuery(''); // Clear search query
              }}
              className="d-flex align-items-center"
            >
              <Image
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt="cover"
                style={{ height: '50px', marginRight: '15px' }}
              />
              <div>
                <strong>{book.volumeInfo.title}</strong>
                <div className="text-muted">{book.volumeInfo.authors?.join(', ')}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default BookSearch;