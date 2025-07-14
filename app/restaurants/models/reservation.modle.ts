import { Restaurant } from "./restaurant.model";
export interface Reservation {
  id?: number;
  restaurantId: number;
  restaurant? : Restaurant;
  userId: number;
  date: string;
  mealTime: string | "dorucak" | "rucak" | "vecera";
  numberOfPeople: number;
  createdAt?: string;
}
