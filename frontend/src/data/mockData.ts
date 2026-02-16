import type { Film } from '../types/film';
import type { Session } from '../types/session';

export const mockFilms: Film[] = [
   {
    id: 'interstellar',
    title: 'Интерстеллар',
    posterUrl: '/img/Interstellar_2014.jpg',
    backgroundImage: '/img/Interstellar_2014.jpg', 
    description: 'Фильм исследует теорию кротовых нор и гравитационных колодцев, а также их возможное влияние на человечество. Сюжет фокусируется на группе исследователей, которые путешествуют через червоточину, чтобы найти новый пригодный для жизни дом для человечества.',
    duration: 169, 
    genre: 'Научная фантастика',
    year: 2014,
    rating: 8.6,
    director: 'Кристофер Нолан',
    cast: 'Мэттью МакКонахи, Энн Хэтэуэй, Джессика Честейн, Майкл Кейн',
    country: 'США, Великобритания, Канада',
    gallery: [
      '/img/Interstellar_2014.jpg',
      '/img/Interstellar_2014.jpg',
      '/img/Interstellar_2014.jpg'
    ]
  },
  {
    id: 'inception',
    title: 'Начало',
    posterUrl: '/img/Poster_начало.jpg',
    backgroundImage: '/img/Poster_начало.jpg',
    description: 'Вор, который крадет ценную информацию, проникая в подсознание своих жертв, получает обратную задачу — внедрить идею, а не украсть её. Команда специалистов пытается осуществить невозможное — кражу идеи из подсознания.',
    duration: 148,
    genre: 'Научная фантастика, Триллер',
    year: 2010,
    rating: 8.8,
    director: 'Кристофер Нолан',
    cast: 'Леонардо ДиКаприо, Джозеф Гордон-Левитт, Эллен Пейдж, Том Харди',
    country: 'США, Великобритания',
    gallery: [
      '/img/Poster_начало.jpg',
      '/img/Poster_начало.jpg',
      '/img/Poster_начало.jpg'
    ]
  },
  {
    id: 'dune',
    title: 'Дюна',
    posterUrl: '/img/Дюна_постер.jpg',
    backgroundImage: '/img/Дюна_постер.jpg',
    description: 'Действие разворачивается в далеком будущем на пустынной планете Арракис, единственном источнике ценнейшего вещества во вселенной — меланжа. Молодой Пол Атрейдес должен отправиться на Арракис, чтобы защитить свою семью и народ.',
    duration: 155,
    genre: 'Научная фантастика, Приключения',
    year: 2021,
    rating: 8.0,
    director: 'Дени Вильнёв',
    cast: 'Тимоти Шаламе, Ребекка Фергюсон, Оскар Айзек, Зендея',
    country: 'США, Канада',
    gallery: [
      '/img/Дюна_постер.jpg',
      '/img/дюна.jpg',
      '/img/Дюна_постер.jpg'
    ]
  },
  {
    id: 'dark-knight',
    title: 'Темный рыцарь',
    posterUrl: '/img/Тёмный_рыцарь_постер.jpg',
    backgroundImage: '/img/Тёмный_рыцарь_постер.jpg',
    description: 'Когда Бэтмен поднимает ставки в войне с организованной преступностью, Джокер, безумный криминальный гений, развязывает анархию и заставляет героя пойти на все, чтобы поймать его. Фильм исследует темы морали, справедливости и хаоса.',
    duration: 152,
    genre: 'Боевик, Драма, Криминал',
    year: 2008,
    rating: 9.0,
    director: 'Кристофер Нолан',
    cast: 'Кристиан Бэйл, Хит Леджер, Аарон Экхарт, Мэгги Джилленхол',
    country: 'США, Великобритания',
    gallery: [
      '/img/Тёмный_рыцарь_постер.jpg',
      '/img/Тёмный_рыцарь_постер.jpg',
      '/img/Тёмный_рыцарь_постер.jpg'
    ]
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

export const fetchFilms = async (): Promise<Film[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return mockFilms;
};

export const fetchSessionsForFilm = async (filmId: string): Promise<Session[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSessions.filter(session => session.filmId === filmId);
};

export const fetchSessionById = async (sessionId: string): Promise<Session | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const session = mockSessions.find(session => session.id === sessionId);
    return session; 
}

export const fetchFilmById = async (filmId: string): Promise<Film | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFilms.find(film => film.id === filmId);
}
