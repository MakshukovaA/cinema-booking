import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { normalizeSession, normalizeSeats, extractListFromResponse } from '../utils/dataNormalizer';
import { apiFetch, apiJson } from '../utils/api';
import type { Session } from '../types/session';
import type { Seat } from '../types/booking';
import SeatMap from '../components/SeatMap';
import SeatLegend from '../components/SeatLegend';
import BookingSummary from '../components/BookingSummary';
import BookingForm from '../components/BookingForm';

export default function BookingPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filmTitle, setFilmTitle] = useState<string>('');

  useEffect(() => {
    async function loadBookingData() {
      if (!sessionId) {
        setError('Сеанс не найден');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const sessionData = await apiJson(`/api/sessions/${sessionId}/`);
        const normalizedSession = normalizeSession(sessionData);
        setSession(normalizedSession);

        if (normalizedSession.filmId) {
          try {
            const filmData = await apiJson(`/api/movies/${normalizedSession.filmId}/`);
            setFilmTitle(filmData.title || `Фильм #${normalizedSession.filmId}`);
          } catch {
            setFilmTitle(`Фильм #${normalizedSession.filmId}`);
          }
        }

        try {
          const seatsResponse = await apiFetch(`/api/sessions/${sessionId}/available-seats/`);
          if (seatsResponse.ok) {
            const seatsData = await seatsResponse.json();
            const seatsList = extractListFromResponse(seatsData);
            const normalizedSeats = normalizeSeats(seatsList);
            setSeats(normalizedSeats);
          } else {
            console.warn('Available seats endpoint returned:', seatsResponse.status);
            setSeats([]);
          }
        } catch (seatsError) {
          console.warn('Failed to load seats:', seatsError);
          setSeats([]);
        }
      } catch (err) {
        console.error('Failed to load booking data:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки бронирования');
      } finally {
        setLoading(false);
      }
    }

    loadBookingData();
  }, [sessionId]);

  const toggleSeat = (seatId: string) => {
    const seat = seats.find((item) => String(item.id) === seatId);
    if (!seat || seat.status === 'booked') return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBookingSubmit = async (userName: string, userPhone: string) => {
    if (!sessionId) {
      alert('Сеанс не найден');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Выберите хотя бы одно место');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        session: sessionId,
        seats: selectedSeats,
        name: userName,
        phone: userPhone,
      };

      const res = await apiFetch('/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Бронирование успешно!');
        navigate('/');
      } else {
        const text = await res.text();
        throw new Error(`Booking failed: ${res.status} ${text}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Ошибка бронирования. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Ошибка</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700">Сеанс не найден</p>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seat = seats.find((item) => String(item.id) === seatId);
    const category = seat?.priceCategory ?? 1;
    return sum + (category === 2 ? session.priceCategory2 : session.priceCategory1);
  }, 0);

  return (
    <div className="booking-page max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Бронирование билетов</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p><strong>Фильм:</strong> {filmTitle}</p>
        <p><strong>Сеанс:</strong> {session.startTime}</p>
        <p><strong>Зал:</strong> {session.hall}</p>
        <p><strong>Свободно:</strong> {session.availableSeats} мест</p>
      </div>

      {seats.length > 0 ? (
        <>
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatClick={toggleSeat}
          />
          <SeatLegend />
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Информация о местах недоступна
        </div>
      )}

      <BookingSummary
        selectedSeats={seats.filter((s) => selectedSeats.includes(String(s.id)))}
        totalPrice={totalPrice}
        filmTitle={filmTitle}
        sessionTime={session.startTime}
        hallName={session.hall}
      />

      <BookingForm
        onSubmit={handleBookingSubmit}
        selectedSeats={seats.filter((s) => selectedSeats.includes(String(s.id)))}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}