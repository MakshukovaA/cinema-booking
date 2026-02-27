import React from 'react';
import type { Session } from '../types/session';

type Props = {
  sessions?: Session[];
  onSessionClick?: (session: Session) => void;
};

const SessionList: React.FC<Props> = ({ sessions, onSessionClick }) => {
  const list = Array.isArray(sessions) ? sessions : [];

  if (list.length === 0) {
    return <div className="text-gray-500 text-center mt-6">Сеансы не найдены</div>;
  }

  return (
    <div className="space-y-2">
      {list.map((s) => (
        <div
          key={s.id}
          className="p-3 border rounded cursor-pointer"
          onClick={() => onSessionClick?.(s)}
        >
          <div className="font-semibold">
            {new Date(s.startTime).toLocaleString('ru-RU')}
          </div>
          <div className="text-sm text-gray-600">{s.hall}</div>
        </div>
      ))}
    </div>
  );
};

export default SessionList;