import React, { useEffect, useState } from 'react';
import type { Film } from '../types/film';
import MovieList from '../components/MovieList';
import { fetchFilms } from '../data/mockData';
import { extractListFromResponse, normalizeFilms } from '../utils/dataNormalizer';
import { apiJson } from '../utils/api';
import { FREEPIK_IMAGES } from '../utilses/imageUtils'; 

const HomePage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const data = await apiJson('/api/movies/');
        const list = extractListFromResponse(data);
        const normalized = normalizeFilms(list);

        if (normalized.length > 0) {
          setFilms(normalized);
          setError(null);
        } else {
          const mock = await fetchFilms();
          setFilms(Array.isArray(mock) ? mock : []);
          setError('Не удалось загрузить фильмы через API. Показаны мок-данные.');
        }
      } catch {
        try {
          const mock = await fetchFilms();
          setFilms(Array.isArray(mock) ? mock : []);
          setError('Не удалось загрузить фильмы через API. Показаны мок-данные.');
        } catch {
          setFilms([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section
        className="relative rounded-lg overflow-hidden shadow-lg mb-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${FREEPIK_IMAGES.NIGHT.BACKGROUND})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '350px'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-2xl text-white">
            <img
              src={FREEPIK_IMAGES.NIGHT.POSTER}
              alt="Постер кинотеатра"
              className="mx-auto mb-4 w-40 rounded-lg shadow-lg"
            />
            <h1 className="text-2xl md:text-4xl font-bold mb-2">🎬 Добро пожаловать в наш кинотеатр</h1>
            <p className="mb-4 text-lg">Смотрите лучшие фильмы и бронируйте билеты онлайн</p>
            <a
              href="/films"
              className="inline-block bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md text-white font-semibold"
            >
              Смотреть фильмы
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3">
            {error}
          </div>
        )}
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <MovieList films={films} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;