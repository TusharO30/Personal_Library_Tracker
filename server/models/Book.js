const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: {
    type: String,
    enum: ['To Read', 'Reading', 'Read'],
    required: true,
  },
  coverImage: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // --- NEW FIELDS ---
  genre: { type: String, default: 'Uncategorized' },
  pages: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  notes: { type: String, default: '' },
  dateAdded: { type: Date, default: Date.now },
  dateRead: { type: Date },
});

module.exports = mongoose.model('Book', BookSchema);