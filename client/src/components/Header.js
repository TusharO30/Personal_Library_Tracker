import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

// Header now receives the `user` object to display the profile picture
const Header = ({ user, onLogout }) => (
  <header className="flex justify-between items-center pb-4 border-b border-gray-600">
    {/* The logo is now a link back to the dashboard */}
    <Link to="/" className="flex items-center gap-3 text-white hover:text-gray-300 no-underline">
      <Book className="h-8 w-8 text-indigo-400" />
      <h1 className="text-2xl sm:text-3xl font-bold">My Library</h1>
    </Link>
    <div className="flex items-center gap-4">
      {/* The profile picture is now a link to the profile page */}
      <Link to="/profile">
        <img src={user?.photoURL} alt="profile" className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-indigo-400" />
      </Link>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-red-600"
      >
        Sign out
      </button>
    </div>
  </header>
);

export default Header;