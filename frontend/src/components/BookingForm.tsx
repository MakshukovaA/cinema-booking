import React, { useState } from 'react';
import type { Seat } from '../types/booking';

interface BookingFormProps {
  onSubmit: (userName: string, userPhone: string) => void;
  selectedSeats: Seat[];
  isSubmitting: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  selectedSeats,
  isSubmitting,
}) => {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [errors, setErrors] = useState<{ userName?: string; userPhone?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors: { userName?: string; userPhone?: string } = {};
    if (!userName.trim()) formErrors.userName = 'Имя обязательно';
    if (!userPhone.trim()) formErrors.userPhone = 'Телефон обязателен';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (selectedSeats.length > 0) {
      onSubmit(userName, userPhone);
    } else {
      alert('Пожалуйста, выберите места перед бронированием.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Оформление бронирования</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="userName">
          Ваше имя
        </label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={`mt-1 block w-full p-2 border rounded ${errors.userName ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isSubmitting}
        />
        {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700" htmlFor="userPhone">
          Телефон
        </label>
        <input
          id="userPhone"
          type="tel"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          placeholder="+7 (XXX) XXX-XX-XX"
          className={`mt-1 block w-full p-2 border rounded ${errors.userPhone ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isSubmitting}
        />
        {errors.userPhone && <p className="text-red-500 text-sm mt-1">{errors.userPhone}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || selectedSeats.length === 0}
        className={`px-6 py-3 rounded-md font-semibold text-white transition-colors duration-200
          ${isSubmitting || selectedSeats.length === 0 ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-700'}`}
      >
        {isSubmitting ? 'Подтверждаем...' : 'Подтвердить бронирование'}
      </button>
    </form>
  );
};

export default BookingForm;