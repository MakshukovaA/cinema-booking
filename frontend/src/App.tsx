import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FilmsPage from './pages/FilmsPage';
import BookingPage from './pages/BookingPage';
import FilmPage from './pages/FilmPage'; 
import SessionListPage from './pages/SessionListPage'; 
import LoginForm from './components/LoginForm';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/films" element={<FilmsPage />} />
          <Route path="/sessions/:filmId" element={<SessionListPage />} /> 
          <Route path="/film/:id" element={<FilmPage />} />
          <Route path="/booking/:sessionId" element={<BookingPage />} />
        </Route>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;