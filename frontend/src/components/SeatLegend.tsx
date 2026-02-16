import React from 'react';

const SeatLegend: React.FC = () => {
  const legendItems = [
    { color: 'bg-green-300', label: 'Свободно (Цена 1)' },
    { color: 'bg-blue-300', label: 'Свободно (Цена 2)' },
    { color: 'bg-purple-500', label: 'Ваши места' },
    { color: 'bg-red-500', label: 'Куплено' },
    { color: 'bg-gray-500', label: 'Забронировано' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className={`w-5 h-5 rounded ${item.color}`}></div>
          <span className="text-sm text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;