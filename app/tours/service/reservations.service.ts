import { Reservation } from "../model/reservation.model.js";
import { ReservationData } from "../model/reservationData.model.js";
import { ReservationFormData } from "../model/reservationFormData.model.js";

export class ReservationsService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:5105/api/reservations";
  }

  getByUser(userIdStr: string): Promise<ReservationData | null> {
      const id = Number(userIdStr);
      if (Number.isNaN(id)) {
        console.log("Invalid number format.");
        return null;
      }
      return fetch(this.apiUrl + "?userId=" + id)
        .then((response) => {
          if (!response.ok) {
            throw { status: response.status, text: response.text };
          }
          return response.json();
        })
        .then((responseData) => {
          const reservations: Reservation[] = [];
          for (const element of responseData.data) {
            const reservation: Reservation = new Reservation(
              element.id,
              element.guestsCount,
              element.user,
              element.userId,
              element.tour,
              element.tourId
            );
            reservations.push(reservation);
          }
          const data = reservations
          const totalCount = responseData.totalCount
          const reservationData: ReservationData = {data, totalCount}
          return reservationData;
        })
        .catch((error) => {
          console.error("Error:", error.status);
          throw error;
        });
    }

  create(reservation: ReservationFormData): Promise<Reservation | null> {
    const method = "POST";
    const url = this.apiUrl;

    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, text: response.text };
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error: " + error.status);
        throw error;
      });
  }

  delete(reservationid: string): Promise<number> {
    const id = Number(reservationid);
      if (Number.isNaN(id)) {
        console.log("Invalid number format.");
        return null;
      }

    return fetch(this.apiUrl + "/" + id, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, text: response.text };
        }
        return response.status;
      })
      .catch((error) => {
        console.error("Error: " + error.status);
        throw error;
      });
    }
}