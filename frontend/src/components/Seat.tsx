import React from 'react';
import type { Seat } from '../types/booking';

interface SeatProps {
  seat: Seat;
  isSelected: boolean;
  onClick: (seatId: string) => void;
  isInteractive?: boolean;
}

const SeatComponent: React.FC<SeatProps> = ({ seat, isSelected, onClick, isInteractive = true }) => {
  const getSeatClasses = () => {
    let baseClasses = 'w-10 h-10 m-1 rounded-lg flex items-center justify-center transition-all duration-200 font-bold text-sm ';
    
    if (!isInteractive || seat.status === 'booked' || seat.status === 'occupied') {
      baseClasses += 'cursor-not-allowed ';
    } else {
      baseClasses += 'cursor-pointer hover:scale-110 transform hover:shadow-lg ';
    }

    if (isSelected) {
      baseClasses += 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg ring-2 ring-purple-300 ring-offset-1';
    } else if (seat.status === 'booked' || seat.status === 'occupied') {
      baseClasses += 'bg-gradient-to-br from-gray-400 to-gray-600 text-gray-200';
    } else if (seat.status === 'available') {
      if (seat.priceCategory === 1) {
        baseClasses += 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:from-green-500 hover:to-green-700';
      } else {
        baseClasses += 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700';
      }
    } else {
      baseClasses += 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500';
    }

    return baseClasses;
  };

  const handleClick = () => {
    if (isInteractive && seat.status === 'available') {
      onClick(String(seat.id));
    }
  };

  const priceLabel = seat.priceCategory === 1 ? 'Стандарт (800 ₽)' : 'VIP (1200 ₽)';

  return (
    <div className="flex flex-col items-center">
      <div
        className={getSeatClasses()}
        onClick={handleClick}
        title={`Ряд ${seat.row}, Место ${seat.seatNumber} — ${priceLabel}`}
        role="button"
        aria-pressed={isSelected}
        aria-label={`Место ${seat.row}-${seat.seatNumber}, ${priceLabel}, ${seat.status === 'available' ? 'свободно' : 'занято'}`}
      >
        {seat.seatNumber}
      </div>
      {seat.seatNumber === 1 && (
        <span className="text-xs font-medium text-gray-500 mt-1">
          Ряд {seat.row}
        </span>
      )}
    </div>
  );
};

export default SeatComponent;