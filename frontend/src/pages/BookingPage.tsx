import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SeatMap from '../components/SeatMap';
import SeatLegend from '../components/SeatLegend';
import BookingSummary from '../components/BookingSummary';
import BookingForm from '../components/BookingForm';
import type { Seat, HallLayout, BookingInfo } from '../types/booking';
import type { Film } from '../types/film';
import type { Session } from '../types/session';
import { fetchSessionById, fetchFilmById } from '../data/mockData';

const PRICE_CATEGORY_1_COST = 300;
const PRICE_CATEGORY_2_COST = 400;

const dummyHallLayoutData: HallLayout = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: { 'A': 10, 'B': 12, 'C': 12, 'D': 12, 'E': 12, 'F': 10, 'G': 8, 'H': 6 },
    occupiedSeats: ['G1', 'G2'],
    bookedSeats: [],
    priceMap: { 
        'A': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 1, 9: 1, 10: 1 },
        'B': { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1, 6: 1, 7: 1, 8: 2, 9: 1, 10: 1, 11: 1, 12: 1 },
        'C': { 1: 1, 2: 2, 3: 1, 4: 1, 5: 1, 6: 2, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1},
        'D': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 },
        'E': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 },
        'F': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 },
        'G': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
        'H': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
    }
};


const BookingPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0); 

    const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 

    const queryParams = new URLSearchParams(location.search);
    const filmIdFromUrl = queryParams.get('filmId');

    const calculateTotalPrice = useCallback((currentSeats: Seat[]) => {
        return currentSeats.reduce((sum, seat) => {
            const priceCategoryCost = selectedSession?.priceCategory1 ?? PRICE_CATEGORY_1_COST;
            const priceCategory2Cost = selectedSession?.priceCategory2 ?? PRICE_CATEGORY_2_COST;
            const price = seat.priceCategory === 1 ? priceCategoryCost : priceCategory2Cost;
            return sum + price;
        }, 0);
    }, [selectedSession]);

    useEffect(() => {
        setIsLoadingData(true);
        setBookingError(null);

        const loadBookingDetails = async () => {
            try {
                let filmData: Film | undefined;
                if (filmIdFromUrl) { 
                    filmData = await fetchFilmById(filmIdFromUrl);
                    setSelectedFilm(filmData || null);
                } else if (sessionId) {
                    const sessionForFilmId = await fetchSessionById(sessionId);
                    if (sessionForFilmId?.filmId) {
                        filmData = await fetchFilmById(sessionForFilmId.filmId);
                        setSelectedFilm(filmData || null);
                    }
                }
                if (!filmData) {
                    throw new Error('Информация о фильме не найдена.');
                }
                let currentSessionData: Session | undefined;
                if (sessionId) {
                    currentSessionData = await fetchSessionById(sessionId);
                    setSelectedSession(currentSessionData || null);
                }

                if (!currentSessionData) {
                    throw new Error('Информация о сеансе не найдена.');
                }

                const allSeats: Seat[] = [];
                const sessionBookedSeats = currentSessionData.bookedSeats || [];
                const generalOccupiedSeats = dummyHallLayoutData.occupiedSeats || []; 

                dummyHallLayoutData.rows.forEach(row => {
                    for (let i = 1; i <= dummyHallLayoutData.seatsPerRow[row]; i++) {
                        const seatId = `${row}${i}`;
                        let status: Seat['status'] = 'available';

                        if (generalOccupiedSeats.includes(seatId)) {
                            status = 'occupied';
                        } else if (sessionBookedSeats.includes(seatId)) { 
                            status = 'booked';
                        }

                        const priceCategory = dummyHallLayoutData.priceMap[row]?.[i] ?? 1;
                        allSeats.push({
                            id: seatId,
                            row,
                            seatNumber: i,
                            status,
                            priceCategory,
                        });
                    }
                });
                setSeats(allSeats); 

            } catch (error) {
                console.error("Error loading booking data:", error);
                const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке данных';
                setBookingError(errorMessage);
            } finally {
                setIsLoadingData(false);
            }
        };
        if (sessionId) {
            loadBookingDetails();
        } else {
            setBookingError('Ошибка: ID сеанса не указан.'); 
            setIsLoadingData(false); 
        }

    }, [sessionId, filmIdFromUrl]); 

    const handleSeatClick = useCallback((seatId: string) => {
        const clickedSeat = seats.find(s => s.id === seatId);

        if (!clickedSeat || clickedSeat.status !== 'available') return;

        setSelectedSeats(prevSelected => {
            const isAlreadySelected = prevSelected.some(s => s.id === seatId);
            let newSelectedSeats: Seat[];

            if (isAlreadySelected) {
                newSelectedSeats = prevSelected.filter(s => s.id !== seatId);
            } else {
                newSelectedSeats = [...prevSelected, clickedSeat];
            }
            setTotalPrice(calculateTotalPrice(newSelectedSeats));
            return newSelectedSeats;
        });
    }, [seats, calculateTotalPrice]);

    const handleCancelSelection = () => {
        setSelectedSeats([]); 
        setTotalPrice(0);
    };

    const handleConfirmBooking = async (userName: string, userPhone: string) => {
        if (selectedSeats.length === 0) {
            setBookingError('Пожалуйста, выберите места!');
            return;
        }
        if (!selectedFilm || !selectedSession) {
            setBookingError('Данные фильма или сеанса не загружены.');
            return;
        }

        setIsSubmitting(true);
        setBookingError(null);

        const bookingRequestData: BookingInfo = {
            sessionId: selectedSession.id,
            filmTitle: selectedFilm.title,
            sessionTime: selectedSession.startTime,
            hallName: selectedSession.hall,
            selectedSeats,
            totalPrice,
            userName,
            userPhone,
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Payment successful (simulated)');
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Booking data sent:', bookingRequestData);

            alert(`Места успешно забронированы! Спасибо, ${userName}!`); 
            navigate(`/film/${selectedFilm.id}`); 
        } catch (err) {
            console.error("Booking or payment failed:", err);
            const errorMessage = err instanceof Error ? err.message : 'Ошибка бронирования или оплаты';
            setBookingError(`${errorMessage}. Пожалуйста, попробуйте снова.`);
        } finally {
            setIsSubmitting(false); 
        }
    };

    if (isLoadingData) {
        return <p className="text-center text-xl mt-10">Загрузка информации...</p>;
    }

    if (bookingError) {
        return <p className="text-center text-red-500 text-xl mt-10">{bookingError}</p>;
    }

    if (!selectedFilm || !selectedSession) {
        return <p className="text-center text-red-500 text-xl mt-10">Не удалось загрузить полные данные. Попробуйте обновить страницу.</p>;
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
