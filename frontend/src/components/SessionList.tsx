import React from 'react';
import type { Session } from '../types/session';
import SessionItem from './SessionItem';

interface SessionListProps {
  sessions: Session[];
  filmId?: string;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, filmId }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Сеансы не найдены</p>
        <p className="text-gray-400 text-sm mt-2">Попробуйте выбрать другую дату</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Расписание сеансов</h3>
      {sessions.map((session) => (
        <SessionItem key={session.id} session={session} filmId={filmId} />
      ))}
    </div>
  );
};

export default SessionList;