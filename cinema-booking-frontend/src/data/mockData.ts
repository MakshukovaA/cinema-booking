import type { Film } from '../types/film';
import type { Session } from '../types/session';

export const mockFilms: Film[] = [
  {
    id: 'interstellar',
    title: 'Интерстеллар',
    posterUrl: '/img/Interstellar_2014.jpg',
    description: 'Фильм исследует теорию кротовых нор и гравитационных колодцев, а также их возможное влияние на человечество. Сюжет фокусируется на группе исследователей, которые путешествуют через червоточину, чтобы найти новый пригодный для жизни дом для человечества.',
    duration: 169, 
    genre: 'Научная фантастика',
  },
  {
    id: 'inception',
    title: 'Начало',
    posterUrl: '/img/Poster_начало.jpg',
    description: 'Вор, который крадет ценную информацию, проникая в подсознание своих жертв, получает обратную задачу — внедрить идею, а не украсть её. Команда специалистов пытается осуществить невозможное — кражу идеи из подсознания.',
    duration: 148,
    genre: 'Научная фантастика, Триллер',
  },
  {
    id: 'dune',
    title: 'Дюна',
    posterUrl: '/img/Дюна_постер.jpg',
    description: 'Действие разворачивается в далеком будущем на пустынной планете Арракис, единственном источнике ценнейшего вещества во вселенной — меланжа. Молодой Пол Атрейдес должен отправиться на Арракис, чтобы защитить свою семью и народ.',
    duration: 155,
    genre: 'Научная фантастика, Приключения',
  },
  {
    id: 'dark-knight',
    title: 'Темный рыцарь',
    posterUrl: '/img/Тёмный_рыцарь_постер.jpg',
    description: 'Когда Бэтмен поднимает ставки в войне с организованной преступностью, Джокер, безумный криминальный гений, развязывает анархию и заставляет героя пойти на все, чтобы поймать его. Фильм исследует темы морали, справедливости и хаоса.',
    duration: 152,
    genre: 'Боевик, Драма, Криминал',
  },
];

export const mockSessions: Session[] = [
  // Сеансы для Интерстеллара
  // --- Добавлено bookedSeats: [] ---
  { id: 'session-interstellar-1', filmId: 'interstellar', startTime: '2024-03-15T19:00:00', hall: 'Зал 1', availableSeats: 50, totalSeats: 100, priceCategory1: 300, priceCategory2: 400, bookedSeats: [] }, 
  // --- Добавлено bookedSeats, например, два места заняты ---
  { id: 'session-interstellar-2', filmId: 'interstellar', startTime: '2024-03-15T22:00:00', hall: 'Зал 2', availableSeats: 18, totalSeats: 80, priceCategory1: 350, priceCategory2: 450, bookedSeats: ['A1', 'B3'] }, 

  // Сеансы для Начала
  // --- Добавлено bookedSeats: [] ---
  { id: 'session-inception-1', filmId: 'inception', startTime: '2024-03-15T18:30:00', hall: 'Зал 3', availableSeats: 70, totalSeats: 120, priceCategory1: 280, priceCategory2: 380, bookedSeats: [] },

  // Сеансы для Дюны
  // --- Добавлено bookedSeats: [] ---
  { id: 'session-dune-1', filmId: 'dune', startTime: '2024-03-15T20:00:00', hall: 'Зал 1', availableSeats: 30, totalSeats: 100, priceCategory1: 320, priceCategory2: 420, bookedSeats: [] },
  // --- Добавлено bookedSeats, например, несколько мест заняты ---
  { id: 'session-dune-2', filmId: 'dune', startTime: '2024-03-16T10:00:00', hall: 'Зал 4', availableSeats: 85, totalSeats: 150, priceCategory1: 250, priceCategory2: 350, bookedSeats: ['C5', 'C6', 'D1'] },

  // Сеансы для Темного рыцаря
  // --- Добавлено bookedSeats: [] ---
  { id: 'session-dark-knight-1', filmId: 'dark-knight', startTime: '2024-03-15T21:30:00', hall: 'Зал 2', availableSeats: 15, totalSeats: 80, priceCategory1: 330, priceCategory2: 430, bookedSeats: [] },
];

// --- Функция для имитации API ---
export const fetchFilms = async (): Promise<Film[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки сети
  return mockFilms;
};

export const fetchSessionsForFilm = async (filmId: string): Promise<Session[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки сети
  return mockSessions.filter(session => session.filmId === filmId);
};

export const fetchSessionById = async (sessionId: string): Promise<Session | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const session = mockSessions.find(session => session.id === sessionId);
    // Если находим сессию, возвращаем ее. Важно, чтобы она соответствовала типу Session.
    return session; 
}

export const fetchFilmById = async (filmId: string): Promise<Film | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFilms.find(film => film.id === filmId);
}
