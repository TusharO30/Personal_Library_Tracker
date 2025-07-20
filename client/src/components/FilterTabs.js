import React from 'react';

const FilterTabs = ({ currentFilter, setFilter }) => {
  const statuses = ['All', 'To Read', 'Reading', 'Read'];
  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
      {statuses.map(status => (
        <button
          key={status}
          onClick={() => setFilter(status)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            currentFilter === status 
              ? 'bg-white text-indigo-600 shadow' 
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;