import React, { useEffect, useState } from 'react';
import ApiClient from '../api';
import type { Film } from '../types/film';
import MovieList from '../components/MovieList';
import { fetchFilms } from '../data/mockData';

const HomePage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const api = new ApiClient();
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? undefined : undefined;

  const loadFromApi = async () => {
    try {
      const data: any = await api.get<Film[]>('/movies', token);
      const list: Film[] = Array.isArray(data) ? data : [];
      if (list.length === 0) {
        const mock = await fetchFilms();
        setFilms(mock);
        setError('Не удалось загрузить фильмы через API. Показаны мок-данные.');
      } else {
        setFilms(list as Film[]);
      }
    } catch (err) {
      console.error('Error loading films from API:', err);
      try {
        const mock = await fetchFilms();
        setFilms(mock);
        setError('Не удалось загрузить фильмы через API. Показаны мок-данные.');
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
        <MovieList films={films} />
      </div>
    </div>
  );
};

export default HomePage;