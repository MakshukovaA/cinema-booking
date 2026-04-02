export type Film = {
  id: string;
  filmId?: string; // опционально
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  genre: string;
  year: number;
  rating: number;
  director: string;
  cast: string[];      // <-- массив
  country: string;
  backgroundImage: string;
  gallery: string[];   // <-- массив
};