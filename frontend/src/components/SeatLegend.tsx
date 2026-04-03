import React from 'react';

const SeatLegend: React.FC = () => {
  const legendItems = [
    { color: 'bg-gradient-to-br from-green-400 to-green-600', label: 'Стандарт (800 ₽)' },
    { color: 'bg-gradient-to-br from-blue-400 to-blue-600', label: 'VIP (1200 ₽)' },
    { color: 'bg-gradient-to-br from-purple-500 to-purple-700', label: 'Выбрано' },
    { color: 'bg-gradient-to-br from-gray-400 to-gray-600', label: 'Занято' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6 p-4 bg-white rounded-lg shadow">
      {legendItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded ${item.color}`} />
          <span className="text-sm text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;