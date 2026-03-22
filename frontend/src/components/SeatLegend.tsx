import React from 'react';

const SeatLegend: React.FC = () => {
  const legendItems = [
    { color: 'bg-green-300', label: 'Свободно' },
    { color: 'bg-blue-300', label: 'Зарезервировано' },
    { color: 'bg-gray-300', label: 'Занято' },
    { color: 'bg-green-600', label: 'Выбрано' },
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