import React from 'react';

const BookCard = ({ book, onUpdate, onDelete }) => {
  // --- NEW: Helper function to get color classes based on status ---
  const getStatusStyles = (status) => {
    switch (status) {
      case "Read":
        return "bg-green-100 text-green-800 border-green-200";
      case "Reading":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default: // "To Read"
        return "bg-gray-200 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="bg-slate-700 rounded-2xl shadow-lg flex flex-col transition-transform transform hover:-translate-y-1">
      <img 
        src={book.coverImage || 'https://placehold.co/200x300?text=No+Cover'} 
        alt={`Cover of ${book.title}`} 
        className="w-full h-48 object-cover rounded-t-2xl"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/e2e8f0/334155?text=No+Cover'; }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-md text-white truncate">{book.title}</h3>
        <p className="text-sm text-slate-400 mb-3">{book.author}</p>
        
        <div className="mt-auto">
          {/* --- UPDATED: Styled select dropdown --- */}
          <select
            value={book.status}
            onChange={(e) => onUpdate(book._id, { status: e.target.value })}
            // The getStatusStyles function dynamically changes the color here
            className={`w-full px-2 py-1 border rounded-md text-sm font-semibold text-center appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 ${getStatusStyles(book.status)}`}
          >
            <option value="To Read">To Read</option>
            <option value="Reading">Reading</option>
            <option value="Read">Read</option>
          </select>
          <button
            onClick={() => onDelete(book._id)}
            className="mt-2 w-full text-center text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;