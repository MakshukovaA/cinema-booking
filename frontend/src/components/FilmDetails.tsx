import React from 'react';
import type { Film } from '../types/film';
import { getFallbackImage } from '../utils/imageUtils';

interface FilmDetailsProps {
  film: Film;
}

const FilmDetails: React.FC<FilmDetailsProps> = ({ film }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, type: 'poster' | 'background' | 'gallery', index?: number) => {
    const target = e.currentTarget;
    target.src = getFallbackImage(type, film.id, index);
    target.onerror = null;
  };

  // Устойчивое форматирование длительности
  const formatDuration = (minutes?: number | string): string => {
    const m = Number(minutes);
    if (!Number.isFinite(m) || isNaN(m)) {
      return '—';
    }
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return hours > 0 ? `${hours}ч ${mins}мин` : `${mins}мин`;
  };

  const hasBackgroundImage = film.backgroundImage && film.backgroundImage !== '';

  return (
    <div className="max-w-7xl mx-auto">
      {/* ... остальной JSX без изменений ... */}
      <div className="flex flex-wrap items-center gap-6 text-lg mb-6">
        {film.year && (
          <div className="flex items-center gap-2">
            {/* иконки остаются без изменений */}
            <span>{film.year}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          {/* иконка длительности */}
          <span>{formatDuration(film.duration)}</span>
        </div>
        {film.rating && (
          <div className="flex items-center gap-2">
            {/* рейтинг рендерится так же, как есть */}
            <span className="font-bold">{film.rating.toFixed(1)}</span>
            <span className="text-gray-300">/10</span>
          </div>
        )}
      </div>
      {/* ... остальной JSX без изменений ... */}
    </div>
  );
};

export default FilmDetails;