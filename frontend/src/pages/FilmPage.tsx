import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { normalizeFilm, normalizeSessions, extractListFromResponse } from '../utils/dataNormalizer';
import type { Film } from '../types/film';
import type { Session } from '../types/session';

async function fetchJsonWithStatus(url: string) {
  const res = await fetch(url, { credentials: 'same-origin' });
  let data = null;
  try {
    data = await res.json();
  } catch {}
  return { status: res.status, ok: res.ok, data };
}

export default function FilmPage() {
  const { filmId } = useParams<{ filmId: string }>(); 
  const [film, setFilm] = useState<Film | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!filmId) {
        setError('Фильм не найден (нет id в url)');
        setLoading(false);
        return;
      }

      const movieResp = await fetchJsonWithStatus(`/api/movies/${filmId}/`);
      if (!movieResp.ok) {
        setError(`Ошибка ${movieResp.status}`);
        setLoading(false);
        return;
      }

      const normalizedFilm = normalizeFilm(movieResp.data);
      setFilm(normalizedFilm);

      const sessionsResp = await fetchJsonWithStatus(`/api/sessions/?film=${filmId}`);
      if (sessionsResp.ok) {
        const list = extractListFromResponse(sessionsResp.data);
        const normalizedSessions = normalizeSessions(list);
        setSessions(normalizedSessions.filter(s => String(s.filmId) === String(filmId)));
      }
      setLoading(false);
    }
    load();
  }, [filmId]);

  if (loading) return <div>Загрузка…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!film) return <div>Фильм не найден</div>;

  return (
    <div className="film-page">
      <h1>{film.title}</h1>
      {sessions.map(s => (
        <div key={s.id}>
          {s.startTime} — Зал {s.hall}{' '}
          <Link to={`/booking/${s.id}`}>Забронировать</Link>
        </div>
      ))}
    </div>
  );
}