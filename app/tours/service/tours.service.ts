import { Tour } from "../model/tour.model.js"
import { TourFormData } from "../model/tourFormData.model.js";
import { TourRatingData } from "../model/tourRatingData.model.js";
import { ToursData } from "../model/toursData.model.js";
import { ToursStatsData } from "../model/toursStatsData.model.js";

export class ToursService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:5105/api/tours";
  }

  getTours(page: string, pageSize: string, orderBy: string, orderDirection: string): Promise<ToursData | null> {
    if (isNaN(Number(page))){
      page = "1"
    }
    return fetch(this.apiUrl + "?page=" + page + "&pageSize=" + pageSize + "&orderBy=" + orderBy + "&orderDirection=" + orderDirection)
      .then((response) => {
        if (!response.ok) {
          return response.text().then(errorMessage => {
            throw { status: response.status, message: errorMessage }
            })
          }
        return response.json();
      })
      .then((responseData) => {
        const tours: Tour[] = [];
        for (const element of responseData.data) {
          const tour: Tour = new Tour(
            element.id,
            element.name,
            element.description,
            element.dateTime,
            element.maxGuests,
            element.status,
            element.guide,
            element.guideId,
            element.keyPoints,
            element.ratings
          );
          tours.push(tour);
        }
        const data = tours
        const totalCount = responseData.totalCount
        const toursData: ToursData = {data, totalCount}
        return toursData;
      })
      .catch((error) => {
        console.error("Error:", error.status);
        throw error;
      });
  }

  getToursByGuide(guideIdStr: string): Promise<Tour[] | null> {
    const id = Number(guideIdStr);
    if (Number.isNaN(id)) {
      console.log("Invalid number format.");
      return null;
    }
    return fetch(this.apiUrl + "?guideId=" + id)
      .then((response) => {
        if (!response.ok) {
          return response.text().then(errorMessage => {
            throw { status: response.status, message: errorMessage }
            })
          }
        return response.json();
      })
      .then((data) => {
        const tours: Tour[] = [];
        for (const element of data) {
          const tour: Tour = new Tour(
            element.id,
            element.name,
            element.description,
            element.dateTime,
            element.maxGuests,
            element.status,
            element.guide,
            element.guideId,
            element.keyPoints,
            element.ratings
          );
          tours.push(tour);
        }
        return tours;
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
          return response.text().then(errorMessage => {
            throw { status: response.status, message: errorMessage }
            })
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

  addOrUpdate(reqBody: TourFormData): Promise<Tour> | null {
    let method = "POST";
    let url = this.apiUrl;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      method = "PUT";
      url = this.apiUrl + "/" + id;
    }
    else if (reqBody.id && reqBody.id > 0){
      method = "PUT"
      url = this.apiUrl + "/" + reqBody.id
    }
    if (!reqBody.keyPoints || reqBody.keyPoints == null){
      reqBody.keyPoints = []
    }
    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(errorMessage => {
            throw { status: response.status, message: errorMessage }
            })
          }
        return response.json();
      })
      .then((data) => {
        return data
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
          return response.text().then(errorMessage => {
            throw { status: response.status, message: errorMessage }
            })
          }
        return id;
      })
      .catch((error) => {
        console.error("Error: " + error.status);
        throw error;
      });
  }

  addRating(reqBody: TourRatingData): Promise <string> {
    const method = "POST";
    const url = this.apiUrl + "/" + reqBody.tourId + "/ratings";

    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(errorMessage => { throw {message: new Error(errorMessage), status: response.status} });
          }
        return response.text();
      })
      .catch((error) => {
        console.error("Error: " + error.status, error.message.message);
        throw error;
      });
  }

  getToursStatsByGuide(guideId: string): Promise<ToursStatsData | null> {
    if (isNaN(Number(guideId))){
      throw {message: new Error("Nevalidan id vodica."), status: 404}
    }

    return fetch(this.apiUrl + "/stats?guideId=" + guideId)
      .then((response) => {
        if (!response.ok) {
          return response.text().then(errorMessage => {
            throw { status: response.status, message: errorMessage }
            })
          }
        return response.json();
      })
      .then((tours: ToursStatsData) => {
        return tours;
      })
      .catch((error) => {
        console.error("Error: " + error.status);
        throw error;
      });
  }
}