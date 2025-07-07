import { Reservation } from "./reservation.model.js";

export interface ReservationData {
    data: Reservation[],
    totalCount: number
}