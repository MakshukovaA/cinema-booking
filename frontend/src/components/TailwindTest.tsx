import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold mb-4">Tailwind CSS Test</h2>

      <div className="flex flex-wrap gap-2">
        {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'].map(color => (
          <div key={color} className={`w-12 h-12 ${color} rounded`}></div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(num => (
          <div key={num} className="bg-gray-100 p-4 rounded">
            Card {num}
          </div>
        ))}
      </div>

      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Hover me
      </button>
    </div>
  );
};

export default TailwindTest;