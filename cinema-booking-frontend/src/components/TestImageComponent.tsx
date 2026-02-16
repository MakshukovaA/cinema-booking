// TestImageComponent.tsx
import React from 'react';

const TestImageComponent: React.FC = () => {
  const testImages = [
    { name: 'Interstellar_2014.jpg', path: '/img/Interstellar_2014.jpg' },
    { name: 'Poster_начало.jpg', path: '/img/Poster_начало.jpg' },
    { name: 'Дюна_постер.jpg', path: '/img/Дюна_постер.jpg' },
    { name: 'Тёмный_рыцарь_постер.jpg', path: '/img/Тёмный_рыцарь_постер.jpg' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Тест изображений</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Проверка путей:</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2">Текущий URL: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.href}</code></p>
          <p>Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.origin}</code></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testImages.map((img, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">{img.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Путь: <code>{img.path}</code></p>
            
            <div className="relative h-64">
              <img
                src={img.path}
                alt={img.name}
                className="w-full h-full object-contain border"
                onLoad={() => console.log(`✅ ${img.name} загружен успешно`)}
                onError={(e) => {
                  console.error(`❌ Ошибка загрузки ${img.name}:`, e);
                  console.log('Полный URL:', new URL(img.path, window.location.origin).href);
                  e.currentTarget.src = '/img/placeholder.jpg';
                }}
              />
              
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Тест
              </div>
            </div>
            
            <button
              onClick={() => {
                console.log(`Проверка ${img.name}:`);
                console.log('Путь:', img.path);
                console.log('Полный URL:', new URL(img.path, window.location.origin).href);
                
                // Проверка доступности
                fetch(img.path)
                  .then(response => {
                    console.log('Статус:', response.status);
                    console.log('OK:', response.ok);
                  })
                  .catch(error => {
                    console.error('Fetch error:', error);
                  });
              }}
              className="mt-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Проверить
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Консоль браузера:</h2>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-40 overflow-auto">
          <p>Откройте консоль разработчика (F12) для просмотра логов</p>
        </div>
      </div>
    </div>
  );
};

export default TestImageComponent;