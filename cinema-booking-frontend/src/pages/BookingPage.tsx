// src/pages/BookingPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SeatMap from '../components/SeatMap';
import SeatLegend from '../components/SeatLegend';
import BookingSummary from '../components/BookingSummary';
import BookingForm from '../components/BookingForm';

// Импортируем типы
import type { Seat, HallLayout, BookingInfo } from '../types/booking';
import type { Film } from '../types/film';
import type { Session } from '../types/session';

// Импортируем функции для получения данных (убедитесь, что пути верные)
import { fetchSessionById, fetchFilmById } from '../data/mockData';

// Цены (можно получать из API/сессии, но для примера оставим константами)
const PRICE_CATEGORY_1_COST = 300;
const PRICE_CATEGORY_2_COST = 400;


// --- Заглушка данных для зала ---
// Важно: HallLayout должен содержать occupiedSeats
// bookedSeats должны приходить с данными сессии (selectedSession.bookedSeats)
const dummyHallLayoutData: HallLayout = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: { 'A': 10, 'B': 12, 'C': 12, 'D': 12, 'E': 12, 'F': 10, 'G': 8, 'H': 6 },
    occupiedSeats: ['G1', 'G2'], // Места, которые недоступны в принципе
    bookedSeats: [], // Это поле не используется для статической конфигурации зала
    priceMap: { // Карта категорий цен для каждого места
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
    const { sessionId } = useParams<{ sessionId: string }>(); // Получаем ID сеанса из URL
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null); // Сессия должна содержать bookedSeats

    const [seats, setSeats] = useState<Seat[]>([]); // Все доступные места
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]); // Выбранные места
    const [totalPrice, setTotalPrice] = useState<number>(0); // Общая стоимость

    const [isLoadingData, setIsLoadingData] = useState<boolean>(true); // Флаг загрузки
    const [bookingError, setBookingError] = useState<string | null>(null); // Ошибки
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Состояние отправки формы

    // Получаем filmId из query параметров, если он есть
    const queryParams = new URLSearchParams(location.search);
    const filmIdFromUrl = queryParams.get('filmId');

    // --- Функции ---

    // Расчет общей стоимости выбранных мест
    const calculateTotalPrice = useCallback((currentSeats: Seat[]) => {
        return currentSeats.reduce((sum, seat) => {
            const priceCategoryCost = selectedSession?.priceCategory1 ?? PRICE_CATEGORY_1_COST;
            const priceCategory2Cost = selectedSession?.priceCategory2 ?? PRICE_CATEGORY_2_COST;
            const price = seat.priceCategory === 1 ? priceCategoryCost : priceCategory2Cost;
            return sum + price;
        }, 0);
    }, [selectedSession]); // Зависит от цен в selectedSession

    // Загрузка данных фильма и сеанса при монтировании компонента
    useEffect(() => {
        setIsLoadingData(true);
        setBookingError(null);

        const loadBookingDetails = async () => {
            try {
                // 1. Загрузка данных фильма
                let filmData: Film | undefined;
                if (filmIdFromUrl) { // Если filmId есть в URL
                    filmData = await fetchFilmById(filmIdFromUrl);
                    setSelectedFilm(filmData || null);
                } else if (sessionId) { // Иначе, пытаемся получить ID фильма из сессии
                    const sessionForFilmId = await fetchSessionById(sessionId);
                    if (sessionForFilmId?.filmId) {
                        filmData = await fetchFilmById(sessionForFilmId.filmId);
                        setSelectedFilm(filmData || null);
                    }
                }

                // Если фильм не найден, выдаем ошибку
                if (!filmData) {
                    throw new Error('Информация о фильме не найдена.');
                }

                // 2. Загрузка данных сеанса (он должен содержать bookedSeats)
                let currentSessionData: Session | undefined;
                if (sessionId) {
                    currentSessionData = await fetchSessionById(sessionId);
                    setSelectedSession(currentSessionData || null);
                }

                // Если сессия не найдена, выдаем ошибку
                if (!currentSessionData) {
                    throw new Error('Информация о сеансе не найдена.');
                }

                // 3. Формирование списка всех мест с учётом статусов
                const allSeats: Seat[] = [];
                const sessionBookedSeats = currentSessionData.bookedSeats || []; // Места, забронированные для этого сеанса
                const generalOccupiedSeats = dummyHallLayoutData.occupiedSeats || []; // Места, недоступные всегда

                dummyHallLayoutData.rows.forEach(row => {
                    for (let i = 1; i <= dummyHallLayoutData.seatsPerRow[row]; i++) {
                        const seatId = `${row}${i}`;
                        let status: Seat['status'] = 'available';

                        if (generalOccupiedSeats.includes(seatId)) { // Сначала проверяем, занято ли место навсегда
                            status = 'occupied';
                        } else if (sessionBookedSeats.includes(seatId)) { // Если не занято навсегда, проверяем, забронировано ли для этого сеанса
                            status = 'booked';
                        }

                        // Получаем категорию цены для места
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
                setSeats(allSeats); // Устанавливаем все места

            } catch (error) {
                console.error("Error loading booking data:", error);
                const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке данных';
                setBookingError(errorMessage); // Сохраняем текст ошибки
            } finally {
                setIsLoadingData(false); // Заканчиваем загрузку
            }
        };

        // Запускаем загрузку, только если есть sessionId
        if (sessionId) {
            loadBookingDetails();
        } else {
            setBookingError('Ошибка: ID сеанса не указан.'); // Если sessionId отсутствует
            setIsLoadingData(false); // Останавливаем загрузку
        }

    }, [sessionId, filmIdFromUrl]); // Зависимости для перезапуска эффекта

    // --- Обработчики событий ---

    // Обработчик клика по месту
    const handleSeatClick = useCallback((seatId: string) => {
        const clickedSeat = seats.find(s => s.id === seatId);

        // Нельзя выбрать занятое или 'occupied' место
        if (!clickedSeat || clickedSeat.status !== 'available') return;

        setSelectedSeats(prevSelected => {
            const isAlreadySelected = prevSelected.some(s => s.id === seatId);
            let newSelectedSeats: Seat[];

            if (isAlreadySelected) {
                // Если место уже выбрано, удаляем его
                newSelectedSeats = prevSelected.filter(s => s.id !== seatId);
            } else {
                // Иначе, добавляем
                newSelectedSeats = [...prevSelected, clickedSeat];
            }
            // Обновляем общую стоимость
            setTotalPrice(calculateTotalPrice(newSelectedSeats));
            return newSelectedSeats;
        });
    }, [seats, calculateTotalPrice]); // Зависимости: массив мест и функция расчета цены

    // Отмена выбора мест
    const handleCancelSelection = () => {
        setSelectedSeats([]); // Сбрасываем выбранные места
        setTotalPrice(0);    // Сбрасываем стоимость
    };

    // Обработчик подтверждения бронирования
    const handleConfirmBooking = async (userName: string, userPhone: string) => {
        // Проверки перед отправкой
        if (selectedSeats.length === 0) {
            setBookingError('Пожалуйста, выберите места!');
            return;
        }
        if (!selectedFilm || !selectedSession) {
            setBookingError('Данные фильма или сеанса не загружены.');
            return;
        }

        setIsSubmitting(true); // Начинаем процесс отправки
        setBookingError(null);  // Очищаем предыдущие ошибки

        // Формируем данные для отправки
        const bookingRequestData: BookingInfo = {
            sessionId: selectedSession.id,
            filmTitle: selectedFilm.title,
            sessionTime: selectedSession.startTime,
            hallName: selectedSession.hall,
            selectedSeats, // Передаем выбранные места
            totalPrice,
            userName,
            userPhone,
        };

        try {
            // --- ЗАГЛУШКА ОПЛАТЫ И БРОНИРОВАНИЯ ---
            // Имитация асинхронных операций (замените на реальный API-вызов)
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Payment successful (simulated)');
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Booking data sent:', bookingRequestData);
            // Здесь должен быть реальный вызов API для создания бронирования

            alert(`Места успешно забронированы! Спасибо, ${userName}!`); // Сообщение пользователю
            // Перенаправляем на страницу фильма после успешного бронирования
            navigate(`/film/${selectedFilm.id}`); // Используем новый роут для FilmPage

        } catch (err) { // Обработка ошибок
            console.error("Booking or payment failed:", err);
            const errorMessage = err instanceof Error ? err.message : 'Ошибка бронирования или оплаты';
            setBookingError(`${errorMessage}. Пожалуйста, попробуйте снова.`);
        } finally {
            setIsSubmitting(false); // Завершаем процесс отправки
        }
    };

    // --- Рендеринг ---

    // Если данные загружаются
    if (isLoadingData) {
        return <p className="text-center text-xl mt-10">Загрузка информации...</p>;
    }

    // Если есть ошибка
    if (bookingError) {
        return <p className="text-center text-red-500 text-xl mt-10">{bookingError}</p>;
    }

    // Если данные не загрузились (но нет ошибок)
    if (!selectedFilm || !selectedSession) {
        return <p className="text-center text-red-500 text-xl mt-10">Не удалось загрузить полные данные. Попробуйте обновить страницу.</p>;
    }

    // Основной рендеринг страницы бронирования
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Бронирование билетов: {selectedFilm.title}
            </h2>
            <p className="text-center text-gray-600 mb-6">
                Сеанс: {new Date(selectedSession.startTime).toLocaleString('ru-RU')} | Зал: {selectedSession.hall}
            </p>

            {/* Компонент с картой мест */}
            <SeatMap seats={seats} onSeatClick={handleSeatClick} />
            {/* Легенда к карте мест */}
            <SeatLegend />

            {/* Отображаем сводку и форму, только если места выбраны */}
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

            {/* Кнопка отмены выбора */}
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
