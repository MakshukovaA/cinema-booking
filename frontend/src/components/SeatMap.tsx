import React from 'react';
import Seat from './Seat';
import type { Seat as SeatType } from '../types/booking';

interface SeatMapProps {
  seats: SeatType[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onSeatClick }) => {
  const seatsByRow = seats.reduce((acc, seat) => {
    const key = seat.row;
    if (!acc[key]) acc[key] = [];
    acc[key].push(seat);
    return acc;
  }, {} as Record<number, SeatType[]>);

  const sortedRows = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b);

  if (seats.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-500">Схема зала недоступна</p>
        <p className="text-sm text-gray-400 mt-2">Обратитесь в кассу кинотеатра</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl">
      <div className="text-center mb-6">
        <div className="w-3/4 mx-auto h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-2" />
        <span className="text-sm text-gray-400 uppercase tracking-wider">Экран</span>
      </div>

      <div className="space-y-2">
        {sortedRows.map((row) => (
          <div key={row} className="flex justify-center items-center gap-1">
            <span className="text-xs w-8 text-right text-gray-400 font-medium mr-2">
              {row}
            </span>
            {seatsByRow[row]
              .slice()
              .sort((a, b) => a.seatNumber - b.seatNumber)
              .map((seat) => (
                <Seat
                  key={String(seat.id)}
                  seat={seat}
                  isSelected={selectedSeats.includes(String(seat.id))}
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