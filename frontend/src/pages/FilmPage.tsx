import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { normalizeFilm, normalizeSessions, extractListFromResponse } from '../utils/dataNormalizer';
import { apiJson } from '../utils/api';
import type { Film } from '../types/film';
import type { Session } from '../types/session';

export default function FilmPage() {
  const { id } = useParams<{ id: string }>();

  const [film, setFilm] = useState<Film | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFilmData() {
      if (!id) {
        setError('Фильм не найден');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const filmData = await apiJson(`/movies/${id}/`);
        const normalizedFilm = normalizeFilm(filmData);
        setFilm(normalizedFilm);

        try {
          const sessionsData = await apiJson(`/sessions/`);
          const sessionsList = extractListFromResponse(sessionsData);
          const normalized = normalizeSessions(sessionsList);

          const filtered = normalized.filter(
            (session) => String(session.filmId) === String(id)
          );

          setSessions(filtered);
        } catch (sessionsError) {
          console.warn('Failed to load sessions:', sessionsError);
          setSessions([]);
        }
      } catch (err) {
        console.error('Failed to load film data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load film');
      } finally {
        setLoading(false);
      }
    }

    loadFilmData();
  }, [id]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!film) return <div className="error">Фильм не найден</div>;

  return (
    <div className="film-page">
      <div className="film-header">
        <img src={film.posterUrl} alt={film.title} />
        <div className="film-info">
          <h1>{film.title}</h1>
          <p className="genre">{film.genre}</p>
          <p className="year">{film.year}</p>
          <p className="duration">{film.duration} мин.</p>
          {film.rating ? <p className="rating">Рейтинг: {film.rating}</p> : null}
          {film.director ? <p className="director">Режиссёр: {film.director}</p> : null}
          {film.country ? <p className="country">Страна: {film.country}</p> : null}
        </div>
      </div>

      {film.description ? (
        <div className="film-description">
          <h2>Описание</h2>
          <p>{film.description}</p>
        </div>
      ) : null}

      {sessions.length > 0 ? (
        <div className="sessions-section">
          <h2>Сеансы</h2>
          <div className="sessions-list">
            {sessions.map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-time">{session.startTime}</div>
                <div className="session-hall">Зал: {session.hall}</div>
                <div className="session-seats">
                  Свободно: {session.availableSeats} из {session.totalSeats}
                </div>
                <div className="session-price">
                  {session.priceCategory1} ₽ - {session.priceCategory2} ₽
                </div>
                <Link to={`/booking/${session.id}`} className="session-book-button">
                  Забронировать
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sessions-section">
          <h2>Сеансы</h2>
          <p>Для этого фильма пока нет доступных сеансов.</p>
        </div>
      )}
    </div>
  );
}