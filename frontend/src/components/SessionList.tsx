import React from 'react';
import SessionItem from './SessionItem';

// Примерный тип для сеанса
interface Session {
  id: string;
  startTime: string;
  hall: string;
  availableSeats: number;
  totalSeats: number;
}

interface SessionListProps {
  sessions: Session[]; // Компонент принимает массив сеансов
  filmId: string; // Передаем filmId для SessionItem
}

const SessionList: React.FC<SessionListProps> = ({ sessions, filmId }) => {
  if (!sessions || sessions.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Сеансы для этого фильма пока не добавлены.</p>;
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
      <h3 className="text-2xl font-semibold text-gray-800 mb-5">Сеансы</h3>
      {sessions.map(session => (
        <SessionItem key={session.id} session={session} filmId={filmId} />
      ))}
    </div>
  );
};

export default SessionList;