import React, { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import type { Film } from '../types/film';

const HomePage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await new Promise<Film[]>((resolve) => setTimeout(() => resolve(
          [
            { 
              id: '1', 
              title: 'Интерстеллар', 
              posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
              description: 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в путешествие...', 
              duration: 169, 
              genre: 'Sci-Fi' 
            },
            { 
              id: '2', 
              title: 'Начало', 
              posterUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
              description: 'Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна...', 
              duration: 148, 
              genre: 'Sci-Fi' 
            },
            { 
              id: '3', 
              title: 'Дюна', 
              posterUrl: 'https://images.unsplash.com/photo-1595769812725-4c6564f7528b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
              description: 'Наследник знаменитого дома Атрейдесов Пол отправляется вместе с семьей на одну из самых опасных планет во Вселенной — Арракис...', 
              duration: 155, 
              genre: 'Sci-Fi' 
            },
            { 
              id: '4', 
              title: 'Темный рыцарь', 
              posterUrl: 'https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', 
              description: 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы от преступности...', 
              duration: 152, 
              genre: 'Action' 
            }
          ]
        ), 800));
        setFilms(data);
      } catch (err) {
        console.error("Error loading films:", err);
        setError('Ошибка при загрузке фильмов');
      } finally {
        setIsLoading(false);
      }
    };
    loadFilms();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Загружаем фильмы...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">⚠️</span>
          </div>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (films.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-gray-700">Фильмы пока не найдены.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎬 Кинотеатр Онлайн
            </h1>
            <p className="text-xl text-blue-100">
              Бронируйте билеты на лучшие фильмы в удобное время
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Сейчас в прокате</h2>
          <p className="text-gray-600">Выберите фильм для просмотра расписания</p>
        </div>

        <MovieList films={films} />

        {/* Info Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-2xl mb-3">📍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Удобное расположение</h3>
              <p className="text-gray-600">Центр города, рядом с метро</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="text-2xl mb-3">💺</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Комфортные кресла</h3>
              <p className="text-gray-600">Ортопедические кресла премиум-класса</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="text-2xl mb-3">🍿</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Свежие снэки</h3>
              <p className="text-gray-600">Попкорн, напитки и сладости</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;