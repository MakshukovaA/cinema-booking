export type Session = {
  id: string;
  filmId: string;
  startTime: string;
  hall: string;
  availableSeats: number;
  totalSeats: number;
  bookedSeats: string[]; // ["row-number", ...]
  priceCategory1: number;
  priceCategory2: number;
};