// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import FilmPage from './pages/FilmPage';
import BookingPage from './pages/BookingPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}> {/* Основной шаблон с Header/Footer */}
          <Route index element={<HomePage />} /> {/* Главная */}
          <Route path="/film/:filmId" element={<FilmPage />} /> {/* Страница фильма */}
          <Route path="/booking/:sessionId" element={<BookingPage />} /> {/* Бронирование */}
          {/* Добавьте другие маршруты здесь */}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);