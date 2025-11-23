const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios for making external API calls
const auth = require('../middleware/auth');
const Book = require('../models/Book');

// @route   POST /api/books
// @desc    Add a new book
router.post('/', auth, async (req, res) => {
    const { title, author, genre, status, coverImage } = req.body;
    try {
        const newBook = new Book({
            user: req.user.id,
            title,
            author,
            genre,
            status,
            coverImage,
        });
        const book = await newBook.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/books
// @desc    Get all books for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/books/search
// @desc    Search for a book using Google Books API
router.get('/search', async (req, res) => {
    const { q } = req.query; // 'q' is the search term
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    if (!q) {
        return res.status(400).json({ msg: 'Please provide a search query' });
    }

    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${apiKey}`
        );
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT /api/books/:id
// @desc    Update a book
router.put('/:id', auth, async (req, res) => {
    const { title, author, genre, status, coverImage } = req.body;

    // Build book object
    const bookFields = {};
    if (title) bookFields.title = title;
    if (author) bookFields.author = author;
    if (genre) bookFields.genre = genre;
    if (status) bookFields.status = status;
    if (coverImage) bookFields.coverImage = coverImage;

    try {
        let book = await Book.findById(req.params.id);

        if (!book) return res.status(404).json({ msg: 'Book not found' });

        // Make sure user owns the book
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: bookFields },
            { new: true }
        );

        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
router.delete('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) return res.status(404).json({ msg: 'Book not found' });

        // Make sure user owns the book
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Book.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;