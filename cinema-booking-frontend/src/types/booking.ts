export interface Seat {
  id: string;
  row: string;
  seatNumber: number;
  status: 'available' | 'booked' | 'occupied' | 'selected';
  priceCategory: number;
}

export interface HallLayout {
  rows: string[];
  seatsPerRow: Record<string, number>;
  occupiedSeats: string[];
  bookedSeats: string[];
  priceMap: Record<string, Record<number, number>>;
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

export interface BookingFormData {
  userName: string;
  userPhone: string;
  email?: string; 
}