import type { Film } from '../types/film';
import type { Session } from '../types/session';
import type { Seat } from '../types/booking';

export interface RawFilm {
  id?: string | number;
  pk?: string | number;
  filmId?: string | number;
  movieId?: string | number;
  movie_id?: string | number;
  title?: string;
  name?: string;
  posterUrl?: string;
  poster?: string;
  poster_url?: string;
  poster_path?: string;
  image?: string;
  image_url?: string;
  description?: string;
  overview?: string;
  duration?: number | string;
  runTime?: number | string;
  length?: number | string;
  genre?: string;
  genres?: string[] | { name?: string }[];
  year?: number | string;
  release_year?: number | string;
  releaseYear?: number | string;
  rating?: number | string;
  director?: string;
  cast?: string | string[];
  country?: string;
  backgroundImage?: string;
  background_image?: string;
  gallery?: string[] | null;
  movie?: { id?: string | number; title?: string } | string | number;
  film?: { id?: string | number; title?: string } | string | number;
}

export interface RawSession {
  id?: string | number;
  pk?: string | number;
  session_id?: string | number;
  sessionId?: string | number;
  filmId?: string | number;
  film_id?: string | number;
  movieId?: string | number;
  movie_id?: string | number;
  movie?: { id?: string | number; title?: string } | string | number;
  film?: { id?: string | number; title?: string } | string | number;
  startTime?: string;
  start_time?: string;
  dateTime?: string;
  datetime?: string;
  time?: string;
  hall?: string | { id?: string | number; name?: string };
  hall_name?: string;
  venue?: string;
  availableSeats?: number | string;
  available_seats?: number | string;
  free_seats?: number | string;
  totalSeats?: number | string;
  total_seats?: number | string;
  seats_total?: number | string;
  priceCategory1?: number | string;
  price_category_1?: number | string;
  price_category1?: number | string;
  priceCategory2?: number | string;
  price_category_2?: number | string;
  price_category2?: number | string;
  bookedSeats?: string[] | null;
  booked_seats?: string[] | null;
}

export interface RawSeat {
  id?: string | number;
  pk?: string | number;
  seat_id?: string | number;
  seatId?: string | number;
  row?: number | string;
  number?: number | string;
  seatNumber?: number | string;
  seat_number?: number | string;
  status?: 'available' | 'booked' | 'selected' | string;
  is_available?: boolean;
  is_booked?: boolean;
  priceCategory?: number | string;
  price_category?: number | string;
  category?: number | string;
}

function safeString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function safeNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function extractEntityId(entity: unknown): string {
  if (entity === null || entity === undefined) return '';
  if (typeof entity === 'string' || typeof entity === 'number') return String(entity);
  if (typeof entity === 'object' && entity !== null) {
    const maybeId = (entity as { id?: string | number }).id;
    return maybeId !== undefined && maybeId !== null ? String(maybeId) : '';
  }
  return '';
}

function normalizeGenre(genres: unknown): string {
  if (typeof genres === 'string') return genres;
  if (Array.isArray(genres)) {
    return genres
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'name' in item) {
          return safeString((item as { name?: unknown }).name);
        }
        return '';
      })
      .filter(Boolean)
      .join(', ');
  }
  return '';
}

