import React from 'react';
import { Link } from 'react-router-dom';
import { Book, BookOpen, Star, ArrowLeft } from 'lucide-react';

const ProfilePage = ({ user, books }) => {
  // Calculate stats from the books array
  const stats = {
    total: books.length,
    read: books.filter((b) => b.status === 'Read').length,
    reading: books.filter((b) => b.status === 'Reading').length,
    pagesRead: books.filter((b) => b.status === 'Read').reduce((sum, book) => sum + (book.pages || 0), 0),
  };

  return (
    <div className="min-h-screen bg-slate-800 text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8">
          <ArrowLeft size={16} />
          Back to Library
        </Link>

        {/* Profile Header */}
        <div className="flex items-center gap-6 p-6 bg-slate-700 rounded-2xl shadow-lg">
          <img src={user.photoURL || 'https://placehold.co/100x100'} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-600" />
          <div>
            <h1 className="text-3xl font-bold text-white">{user.displayName}</h1>
            <p className="text-slate-400">{user.email}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="my-8">
          <h2 className="text-2xl font-bold text-white mb-4">Lifetime Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Books" value={stats.total} icon={<Book />} />
            <StatCard title="Books Read" value={stats.read} icon={<BookOpen />} />
            <StatCard title="Currently Reading" value={stats.reading} icon={<BookOpen />} />
            <StatCard title="Pages Read" value={stats.pagesRead.toLocaleString()} icon={<Star />} />
          </div>
        </div>
      </div>
    </div>
  );
};

// A small helper component for the stat cards
const StatCard = ({ title, value, icon }) => (
  <div className="bg-slate-700 p-4 rounded-lg shadow">
    <div className="flex flex-row items-center justify-between pb-2">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <div className="text-slate-500">{icon}</div>
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
  </div>
);

export default ProfilePage;