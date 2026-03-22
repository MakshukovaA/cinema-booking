import React from 'react';
import type { Film } from '../types/film';
import { getFallbackImage } from '../utilses/imageUtils';

interface FilmDetailsProps {
  film: Film;
}

const FilmDetails: React.FC<FilmDetailsProps> = ({ film }) => {
  const idForImage: string | undefined = film.id != null ? String(film.id) : undefined;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    type: 'poster' | 'background' | 'gallery',
    index?: number
  ) => {
    const target = e.currentTarget;
    target.src = getFallbackImage(type, idForImage, index);
    target.onerror = null;
  };

  const formatDuration = (minutes?: number | string): string => {
    const m = Number(minutes);
    if (!Number.isFinite(m) || isNaN(m)) {
      return '—';
    }
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return hours > 0 ? `${hours}ч ${mins}мин` : `${mins}мин`;
  };

  const posterSrc = film.posterUrl ?? '';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={`${film.title} poster`}
            onError={(e) => handleImageError(e, 'poster', 0)}
            style={{ width: 200, height: 'auto', objectFit: 'cover' }}
          />
        ) : (
          // Если постера нет, можно подгрузить fallback
          <img
            src={getFallbackImage('poster', idForImage, 0)}
            alt="fallback poster"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 text-lg mb-6">
        {film.year && (
          <div className="flex items-center gap-2">
            <span>{film.year}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span>{formatDuration(film.duration)}</span>
        </div>
        {film.rating && (
          <div className="flex items-center gap-2">
            <span className="font-bold">{film.rating.toFixed(1)}</span>
            <span className="text-gray-300">/10</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmDetails;