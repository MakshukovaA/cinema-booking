import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { normalizeFilm, normalizeSessions, extractListFromResponse } from '../utils/dataNormalizer';
import { apiJson } from '../utils/api';
import type { Film } from '../types/film';
import type { Session } from '../types/session';
import FilmDetails from '../components/FilmDetails';

export default function FilmPage() {
  const { filmId } = useParams<{ filmId: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!filmId) {
        setError('Фильм не найден (нет id в URL)');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const movieData = await apiJson(`/api/movies/${filmId}/`);
        const normalizedFilm = normalizeFilm(movieData);
        setFilm(normalizedFilm);

        const sessionsData = await apiJson(`/api/sessions/?film=${filmId}`);
        const list = extractListFromResponse(sessionsData);
        const normalizedSessions = normalizeSessions(list).filter(
          (s) => String(s.filmId) === String(filmId)
        );
        setSessions(normalizedSessions);
      } catch (err) {
        console.error('Film page load error:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки фильма');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [filmId]);

  if (loading) return <div className="p-4">Загрузка…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!film) return <div className="p-4">Фильм не найден</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        ← Все фильмы
      </Link>

      <h1 className="text-3xl font-bold mt-3 mb-6">{film.title}</h1>

      <FilmDetails film={film} />

      {film.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Описание</h2>
          <p className="text-gray-700">{film.description}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Сеансы</h2>

        {sessions.length === 0 ? (
          <p className="text-gray-500">Сеансы пока не найдены.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p><strong>Время:</strong> {s.startTime}</p>
                  <p><strong>Зал:</strong> {s.hall}</p>
                  <p><strong>Свободно мест:</strong> {s.availableSeats}</p>
                </div>

                <Link
                  to={`/booking/${s.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Забронировать
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}