import { create } from 'zustand';
import type { Schedule, Station, SeatClass, SeatLock, SavedPassenger } from '@/types';

interface SelectedSchedule {
  schedule: Schedule;
  departureStation: Station;
  arrivalStation: Station;
  selectedClass: SeatClass;
  classPrice: number;
}

interface PassengerEntry {
  full_name: string;
  id_number: string;
  seat_id?: string;
}

interface BookingState {
  selectedSchedule: SelectedSchedule | null;
  passengers: PassengerEntry[];
  seatLock: SeatLock | null;

  setSelectedSchedule: (data: SelectedSchedule) => void;
  setPassengers: (passengers: PassengerEntry[]) => void;
  setSeatLock: (lock: SeatLock | null) => void;
  reset: () => void;
}

const useBookingStore = create<BookingState>((set) => ({
  selectedSchedule: null,
  passengers: [],
  seatLock: null,

  setSelectedSchedule: (data) => set({ selectedSchedule: data }),
  setPassengers: (passengers) => set({ passengers }),
  setSeatLock: (lock) => set({ seatLock: lock }),
  reset: () => set({ selectedSchedule: null, passengers: [], seatLock: null }),
}));

export default useBookingStore;
export type { SelectedSchedule, PassengerEntry };
