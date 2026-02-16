import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">🎬 Кинотеатр Онлайн</p>
          <p className="text-gray-400">© 2026 Все права защищены</p>
          <p className="text-gray-400 mt-2">Бронируйте билеты онлайн в любое время</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;