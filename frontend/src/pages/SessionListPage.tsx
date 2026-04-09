import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiJson } from '../utils/api';
import { normalizeSession, extractListFromResponse } from '../utils/dataNormalizer';
import type { Session } from '../types/session';
import SessionList from '../components/SessionList';

export default function SessionListPage() {
  const { filmId } = useParams<{ filmId: string }>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filmTitle, setFilmTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      if (!filmId) {
        setError('Фильм не найден');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const filmData = await apiJson(`/api/movies/${filmId}/`);
        setFilmTitle(filmData.title || `Фильм #${filmId}`);

        const sessionsData = await apiJson(`/api/sessions/?film=${filmId}`);
        const sessionsList = extractListFromResponse(sessionsData);
        const normalizedSessions = sessionsList.map(normalizeSession);
        setSessions(normalizedSessions.filter((s) => String(s.filmId) === String(filmId)));
      } catch (err) {
        console.error('Failed to load sessions:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки сеансов');
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [filmId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-500">Загрузка сеансов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Ошибка</p>
          <p>{error}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Вернуться к фильмам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Все фильмы
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          {filmTitle || `Фильм #${filmId}`}
        </h1>
        <p className="text-gray-600 mt-1">Выберите удобный сеанс</p>
      </div>

      <SessionList sessions={sessions} filmId={filmId} />
    </div>
  );
}