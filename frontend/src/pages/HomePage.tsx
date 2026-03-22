import React, { useEffect, useState } from 'react';
import type { Film } from '../types/film';
import MovieList from '../components/MovieList';
import { fetchFilms } from '../data/mockData';
import { extractListFromResponse, normalizeFilms } from '../utils/dataNormalizer';
import { apiJson } from '../utils/api';

const HomePage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const data: any = await apiJson('/movies/');
        const list = extractListFromResponse(data);
        const normalized = normalizeFilms(list);

        if (normalized.length > 0) {
          setFilms(normalized);
        } else {
          const mock = await fetchFilms();
          if (Array.isArray(mock)) {
            setFilms(mock);
            setError('Не удалось загрузить фильмы через API. Показаны мок-данные.');
          } else {
            setFilms([]);
          }
        }
      } catch (err) {
        console.error('Error loading films from API:', err);

        try {
          const mock = await fetchFilms();
          if (Array.isArray(mock)) {
            setFilms(mock);
            setError('Не удалось загрузить фильмы через API. Показаны мок-данные.');
          } else {
            setFilms([]);
          }
        } catch {
          setError('Не удалось загрузить фильмы.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFromApi();
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

  if (error && films.length === 0) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3">
            {error}
          </div>
        )}
        <MovieList films={films} />
      </div>
    </div>
  );
};

export default HomePage;