import React from 'react';
import { Link } from 'react-router-dom';

interface Session {
  id: string; 
  startTime: string;
  hall: string;
  availableSeats: number;
  totalSeats: number;
}

interface SessionItemProps {
  session: Session;
  filmId: string;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, filmId }) => {
  const isFullyBooked = session.availableSeats === 0;

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg mb-3 transition-colors duration-200
        ${isFullyBooked
          ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
          : 'bg-white border-gray-300 hover:bg-blue-50'
        }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
        <span className="text-xl font-semibold text-blue-700">{session.startTime}</span>
        <span className="text-gray-700">{session.hall}</span>
        <span className="text-sm text-gray-600">
          Свободно: {session.availableSeats} / {session.totalSeats}
        </span>
      </div>

      <Link
        to={`/booking/${session.id}?filmId=${filmId}`}
        className={`mt-3 sm:mt-0 px-5 py-2 rounded-md font-semibold transition-colors duration-200
          ${isFullyBooked
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        onClick={(e) => isFullyBooked && e.preventDefault()}
      >
        Выбрать места
      </Link>
    </div>
  );
};

export default SessionItem;