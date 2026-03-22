import React from 'react';
import type { Seat } from '../types/booking';

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, onSeatClick }) => {
  const seatsByRow = seats.reduce((acc, seat) => {
    const key = seat.row;
    if (!acc[key]) acc[key] = [];
    acc[key].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  const sortedRows = Object.keys(seatsByRow).map(k => Number(k)).sort((a, b) => a - b);

  const SeatButton: React.FC<{ seat: Seat; onClick: () => void; disabled?: boolean }> = ({
    seat,
    onClick,
    disabled,
  }) => {
    const base = 'w-8 h-8 border rounded flex items-center justify-center text-xs';
    const className =
      seat.status === 'available'
        ? 'bg-white hover:bg-gray-100'
        : seat.status === 'booked' || seat.status === 'occupied'
        ? 'bg-gray-300 cursor-not-allowed'
        : 'bg-green-300';
    return (
      <button
        type="button"
        className={`${base} ${className}`}
        onClick={onClick}
        disabled={disabled || seat.status !== 'available'}
        aria-label={`Seat ${seat.row}-${seat.seatNumber}`}
      >
        {seat.seatNumber}
      </button>
    );
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="text-center text-sm text-gray-600 mb-2">Экран</div>
      {sortedRows.map((row) => (
        <div key={row} className="flex justify-center items-center gap-2 mb-1">
          <span className="text-xs w-6 text-right text-gray-600">{row}</span>
          {seatsByRow[row]
            .slice()
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((seat) => (
              <SeatButton
                key={String(seat.id)}
                seat={seat}
                onClick={() => onSeatClick(String(seat.id))}
                disabled={seat.status !== 'available'}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default SeatMap;