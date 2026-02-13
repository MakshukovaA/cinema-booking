import React from 'react';
import type { Seat } from '../types/booking';

interface SeatProps {
  seat: Seat;
  onClick: (seatId: string) => void;
  isInteractive?: boolean;
}

const SeatComponent: React.FC<SeatProps> = ({ seat, onClick, isInteractive = true }) => {
  const getSeatClasses = () => {
    let baseClasses = 'w-10 h-10 m-1 rounded-lg flex items-center justify-center transition-all duration-200 font-bold text-sm ';
    
    if (!isInteractive) {
      baseClasses += 'cursor-default ';
    } else if (seat.status === 'available') {
      baseClasses += 'cursor-pointer hover:scale-110 transform hover:shadow-lg ';
    } else {
      baseClasses += 'cursor-not-allowed ';
    }

    switch (seat.status) {
      case 'available':
        if (seat.priceCategory === 1) {
          baseClasses += 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:from-green-500 hover:to-green-700';
        } else {
          baseClasses += 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700';
        }
        break;
      case 'selected':
        baseClasses += 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg ring-2 ring-purple-300 ring-offset-1';
        break;
      case 'occupied':
        baseClasses += 'bg-gradient-to-br from-red-500 to-red-700 text-white opacity-80';
        break;
      case 'booked':
        baseClasses += 'bg-gradient-to-br from-gray-400 to-gray-600 text-gray-200';
        break;
      default:
        baseClasses += 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500';
    }

    return baseClasses;
  };

  const getPriceLabel = () => {
    return seat.priceCategory === 1 ? 'Стандарт' : 'VIP';
  };

  const handleClick = () => {
    if (seat.status === 'available' && isInteractive) {
      onClick(seat.id);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={getSeatClasses()}
        onClick={handleClick}
        title={`Ряд ${seat.row}, Место ${seat.seatNumber} (${getPriceLabel()}: ${seat.priceCategory === 1 ? '800 ₽' : '1200 ₽'})`}
      >
        {seat.seatNumber}
      </div>
      <div className="mt-1 flex flex-col items-center">
        {/* Row indicator on top for first seat in row */}
        {seat.seatNumber === 1 && (
          <span className="text-xs font-medium text-gray-500 mb-1">
            Ряд {seat.row}
          </span>
        )}
        {/* Price indicator */}
        {seat.status === 'available' && (
          <span className="text-xs font-semibold text-gray-700">
            {seat.priceCategory === 1 ? '800₽' : '1200₽'}
          </span>
        )}
      </div>
    </div>
  );
};

export default SeatComponent;