function normalizeCast(cast: unknown): string[] {
  if (Array.isArray(cast)) {
    return cast.map((item) => safeString(item)).filter(Boolean);
  }
  if (typeof cast === 'string' && cast.trim()) {
    return cast
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeGallery(gallery: unknown): string[] {
  if (Array.isArray(gallery)) {
    return gallery.map((item) => safeString(item)).filter(Boolean);
  }
  return [];
}

function normalizeRating(rating: unknown): number {
  if (rating === null || rating === undefined) return 0;
  const num = Number(rating);
  return Number.isNaN(num) ? 0 : Math.round(num * 10) / 10;
}

export function normalizeFilm(data: RawFilm | any): Film {
  if (!data) {
    return {
      id: '',
      title: 'Неизвестный фильм',
      posterUrl: '',
      description: '',
      duration: 0,
      genre: '',
      year: 0,
    } as Film;
  }

  const id = safeString(
    data.id ??
      data.pk ??
      data.filmId ??
      data.movieId ??
      data.movie_id ??
      extractEntityId(data.movie) ??
      extractEntityId(data.film),
    ''
  );

  const title = safeString(data.title ?? data.name, 'Без названия');
  const posterUrl = safeString(
    data.posterUrl ?? data.poster ?? data.poster_url ?? data.poster_path ?? data.image ?? data.image_url,
    ''
  );
  const description = safeString(data.description ?? data.overview, '');
  const duration = safeNumber(data.duration ?? data.runTime ?? data.length, 0);
  const genre = safeString(data.genre, '') || normalizeGenre(data.genres);
  const year = safeNumber(data.year ?? data.release_year ?? data.releaseYear, 0);
  const rating = normalizeRating(data.rating);
  const director = safeString(data.director, '');
  const cast = normalizeCast(data.cast);
  const country = safeString(data.country, '');
  const backgroundImage = safeString(data.backgroundImage ?? data.background_image, '');
  const gallery = normalizeGallery(data.gallery);

  return {
    id,
    title,
    posterUrl,
    description,
    duration,
    genre,
    year,
    rating,
    director,
    cast,
    country,
    backgroundImage,
    gallery,
  } as Film;
}

export function normalizeFilms(data: RawFilm[] | any[]): Film[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeFilm);
}

export function normalizeSession(data: RawSession | any): Session {
  if (!data) {
    return {
      id: '',
      filmId: '',
      startTime: '',
      hall: '',
      availableSeats: 0,
      totalSeats: 0,
      bookedSeats: [],
      priceCategory1: 300,
      priceCategory2: 400,
    } as Session;
  }

  const id = safeString(data.id ?? data.pk ?? data.session_id ?? data.sessionId, '');

  const filmId =
    safeString(data.filmId, '') ||
    safeString(data.film_id, '') ||
    safeString(data.movieId, '') ||
    safeString(data.movie_id, '') ||
    extractEntityId(data.movie) ||
    extractEntityId(data.film) ||
    '';

  const startTime = safeString(
    data.startTime ?? data.start_time ?? data.dateTime ?? data.datetime ?? data.time,
    ''
  );

  const hall =
    typeof data.hall === 'object' && data.hall !== null
      ? safeString((data.hall as { name?: string }).name, '')
      : safeString(data.hall ?? data.hall_name ?? data.venue, '');

  const availableSeats = safeNumber(data.availableSeats ?? data.available_seats ?? data.free_seats, 0);
  const totalSeats = safeNumber(data.totalSeats ?? data.total_seats ?? data.seats_total, availableSeats);
  const priceCategory1 = safeNumber(data.priceCategory1 ?? data.price_category_1 ?? data.price_category1, 300);
  const priceCategory2 = safeNumber(data.priceCategory2 ?? data.price_category_2 ?? data.price_category2, 400);

  const bookedSeatsRaw = data.bookedSeats ?? data.booked_seats;
  const bookedSeats = Array.isArray(bookedSeatsRaw)
    ? bookedSeatsRaw.map((item: unknown) => safeString(item)).filter(Boolean)
    : [];

  return {
    id,
    filmId,
    startTime,
    hall,
    availableSeats,
    totalSeats,
    bookedSeats,
    priceCategory1,
    priceCategory2,
  } as Session;
}

export function normalizeSessions(data: RawSession[] | any[]): Session[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeSession);
}

export function normalizeSeat(data: RawSeat | any): Seat {
  if (!data) {
    return {
      id: '',
      row: 0,
      seatNumber: 0,
      status: 'available',
      priceCategory: 1,
    } as Seat;
  }

  const id = safeString(data.id ?? data.pk ?? data.seat_id ?? data.seatId, '');
  const row = safeNumber(data.row, 0);
  const seatNumber = safeNumber(data.number ?? data.seatNumber ?? data.seat_number, 0);

  let status: 'available' | 'booked' | 'selected' = 'available';
  if (data.is_booked === true || data.status === 'booked' || data.is_available === false) {
    status = 'booked';
  } else if (data.status === 'selected') {
    status = 'selected';
  }

  const priceCategory = safeNumber(data.priceCategory ?? data.price_category ?? data.category, 1);

  return {
    id,
    row,
    seatNumber,
    status,
    priceCategory,
  } as Seat;
}

export function normalizeSeats(
  data: RawSeat[] | any[] | { seats?: any[]; results?: any[]; data?: any[] }
): Seat[] {
  if (!data) return [];
  const list = Array.isArray(data) ? data : data.seats ?? data.results ?? data.data ?? [];
  if (!Array.isArray(list)) return [];
  return list.map(normalizeSeat);
}

export function extractListFromResponse(response: any): any[] {
  if (Array.isArray(response)) return response;
  if (response?.results && Array.isArray(response.results)) return response.results;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.items && Array.isArray(response.items)) return response.items;
  if (response?.seats && Array.isArray(response.seats)) return response.seats;
  return [];
}