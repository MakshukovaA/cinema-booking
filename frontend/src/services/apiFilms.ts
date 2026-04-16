import type { Film } from '../types/film';
import type { Session } from '../types/session';
import { apiJson, apiFetch } from '../utils/api';
import {
  normalizeFilm,
  normalizeFilms,
  normalizeSession,
  normalizeSessions,
  extractListFromResponse,
} from '../utils/dataNormalizer';


export const fetchFilms = async (): Promise<Film[]> => {
  try {
    const data = await apiJson('/api/movies/');
    const list = extractListFromResponse(data);
    return normalizeFilms(list);
  } catch (error) {
    console.error('Failed to fetch films:', error);
    throw error;
  }
};

export const fetchFilmById = async (filmId: string): Promise<Film | null> => {
  try {
    const data = await apiJson(`/api/movies/${filmId}/`);

    const payload =
      data && typeof data === 'object' && 'data' in data ? (data as any).data : data;

    if (!payload) {
      return null;
    }

    return normalizeFilm(payload);
  } catch (error: any) {
    console.error(`Failed to fetch film ${filmId}:`, error);
    return null;
  }
};

// ========== SESSIONS ==========

export const fetchSessionsForFilm = async (filmId: string): Promise<Session[]> => {
  try {
    const data = await apiJson(`/api/sessions/?film=${filmId}`);
    const list = extractListFromResponse(data);
    return normalizeSessions(list);
  } catch (error) {
    console.error(`Failed to fetch sessions for film ${filmId}:`, error);
    throw error;
  }
};

export const fetchSessionById = async (sessionId: string): Promise<Session | null> => {
  try {
    const data = await apiJson(`/api/sessions/${sessionId}/`);
    const payload =
      data && typeof data === 'object' && 'data' in data ? (data as any).data : data;
    if (!payload) return null;
    return normalizeSession(payload);
  } catch (error) {
    console.error(`Failed to fetch session ${sessionId}:`, error);
    return null;
  }
};

// ========== BOOKINGS / SEATS ==========

export const fetchAvailableSeats = async (sessionId: string): Promise<any[]> => {
  try {
    const response = await apiFetch(`/api/sessions/${sessionId}/available-seats/`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return extractListFromResponse(data);
  } catch (error) {
    console.error(`Failed to fetch seats for session ${sessionId}:`, error);
    return [];
  }
};

export const createBooking = async (payload: {
  session: string;
  seats: string[];
  name: string;
  phone: string;
}): Promise<{ success: boolean; bookingId?: string; error?: string }> => {
  try {
    const response = await apiFetch('/api/bookings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Booking failed: ${response.status} ${text}`);
    }

    const result = await response.json();
    return { success: true, bookingId: result.id };
  } catch (error) {
    console.error('Booking error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка бронирования',
    };
  }
};