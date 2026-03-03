import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import { getAccess } from '../auth';
import type { Film } from '../types/film';
import type { Session } from '../types/session';
import SeatMap from '../components/SeatMap';
import SeatLegend from '../components/SeatLegend';
import BookingSummary from '../components/BookingSummary';
import BookingForm from '../components/BookingForm';
import type { Seat } from '../types/booking';

const PRICE_CATEGORY_1_COST = 300;
const PRICE_CATEGORY_2_COST = 400;

const BookingPage: React.FC = () => {
  const { sessionId: pathSessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const querySessionId = new URLSearchParams(location.search).get('sessionId');
  const sessionIdToUse = pathSessionId ?? querySessionId ?? '';

  const navigate = useNavigate();

  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const calculateTotalPrice = useCallback((currentSeats: Seat[]) => {
    const priceCat1 = selectedSession?.priceCategory1 ?? PRICE_CATEGORY_1_COST;
    const priceCat2 = selectedSession?.priceCategory2 ?? PRICE_CATEGORY_2_COST;
    return currentSeats.reduce((sum, seat) => {
      const price = seat.priceCategory === 1 ? priceCat1 : priceCat2;
      return sum + price;
    }, 0);
  }, [selectedSession]);

  useEffect(() => {
    if (!sessionIdToUse) {
      setBookingError('Не указан идентификатор сеанса (sessionId) в URL.');
      setIsLoadingData(false);
      return;
    }
    setIsLoadingData(true);
    setBookingError(null);

    const api = new ApiClient();
    const token = getAccess() ?? undefined;

    const loadBookingDetails = async () => {
      try {
        const sess: any = await api.get<any>(`/api/sessions/${sessionIdToUse}/`, token);
        const filmObj = sess.film ?? { id: sess.film_id, title: sess.film_title };

        const sessionData = {
          id: sess.id,
          startTime: sess.startTime ?? sess.start_time,
          hall: sess.hall ?? sess.hall_name,
          film: filmObj,
          priceCategory1: sess.priceCategory1 ?? PRICE_CATEGORY_1_COST,
          priceCategory2: sess.priceCategory2 ?? PRICE_CATEGORY_2_COST,
        } as unknown as Session;

        setSelectedSession(sessionData);
        setSelectedFilm({ id: filmObj.id, title: filmObj.title } as Film);

        const seatsRes: any = await api.get<any>(`/api/sessions/${sessionIdToUse}/available-seats/`, token);
        const seatsList = Array.isArray(seatsRes) ? seatsRes : seatsRes?.seats ?? [];
        const mapped: Seat[] = seatsList.map((s: any) => ({
          id: s.id,
          row: s.row,
          seatNumber: s.number ?? s.seatNumber ?? 0,
          status: s.status ?? 'available',
          priceCategory: s.priceCategory ?? 1,
        }));
        setSeats(mapped);
      } catch (err) {
        console.error('Ошибка загрузки данных бронирования', err);
        setBookingError('Ошибка загрузки данных бронирования.');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadBookingDetails();
  }, [sessionIdToUse]);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(selectedSeats));
  }, [selectedSeats, calculateTotalPrice]);

  const handleSeatClick = useCallback((seatId: string) => {
    const clickedSeat = seats.find(s => s.id === seatId);
    if (!clickedSeat || clickedSeat.status !== 'available') return;

    setSelectedSeats(prev => {
      const isAlreadySelected = prev.some(s => s.id === seatId);
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== seatId);
      } else {
        return [...prev, clickedSeat];
      }
    });
  }, [seats]);

  const handleCancelSelection = () => setSelectedSeats([]);

  const handleConfirmBooking = async (userName: string, userPhone: string) => {
    if (selectedSeats.length === 0) {
      setBookingError('Пожалуйста, выберите места!');
      return;
    }
    if (!selectedSession) {
      setBookingError('Данные сеанса не загружены.');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    const payload = {
      session: selectedSession.id,
      seat_ids: selectedSeats.map(s => s.id),
      userName,
      userPhone,
    };


    try {
      const api = new ApiClient();
      const token = getAccess() ?? undefined;
      await api.post('/api/bookings/', payload, token);
      alert(`Места успешно забронированы! Спасибо, ${userName}!`);
      navigate(`/film/${selectedFilm?.id ?? selectedSession?.id ?? ''}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка бронирования';
      setBookingError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl">Загрузка информации...</p>
      </div>
    );
  }

  if (bookingError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500 text-xl">{bookingError}</p>
      </div>
    );
  }

  if (!selectedFilm || !selectedSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500 text-xl">
          Не удалось загрузить полные данные. Попробуйте обновить страницу.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Бронирование билетов: {selectedFilm.title}
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Сеанс: {new Date(selectedSession.startTime).toLocaleString('ru-RU')} | Зал: {selectedSession.hall}
      </p>

      <SeatMap seats={seats} onSeatClick={handleSeatClick} />
      <SeatLegend />

      {selectedSeats.length > 0 && (
        <>
          <BookingSummary
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            filmTitle={selectedFilm.title}
            sessionTime={new Date(selectedSession.startTime).toLocaleString('ru-RU')}
            hallName={selectedSession.hall}
          />
          <div className="mt-6">
            <BookingForm
              onSubmit={handleConfirmBooking}
              selectedSeats={selectedSeats}
              isSubmitting={isSubmitting}
            />
          </div>
        </>
      )}

      {selectedSeats.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={handleCancelSelection}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-md font-semibold shadow-md text-white transition-colors duration-200
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-700'}`}
          >
            Отменить выбор мест
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;