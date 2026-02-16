// cinema-booking-frontend/src/types/film.ts
export interface Film {
  id: string;
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  genre: string;
  year?: number;
  rating?: number;
  director?: string;
  cast?: string;
  country?: string;
  backgroundImage?: string; 
  gallery?: string[];
}