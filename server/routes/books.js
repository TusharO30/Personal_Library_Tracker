const express = require('express');
const multer = require('multer');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Add a book (Protected)
// In server/routes/books.js
// ... (keep the other code, just replace this specific route)

// Add a book (Protected)
// In server/routes/books.js

// Add a book (Protected)
// We have removed multer (upload.single('coverImage')) from this route
// In server/routes/books.js

router.post('/', authMiddleware, async (req, res) => {
  // We've wrapped the logic in a try...catch block
  try {
    const { title, author, genre, status, pages, coverImage } = req.body;
    
    const book = new Book({
      title,
      author,
      genre,
      status,
      pages,
      coverImage,
      user: req.user.userId
    });
    
    await book.save();
    res.status(201).json(book);

  } catch (err) {
    // This will now log the detailed error to your server terminal
    console.error('SERVER ERROR:', err.message); 
    
    // Send back a more specific error response
    res.status(400).json({ msg: 'Failed to add book. Please check server logs.' }); 
  }
});
// Get all books for a user (Protected)
router.get('/', authMiddleware, async (req, res) => {
  const books = await Book.find({ user: req.user.userId });
  res.json(books);
});

// Delete a book (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  await Book.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
  res.status(204).send();
});

// Update a book (status, rating, etc.)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, rating, notes } = req.body;
    
    let book = await Book.findOne({ _id: req.params.id, user: req.user.userId });

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    // Update fields if they are provided
    if (status) book.status = status;
    if (rating) book.rating = rating;
    if (notes) book.notes = notes;
    
    // If status is changed to "Read", set the dateRead
    if (status === 'Read' && !book.dateRead) {
      book.dateRead = new Date();
    }

    await book.save();
    res.json(book);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;