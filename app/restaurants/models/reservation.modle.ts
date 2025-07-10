export interface Reservation {
  id?: number;
  restaurantId: number;
  userId: number;
  date: string;
  mealTime: string | "dorucak" | "rucak" | "vecera";
  numberOfPeople: number;
  createdAt?: string;
}
