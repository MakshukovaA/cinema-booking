import React from 'react';
import { Link } from 'react-router-dom';
import type { Session } from '../types/session';

interface SessionListProps {
  sessions: Session[];
}

const formatDateTime = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleString('ru-RU');
};

const SessionList: React.FC<SessionListProps> = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return <div className="text-center text-gray-500">Сеансы не найдены</div>;
  }

  return (
    <div className="space-y-4">
      {sessions.map((s) => (
        <div key={s.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="text-sm font-semibold">{formatDateTime(s.startTime)}</div>
            <div className="text-xs text-gray-500">Зал: {s.hall}</div>
          </div>
          <Link
            to={`/booking/${s.id}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
          >
            Забронировать
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SessionList;