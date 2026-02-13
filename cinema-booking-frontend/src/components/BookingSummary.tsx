import React from 'react';
import type { Seat } from '../types/booking';

interface BookingSummaryProps {
  selectedSeats: Seat[];
  totalPrice: number;
  filmTitle: string;
  sessionTime: string;
  hallName: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedSeats,
  totalPrice,
  filmTitle,
  sessionTime,
  hallName,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ваш заказ</h3>
      <div className="mb-4">
        <p className="text-lg font-medium">{filmTitle}</p>
        <p className="text-gray-600">{sessionTime}, {hallName}</p>
      </div>
      <div className="mb-4">
        <p className="font-medium">Выбранные места:</p>
        {selectedSeats.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
            {selectedSeats.map(seat => (
              <li key={seat.id}>{seat.row}{seat.seatNumber} (Цена: {seat.priceCategory === 1 ? 'Цена 1' : 'Цена 2'})</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Места еще не выбраны.</p>
        )}
      </div>
      <div className="flex justify-between items-center font-bold text-xl mt-5 pt-4 border-t border-gray-200">
        <span>Итого:</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
};

export default BookingSummary;