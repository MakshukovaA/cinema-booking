export interface Film {
  id: string;
  title: string;
  posterUrl: string; // Можно использовать либо URL, либо имя файла из папки img
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