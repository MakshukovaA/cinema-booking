import React from 'react';
import MovieCard from './MovieCard'; 
import type { Film } from '../types/film';

interface MovieListProps {
  films: Film[];
}

const MovieList: React.FC<MovieListProps> = ({ films }) => {
  if (!films || films.length === 0) {
    return <p className="text-center text-gray-500">Фильмы пока не найдены.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {films.map(film => (
        <MovieCard key={film.id} film={film} />
      ))}
    </div>
  );
};

export default MovieList;