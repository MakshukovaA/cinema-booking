import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiClient from '../api';
import type { Film } from '../types/film';
import type { Session } from '../types/session';
import FilmDetails from '../components/FilmDetails';
import SessionList from '../components/SessionList';
import { fetchFilmById, fetchFilmSessionsForFilm } from '../data/mockData';

// Хелпер для приведения мок-данных к типу Session
const mapMockSessionsToSession = (mockSessions: any[], filmIdForMap?: string): Session[] => {
  return (mockSessions ?? []).map((s) => ({
    id: s.id ?? '',
    filmId: s.filmId ?? filmIdForMap ?? '',
    startTime: (s as any).dateTime ?? '',
    hall: (s as any).venue ?? '',
    availableSeats: (s as any).availableSeats ?? 0,
    totalSeats: (s as any).totalSeats ?? (s as any).availableSeats ?? 0,
    bookedSeats: (s as any).bookedSeats ?? [], // исправлено: массив строк
    priceCategory1: (s as any).priceCategory1 ?? 0,
    priceCategory2: (s as any).priceCategory2 ?? 0,
    priceCategory3: (s as any).priceCategory3 ?? 0,
    priceCategory4: (s as any).priceCategory4 ?? 0,
  } as Session));
};

const FilmPage: React.FC = () => {
  const { filmId: paramFilmId, slug } = useParams<{ filmId?: string; slug?: string }>();
  const filmId = (paramFilmId ?? slug ?? '') as string;
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
            let list = Array.isArray(res) ? res : res?.results ?? [];
            // Фолбэк на мок-данные, если API вернул пустой список
            if (!Array.isArray(list) || list.length === 0) {
              try {
                const mockSessions = await fetchFilmSessionsForFilm?.(filmId);
                list = mapMockSessionsToSession(
                  Array.isArray(mockSessions) ? mockSessions : [],
                  filmId
                );
              } catch {
                list = [];
              }
            }
            setSessions(Array.isArray(list) ? (list as Session[]) : []);
          } catch {
            // если ошибка запроса — попробуем мок-данные
            try {
              const mockSessions = await fetchFilmSessionsForFilm?.(filmId);
              setSessions(mapMockSessionsToSession(
                Array.isArray(mockSessions) ? mockSessions : [],
                filmId
              ));
            } catch {
              setSessions([]);
            }
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