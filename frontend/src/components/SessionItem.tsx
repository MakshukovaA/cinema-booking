import React from 'react';
import { Link } from 'react-router-dom';
import type { Session } from '../types/session';

interface SessionItemProps {
  session: Session;
  filmId?: string;
}

const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const SessionItem: React.FC<SessionItemProps> = ({ session, filmId }) => {
  const isFullyBooked = (session.availableSeats ?? 0) === 0;
  const startDisplay = formatDate(session.startTime);

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg mb-3 transition-colors duration-200
        ${isFullyBooked 
          ? 'bg-gray-100 border-gray-300 text-gray-500' 
          : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
        }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
        <span className="text-lg font-semibold text-blue-700">{startDisplay}</span>
        <span className="text-gray-700 font-medium">{session.hall ?? '—'}</span>
        <span className="text-sm text-gray-600">
          Свободно: <span className="font-semibold">{session.availableSeats ?? 0}</span> / {session.totalSeats ?? 0}
        </span>
      </div>

      {isFullyBooked ? (
        <button
          disabled
          className="mt-3 sm:mt-0 px-5 py-2 rounded-md font-semibold bg-gray-400 text-white cursor-not-allowed"
        >
          Нет мест
        </button>
      ) : (
        <Link
          to={`/booking/${session.id}`}
          className="mt-3 sm:mt-0 px-5 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Выбрать места
        </Link>
      )}
    </div>
  );
};

export default SessionItem;