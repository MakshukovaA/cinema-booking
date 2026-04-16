import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Film } from '../types/film';
import { fetchFilmById } from '../services/apiFilms';
import FilmDetails from '../components/FilmDetails';

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchFilmById(id);
        if (isMounted) setFilm(data);
      } catch (e) {
        if (isMounted) setError('Не удалось загрузить данные фильма.');
        // eslint-disable-next-line no-console
        console.error('FilmPage load error:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Загружаем данные фильма...</p>
        </div>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Ошибка</h2>
          <p className="text-red-600 mb-4">{error ?? 'Фильм не найден.'}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">На главную</Link>
            <Link to="/films" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">К списку фильмов</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/films" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          ← Назад к списку
        </Link>
        <h1 className="text-3xl font-bold mb-6">{film.title}</h1>
        <FilmDetails film={film} />
      </div>
    </div>
  );
};

export default FilmPage;