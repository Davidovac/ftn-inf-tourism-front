import { Tour } from "./tour.model";

export interface ReservationFormData {
  id: number;
  guestsCount: number;
  userId: number;
  tourId: number;
  tour?: Tour
}