export interface Session {
  id: string | number;
  filmId: string | number; 
  startTime: string;
  hall: string;
  availableSeats: number;
  priceCategory1: number;
  priceCategory2: number; 
  totalSeats: number;
  bookedSeats: string[];
}