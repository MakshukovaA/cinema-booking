import React from 'react';
import { Link } from 'react-router-dom';

interface Session {
  id: string;       // ID сеанса
  startTime: string; // Время начала (например, "20:00")
  hall: string;    // Название зала
  availableSeats: number; // Количество доступных мест
  totalSeats: number; // Общее количество мест в зале
}

interface SessionItemProps {
  session: Session;
  filmId: string; // Нужен filmId, чтобы построить ссылку на бронирование
}

const SessionItem: React.FC<SessionItemProps> = ({ session, filmId }) => {
  const isFullyBooked = session.availableSeats === 0; // Проверяем, занят ли сеанс полностью

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg mb-3 transition-colors duration-200
        ${isFullyBooked
          ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed' // Стиль для полностью занятого сеанса
          : 'bg-white border-gray-300 hover:bg-blue-50' // Стиль для доступного сеанса
        }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
        <span className="text-xl font-semibold text-blue-700">{session.startTime}</span>
        <span className="text-gray-700">{session.hall}</span>
        <span className="text-sm text-gray-600">
          Свободно: {session.availableSeats} / {session.totalSeats}
        </span>
      </div>

      {/* Кнопка выбора мест */}
      <Link
        to={`/booking/${session.id}?filmId=${filmId}`} // Передаем filmId как query-параметр для возможного использования
        className={`mt-3 sm:mt-0 px-5 py-2 rounded-md font-semibold transition-colors duration-200
          ${isFullyBooked
            ? 'bg-gray-400 text-white cursor-not-allowed' // Неактивная кнопка
            : 'bg-blue-600 text-white hover:bg-blue-700' // Активная кнопка
          }`}
        // Disable link if session is fully booked (optional, UI is disabled too)
        onClick={(e) => isFullyBooked && e.preventDefault()}
      >
        Выбрать места
      </Link>
    </div>
  );
};

export default SessionItem;