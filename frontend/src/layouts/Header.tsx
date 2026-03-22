import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200">
            🎬 Кинотеатр Онлайн
          </Link>
          <div className="space-x-6">
            <Link to="/" className="hover:text-blue-200 font-medium">Главная</Link>
            <Link to="/films" className="hover:text-blue-200 font-medium">Фильмы</Link>
            <Link to="/booking" className="hover:text-blue-200 font-medium">Забронировать</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;