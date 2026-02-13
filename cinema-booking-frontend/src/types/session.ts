export interface Session {
  id: string;
  filmId: string;
  startTime: string;
  hall: string;
  availableSeats: number;
  priceCategory1?: number;
  priceCategory2?: number; 
  totalSeats: number;
  bookedSeats: string[];  
}
