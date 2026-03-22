import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { normalizeSession, normalizeSeats, extractListFromResponse } from '../utils/dataNormalizer';
import { apiFetch, apiJson } from '../utils/api';
import type { Session } from '../types/session';
import type { Seat } from '../types/booking';

export default function BookingPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const sessionData = await apiJson(`/sessions/${sessionId}/`);
        const normalizedSession = normalizeSession(sessionData);
        setSession(normalizedSession);

        try {
          const seatsResponse = await apiFetch(`/sessions/${sessionId}/available-seats/`);

          if (seatsResponse.ok) {
            const seatsData = await seatsResponse.json();
            const seatsList = extractListFromResponse(seatsData);
            const normalizedSeats = normalizeSeats(seatsList);
            setSeats(normalizedSeats);
          } else {
            console.warn('Available seats endpoint not available:', seatsResponse.status);
            setSeats([]);
          }
        } catch (seatsError) {
          console.warn('Failed to load seats:', seatsError);
          setSeats([]);
        }
      } catch (err) {
        console.error('Failed to load booking data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load booking');
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

  const handleBooking = async () => {
    if (!sessionId) {
      alert('Сеанс не найден');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Выберите хотя бы одно место');
      return;
    }

    try {
      const payloads = [
        { session: sessionId, seats: selectedSeats },
        { session_id: sessionId, seats: selectedSeats },
        { sessionId, seats: selectedSeats },
        { session: sessionId, seat_ids: selectedSeats },
        { session_id: sessionId, seat_ids: selectedSeats },
      ];

      let success = false;
      let lastError: Error | null = null;

      for (const payload of payloads) {
        try {
          const res = await apiFetch('/bookings/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            success = true;
            break;
          }

          const text = await res.text();
          lastError = new Error(`Booking failed: ${res.status} ${text}`);
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Booking failed');
        }
      }

      if (success) {
        alert('Бронирование успешно!');
        navigate('/');
        return;
      }

      throw lastError ?? new Error('Booking failed');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Ошибка бронирования');
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!session) return <div className="error">Сеанс не найден</div>;

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seat = seats.find((item) => String(item.id) === seatId);
    const category = seat?.priceCategory ?? 1;
    return sum + (category === 2 ? session.priceCategory2 : session.priceCategory1);
  }, 0);

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Бронирование билетов</h1>
        <p>Сеанс: {session.startTime}</p>
        <p>Зал: {session.hall}</p>
        <p>Свободно: {session.availableSeats} мест</p>
      </div>

      <div className="seats-grid">
        {seats.length > 0 ? (
          seats.map((seat) => {
            const seatIdStr = String(seat.id);
            const isSelected = selectedSeats.includes(seatIdStr);
            const statusClass =
              seat.status === 'booked'
                ? 'booked'
                : isSelected
                ? 'selected'
                : 'available';

            return (
              <button
                key={seatIdStr}
                className={`seat ${statusClass}`}
                onClick={() => toggleSeat(seatIdStr)}
                disabled={seat.status === 'booked'}
              >
                {seat.row}-{seat.seatNumber}
              </button>
            );
          })
        ) : (
          <p>Список мест недоступен для этого сеанса.</p>
        )}
      </div>

      <div className="booking-summary">
        <p>Выбрано мест: {selectedSeats.length}</p>
        <p>К оплате: {totalPrice} ₽</p>
        <button onClick={handleBooking} disabled={selectedSeats.length === 0}>
          Забронировать
        </button>
      </div>
    </div>
  );
}