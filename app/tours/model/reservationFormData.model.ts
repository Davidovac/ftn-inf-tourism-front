import { User } from "../../users/model/user.model.js";
import { Tour } from "./tour.model.js";

export interface ReservationFormData {
  id: number;
  guestsCount: number;
  user?: User;
  userId: number;
  tour: Tour;
  tourId: number;
}