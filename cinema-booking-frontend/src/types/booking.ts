export interface Seat {
  id: string;
  row: string;
  seatNumber: number;
  status: 'available' | 'booked' | 'selected' | 'occupied';
  priceCategory: 1 | 2;
}

export interface BookingInfo {
  sessionId: string;
  filmTitle: string;
  sessionTime: string;
  hallName: string;
  selectedSeats: Seat[];
  totalPrice: number;
  userName: string;
  userPhone: string;
}

export interface HallLayout {
  rows: string[];
  seatsPerRow: Record<string, number>;
  occupiedSeats: string[];
  bookedSeats: string[];
  priceMap: Record<string, Record<number, 1 | 2>>; 
}

export interface BookingFormData {
  userName: string;
  userPhone: string;
}