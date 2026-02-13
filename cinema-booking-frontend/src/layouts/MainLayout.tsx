// src/layouts/MainLayout.tsx (или просто в layouts/)
import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet нужен для вложенных маршрутов
import Header from './Header'; // Убедитесь, что путь верный
import Footer from './Footer'; // Убедитесь, что путь верный

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {/* Outlet будет рендерить HomePage, FilmPage и т.д. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;