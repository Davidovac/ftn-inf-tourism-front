import { Restaurant } from "../models/restaurant.model";
import { Meal } from "../models/meal.model";

export class RestaurantService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'http://localhost:5105/api/restaurants';
  }

  getAll(): Promise<Restaurant[]> {
    return fetch(this.apiUrl)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .catch(error => {
        console.error("Error fetching all restaurants:", error.message);
        throw error;
      });
  }

  getByOwner(ownerId: number): Promise<Restaurant[]> {
    return fetch(`${this.apiUrl}?ownerId=${ownerId}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .catch(error => {
        console.error(`Error fetching restaurants for owner ${ownerId}:`, error.message);
        throw error;
      });
  }

  getPaged(ownerId: number = 0,page: number, pageSize: number, orderBy: string = "Name", orderDirection: "ASC" | "DESC" = "ASC"): Promise<Restaurant[]> {
  const url = `${this.apiUrl}?ownerId=${ownerId}&page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text); });
      }
      return response.json();
    })
    .catch(error => {
      console.error(`Error fetching paginated restaurants:`, error.message);
      throw error;
    });
}

  create(restaurant: Restaurant): Promise<void> {
    return fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurant),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
      })
      .catch(error => {
        console.error("Error creating restaurant:", error.message);
        throw error;
      });
  }

  update(id: number, restaurant: Restaurant): Promise<void> {
    return fetch(`${this.apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurant),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
      })
      .catch(error => {
        console.error(`Error updating restaurant with id ${id}:`, error.message);
        throw error;
      });
  }

  delete(id: number): Promise<void> {
    return fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
      })
      .catch(error => {
        console.error(`Error deleting restaurant with id ${id}:`, error.message);
        throw error;
      });
  }

  getById(id: number): Promise<Restaurant> {
    return fetch(`${this.apiUrl}/${id}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .catch(error => {
        console.error(`Error fetching restaurant with id ${id}:`, error.message);
        throw error;
      });
  }

  addMeal(meal: Meal, id: number): Promise<void> {
      return fetch(`${this.apiUrl}/${id}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
          }
        })
        .catch(error => {
          console.error("Error adding meal:", error.message);
          throw error;
        });
    }

  deleteMeal(restaurantId: number, id: number): Promise<void> {
    return fetch(`${this.apiUrl}/${restaurantId}/meals/${id}`, {
    method: "DELETE",
  })
    .then(response => {
    if (!response.ok) {
        return response.text().then(text => { throw new Error(text); });
    }
    })
    .catch(error => {
    console.error(`Error deleting meal with id ${id}:`, error.message);
    throw error;
    });
}
}
