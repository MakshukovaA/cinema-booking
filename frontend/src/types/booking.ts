export interface Seat {
  id: string | number;
  row: number;
  seatNumber: number;
  status: 'available' | 'booked' | 'occupied' | 'selected';
  priceCategory: 1 | 2;
}

export interface HallLayout {
  rows: string[];
  seatsPerRow: Record<string, number>;
  occupiedSeats: string[];
  bookedSeats: string[];
  priceMap: Record<string, Record<number, number>>;
}

export interface BookingInfo {
  sessionId:string | number;
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
