export interface Film {
  id:string | number;
  title: string;
  posterUrl?: string;      
  poster?: string;      
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