// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
    },
    status: {
        type: String,
        enum: ['To Read', 'Reading', 'Read'],
        default: 'To Read',
    },
    coverImage: {
        type: String, // URL to the image
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Book', bookSchema);