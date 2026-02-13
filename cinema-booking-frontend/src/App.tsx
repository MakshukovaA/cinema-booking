import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import FilmPage from './pages/FilmPage';
import BookingPage from './pages/BookingPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Можно добавить общий Header или Layout */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/film/:id" element={<FilmPage />} />
            <Route path="/booking/:sessionId" element={<BookingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;