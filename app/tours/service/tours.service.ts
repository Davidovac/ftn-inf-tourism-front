import { Tour } from "../model/tour.model.js"
import { TourFormData } from "../model/tourFormData.model.js";

export class ToursService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:5105/api/tours";
  }

  getTours(guideIdStr: string): Promise<Tour[] | null> {
    const id = Number(guideIdStr);
    if (Number.isNaN(id)) {
      console.log("Invalid number format.");
      return null;
    }
    return fetch(this.apiUrl + "?" + id)
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, text: response.text };
        }
        return response.json();
      })
      .then((data) => {
        const users: Tour[] = [];
        for (const element of data.data) {
          //Pri zahtevu pregleda tura od strane drugih korisnika(potrosaca), implementirati getGuide metodu i dodati vodica ako je null
          const user: Tour = new Tour(
            element.id,
            element.name,
            element.description,
            element.dateTime,
            element.maxGuests,
            element.status,
            element.guide,
            element.guideId,
            element.keyPoints
          );
          users.push(user);
        }
        return users;
      })
      .catch((error) => {
        console.error("Error:", error.status);
        throw error;
      });
  }

  getById(id: string | null): Promise<Tour | null> {
    if (!id) {
      return null;
    }

    return fetch(this.apiUrl + "/" + id)
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
        return response.json();
      })
      .then((tour: Tour) => {
        return tour;
      })
      .catch((error) => {
        console.error("Error: " + error.status);
        throw error;
      });
  }

  addOrUpdate(reqBody: TourFormData): void {
    let method = "POST";
    let url = this.apiUrl;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      method = "PUT";
      url = this.apiUrl + "/" + id;
    }

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, text: response.text };
        }
        return response.json();
      })
      .then(() => {
        window.location.href = "../preview/tours.html";
      })
      .catch((error) => {
        console.error("Error: " + error.status);
        throw error;
      });
  }

  delete(id: number): Promise<number> {
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