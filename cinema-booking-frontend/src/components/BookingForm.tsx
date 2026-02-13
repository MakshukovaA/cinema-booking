import React, { useState } from 'react';
import type { Seat } from '../types/booking';

interface BookingFormProps {
  onSubmit: (userName: string, userPhone: string) => void;
  selectedSeats: Seat[];
  isSubmitting: boolean; 
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, selectedSeats, isSubmitting }) => {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [errors, setErrors] = useState<{ userName?: string; userPhone?: string }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formErrors: { userName?: string; userPhone?: string } = {};
    if (!userName.trim()) {
      formErrors.userName = 'Имя пользователя обязательно';
    }
    if (!userPhone.trim()) {
      formErrors.userPhone = 'Телефон обязателен';
    }

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
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
          Ваше имя
        </label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.userName ? 'border-red-500' : 'border-gray-300'}`}
          required
          disabled={isSubmitting}
        />
        {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700">
          Телефон
        </label>
        <input
          type="tel"
          id="userPhone"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.userPhone ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="+7 (XXX) XXX-XX-XX"
          required
          disabled={isSubmitting}
        />
        {errors.userPhone && <p className="text-red-500 text-sm mt-1">{errors.userPhone}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || selectedSeats.length === 0}
        className={`mt-4 px-6 py-3 rounded-md font-semibold text-white transition-colors duration-200
          ${isSubmitting || selectedSeats.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-700'
          }`}
      >
        {isSubmitting ? 'Подтверждаем...' : 'Подтвердить бронирование'}
      </button>
    </form>
  );
};

export default BookingForm;