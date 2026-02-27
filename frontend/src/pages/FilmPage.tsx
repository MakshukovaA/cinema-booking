import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiClient from '../api';
import type { Film } from '../types/film';
import type { Session } from '../types/session';
import FilmDetails from '../components/FilmDetails';
import SessionList from '../components/SessionList';
import { fetchFilmById } from '../data/mockData';

const FilmPage: React.FC = () => {
  const { filmId } = useParams<{ filmId: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = new ApiClient();
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? undefined : undefined;

    const load = async () => {
      try {
        if (filmId) {
          let f: Film | undefined;
          try {
            f = await api.get<Film>(`/movies/${filmId}`, token);
          } catch {
            f = undefined;
          }
          if (!f) {
            const mock = await fetchFilmById?.(filmId);
            f = mock ?? undefined;
          }
          setFilm(f ?? null);
        }

        if (filmId) {
          try {
            const res = await api.get<any>(`/sessions?filmId=${filmId}`, token);
            const list = Array.isArray(res) ? res : res?.results ?? [];
            setSessions(Array.isArray(list) ? list : []);
          } catch {
            setSessions([]);
          }
        }
      } catch (e) {
        setError('Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [filmId]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Ошибка загрузки</h3>
          <p className="mb-4">{error}</p>
          <button onClick={() => window.history.back()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {film ? (
        <FilmDetails film={film} />
      ) : (
        <div className="text-center text-2xl font-semibold mb-6">Фильм не найден</div>
      )}

      <div className="mt-12">
        <SessionList sessions={sessions} />
      </div>
    </div>
  );
};

export default FilmPage;