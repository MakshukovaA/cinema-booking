import React from 'react';
import type { Film } from '../types/film';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  film: Film; 
}

const MovieCard: React.FC<MovieCardProps> = ({ film }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <Link to={`/film/${film.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden h-80">
          <img 
            src={film.posterUrl} 
            alt={film.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white">
              <button className="w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-colors">
                Подробнее →
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
              {film.title}
            </h3>
            {film.year && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {film.year}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">
                <span className="font-semibold">{formatDuration(film.duration)}</span>
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{film.genre}</span>
            </div>
          </div>
          
          {/* Description preview */}
          {film.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {film.description}
            </p>
          )}
          
          {/* Additional info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-500">
                {film.duration} мин
              </span>
            </div>
            
            {/* Action button */}
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
              Купить билет
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;