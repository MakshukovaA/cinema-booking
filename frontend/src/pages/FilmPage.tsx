import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FilmDetails from '../components/FilmDetails';
import SessionList from '../components/SessionList';
import type { Film } from '../types/film';
import type { Session } from '../types/session';
import { fetchFilmById, fetchSessionsForFilm, fetchFilms } from '../data/mockData';

const FilmPage: React.FC = () => {
  const { filmId } = useParams<{ filmId: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableFilmIds, setAvailableFilmIds] = useState<string[]>([]); 

  useEffect(() => {
    const fetchFilmAndSessions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!filmId) {
          throw new Error('ID фильма не указан.');
        }

        const allFilms = await fetchFilms();
        const filmIds = allFilms.map((f: Film) => f.id);
        setAvailableFilmIds(filmIds);

        console.log("🎬 FilmPage: filmId =", filmId);
        console.log("📋 Available film IDs:", filmIds);

        const fetchedFilm = await fetchFilmById(filmId);
        const fetchedSessions = await fetchSessionsForFilm(filmId);
        
        if (!fetchedFilm) {
          throw new Error(`Фильм с ID "${filmId}" не найден. Доступные ID: ${filmIds.join(', ')}`);
        }
        
        setFilm(fetchedFilm);
        setSessions(fetchedSessions);

      } catch (err) {
        console.error("Error loading film data:", err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных фильма или сеансов.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilmAndSessions();
  }, [filmId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Загрузка информации о фильме...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Назад
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Обновить
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 text-gray-400 mx-auto mb-4">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Фильм не найден</h3>
          <p className="text-gray-600 mb-6">Запрошенный фильм не существует или был удален.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Вернуться к фильмам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <FilmDetails film={film} />

        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Доступные сеансы</h2>
                <p className="text-gray-600 mt-2">Выберите удобное время для просмотра</p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg">
                <span className="font-semibold">{sessions.length}</span> сеансов доступно
              </div>
            </div>
            
            <SessionList sessions={sessions} filmId={film.id} />
            
            {sessions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 text-gray-300 mx-auto mb-4">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Сеансы не найдены</h3>
                <p className="text-gray-500">На данный момент нет доступных сеансов для этого фильма.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmPage;