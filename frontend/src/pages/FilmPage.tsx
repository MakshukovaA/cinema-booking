import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import { fetchFilms } from '../services/apiFilms';
import type { Film } from '../types/film';

const FilmsPage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchFilms();
        setFilms(data);
      } catch (err) {
        setError('Не удалось загрузить фильмы. Проверьте подключение к серверу.');
        console.error('Films loading error:', err);
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
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Ошибка</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">🎞 Все фильмы</h1>
        {films.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Фильмы не найдены
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <MovieList films={films} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmsPage;