import React from 'react';
import type { Film } from '../types/film';

interface FilmDetailsProps {
  film: Film;
}

const FilmDetails: React.FC<FilmDetailsProps> = ({ film }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}мин`;
  };

  const getLocalImageUrl = (imageName: string) => {
    return `/img/${imageName}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-purple-900 text-white rounded-2xl overflow-hidden mb-8">
        <div className="relative">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: film.backgroundImage 
                ? `url(${getLocalImageUrl(film.backgroundImage)})`
                : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
            }}
          ></div>
          
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img 
                  src={film.posterUrl.startsWith('http') 
                    ? film.posterUrl 
                    : getLocalImageUrl(film.posterUrl)
                  } 
                  alt={film.title}
                  className="w-64 h-96 object-cover rounded-xl shadow-2xl"
                />
              </div>
              
              {/* Film Info */}
              <div className="flex-grow">
                <div className="mb-6">
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm mb-4">
                    {film.genre}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{film.title}</h1>
                  
                  {film.year && (
                    <div className="flex items-center gap-6 text-lg mb-6">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{film.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatDuration(film.duration)}</span>
                      </div>
                      {film.rating && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-bold">{film.rating.toFixed(1)}</span>
                          <span className="text-gray-300">/10</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Описание</h2>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {film.description}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {film.director && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <h3 className="font-semibold mb-2 text-blue-200">Режиссер</h3>
                      <p>{film.director}</p>
                    </div>
                  )}
                  {film.country && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <h3 className="font-semibold mb-2 text-blue-200">Страна</h3>
                      <p>{film.country}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Смотреть трейлер
          </div>
        </button>
        
        <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Добавить в избранное
          </div>
        </button>
        
        <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Купить билет
          </div>
        </button>
      </div>
    </div>
  );
};

export default FilmDetails;