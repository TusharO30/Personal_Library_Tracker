import React from 'react';

const SearchResultCard = ({ book, onAdd }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center">
    <img 
      src={book.volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/128x192?text=No+Cover'} 
      alt={`Cover of ${book.volumeInfo.title}`} 
      className="w-full h-48 object-cover"
    />
    <div className="p-3 flex flex-col flex-grow">
      <h4 className="font-semibold text-sm text-gray-800 truncate">{book.volumeInfo.title}</h4>
      <p className="text-xs text-gray-500 mb-2 truncate">{book.volumeInfo.authors?.join(', ')}</p>
      <button
        onClick={() => onAdd(book)}
        className="mt-auto w-full px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
      >
        Add to Library
      </button>
    </div>
  </div>
);

export default SearchResultCard;