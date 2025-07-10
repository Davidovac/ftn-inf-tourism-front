//import { KeyPoint } from "../model/keyPoint.model.js";
import { KeyPointsData } from "../model/keyPointsData.model.js";

export class KeyPointService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:5105/api/key-points";
  }

  getKeyPoints(page: string): Promise<KeyPointsData | null> {
    if (Number.isNaN(page) || page === null || page === "null") {
      console.log("Invalid number format.");
      return null;
    }
    else if (Number(page) < 1){
      console.log("Invalid page number.");
      return null;
    }
    return fetch(this.apiUrl + "?page=" + page)
      .then((response) => {
        if (!response.ok) {
          return response.text().then(errorMessage => {
            throw { status: response.status, message: errorMessage }
            })
          }
        return response.json();
      })
      .then((data) => {
        //const kps: KeyPoint[] = [];
        const keyPointsData: KeyPointsData = data
        /*for (const element of data.data) {
          const user: KeyPoint = new KeyPoint(
            element.id,
            element.order,
            element.name,
            element.description,
            element.imageUrl,
            element.latitude,
            element.longitude,
            element.tourId,
          );
          kps.push(user);
        }*/
        return keyPointsData;
      })
      .catch((error) => {
        console.error("Error:", error.status);
        throw error;
      });
  }
}