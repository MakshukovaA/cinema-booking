import React from 'react';
import SeatComponent from './Seat';
import type { Seat } from '../types/booking';

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, onSeatClick }) => {
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-inner overflow-x-auto">
      <div className="flex flex-col items-center">
        <div className="text-center text-white text-lg font-semibold mb-4">Экран</div>
        {sortedRows.map(row => (
          <div key={row} className="flex justify-center mb-1">
            <span className="text-gray-400 w-8 flex items-center justify-center mr-2 text-sm">{row}</span>
            {seatsByRow[row].map(seat => (
              <SeatComponent
                key={seat.id}
                seat={seat}
                onClick={onSeatClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;