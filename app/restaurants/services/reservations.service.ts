import { Reservation } from "../models/reservation.modle";

export class ReservationService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:5105/api/restaurant/reservations";
  }

  create(reservation: Reservation): Promise<Reservation> {
    return fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Greška prilikom kreiranja rezervacije.");
          });
        }
        return response.json();
      })
      .catch((error) => {
        throw new Error(error.message || "Greška prilikom slanja rezervacije.");
    });
  }

  delete(id: number): Promise<void> {
    return fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((error) => {
        console.error(`Greška prilikom otkazivanja rezervacije ${id}:`, error.message);
        throw error;
      });
  }

  getByRestaurant(restaurantId: number, date?: string): Promise<Reservation[]> {
    let url = `${this.apiUrl}/${restaurantId}`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Greška pri pribavljanju rezervacija za restoran ${restaurantId}:`, error.message);
        throw error;
      });
  }

  getByUser(userId: number): Promise<Reservation[]> {
    const url = `${this.apiUrl}/user/${userId}`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Greška pri pribavljanju rezervacija za korisnika ${userId}:`, error.message);
        throw error;
      });
  }
}
