import type { Film } from '../types/film';
import type { Session } from '../types/session';
import { getFilmImages } from '../utilses/imageUtils';
import { normalizeFilm, normalizeFilms, normalizeSession, normalizeSessions } from '../utils/dataNormalizer';

const USE_REAL_API = process.env.REACT_APP_USE_REAL_API === 'true';

async function fetchReal<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    let data: any = {};
    try {
      data = await res.json();
    } catch {
      // ignore json parse errors
    }
    const err: any = new Error(`API error: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return (await res.json()) as T;
}

export const fetchFilms = async (): Promise<Film[]> => {
  if (USE_REAL_API) {
    const data = await fetchReal<any[]>('/movies');
    return normalizeFilms(data);
  }
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFilms;
};

export const fetchSessionsForFilm = async (filmId: string): Promise<Session[]> => {
  if (USE_REAL_API) {
    const data = await fetchReal<any[]>(`/movies/${filmId}/sessions`);
    return normalizeSessions(data);
  }
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSessions.filter(session => session.filmId === filmId);
};

export const fetchSessionById = async (sessionId: string): Promise<Session | undefined> => {
  if (USE_REAL_API) {
    const data = await fetchReal<any>(`/sessions/${sessionId}`);
    return normalizeSession(data);
  }
  await new Promise(resolve => setTimeout(resolve, 300));
  const session = mockSessions.find(session => session.id === sessionId);
  return session;
};

export const fetchFilmById = async (filmId: string): Promise<Film | undefined> => {
  if (USE_REAL_API) {
    const data = await fetchReal<any>(`/movies/${filmId}`);
    return normalizeFilm(data);
  }
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockFilms.find(film => film.id === filmId);
};

export const fetchFilmSessionsForFilm = async (filmId: string) => {
  if (USE_REAL_API) {
    return fetchReal<any[]>(`/movies/${filmId}/sessions`);
  }
  return mockSessions.filter(session => session.filmId === filmId);
};

export const mockFilms: Film[] = [
  {
    id: 'interstellar',
    title: 'Интерстеллар',
    posterUrl: getFilmImages('interstellar').POSTER,
    backgroundImage: getFilmImages('interstellar').BACKGROUND,
    description: 'Краткое описание...',
    duration: 169,
    genre: 'Научная фантастика',
    year: 2014,
    rating: 8.6,
    director: 'Кристофер Нолан',
    cast: ['Мэттью МакКонахи', 'Энн Хэтэуэй', 'Джессика Честейн'], // добавлено
    country: 'США',
    gallery: getFilmImages('interstellar').GALLERY
  },
  {
    id: 'inception',
    title: 'Начало',
    posterUrl: getFilmImages('inception').POSTER,
    backgroundImage: getFilmImages('inception').BACKGROUND,
    description: 'Фильм про ворота во сны и идеи.',
    duration: 148,
    genre: 'Научная фантастика, Триллер',
    year: 2010,
    rating: 8.8,
    director: 'Кристофер Нолан',
    // раньше была строка — преобразуем в массив
    cast: ['Леонардо ДиКаприо', 'Джозеф Гордон-Левитт', 'Эллен Пейдж', 'Том Харди'],
    country: 'США, Великобритания',
    gallery: getFilmImages('inception').GALLERY
  },
  {
    id: 'dune',
    title: 'Дюна',
    posterUrl: getFilmImages('dune').POSTER,
    backgroundImage: getFilmImages('dune').BACKGROUND,
    description: 'Действие разворачивается в далеком будущем на пустынной планете Арракис, единственном источнике ценнейшего вещества во вселенной — меланжа.',
    duration: 155,
    genre: 'Научная фантастика, Приключения',
    year: 2021,
    rating: 8.0,
    director: 'Дени Вильнёв',
    cast: ['Тимоти Шаламе', 'Ребекка Фергюсон', 'Оскар Айзек', 'Зендея'],
    country: 'США, Канада',
    gallery: getFilmImages('dune').GALLERY
  },
  {
    id: 'dark-knight',
    title: 'Темный рыцарь',
    posterUrl: getFilmImages('dark-knight').POSTER,
    backgroundImage: getFilmImages('dark-knight').BACKGROUND,
    description: 'Бэтмен против Джокера — тема морали и хаоса.',
    duration: 152,
    genre: 'Боевик, Драма, Криминал',
    year: 2008,
    rating: 9.0,
    director: 'Кристофер Нолан',
    cast: ['Кристиан Бэйл', 'Хит Леджер', 'Аарон Экхарт', 'Мэгги Джилленхол'],
    country: 'США, Великобритания',
    gallery: getFilmImages('dark-knight').GALLERY
  },
];

export const mockSessions: Session[] = [
  { id: 'session-interstellar-1', filmId: 'interstellar', startTime: '2024-03-15T19:00:00', hall: 'Зал 1', availableSeats: 50, totalSeats: 100, priceCategory1: 300, priceCategory2: 400, bookedSeats: [] },
  { id: 'session-interstellar-2', filmId: 'interstellar', startTime: '2024-03-15T22:00:00', hall: 'Зал 2', availableSeats: 18, totalSeats: 80, priceCategory1: 350, priceCategory2: 450, bookedSeats: ['A1', 'B3'] },
  { id: 'session-inception-1', filmId: 'inception', startTime: '2024-03-15T18:30:00', hall: 'Зал 3', availableSeats: 70, totalSeats: 120, priceCategory1: 280, priceCategory2: 380, bookedSeats: [] },
  { id: 'session-dune-1', filmId: 'dune', startTime: '2024-03-15T20:00:00', hall: 'Зал 1', availableSeats: 30, totalSeats: 100, priceCategory1: 320, priceCategory2: 420, bookedSeats: [] },
  { id: 'session-dune-2', filmId: 'dune', startTime: '2024-03-16T10:00:00', hall: 'Зал 4', availableSeats: 85, totalSeats: 150, priceCategory1: 250, priceCategory2: 350, bookedSeats: ['C5', 'C6', 'D1'] },
  { id: 'session-dark-knight-1', filmId: 'dark-knight', startTime: '2024-03-15T21:30:00', hall: 'Зал 2', availableSeats: 15, totalSeats: 80, priceCategory1: 330, priceCategory2: 430, bookedSeats: [] },
];