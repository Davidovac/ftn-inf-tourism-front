import { Restaurant } from "../../models/restaurant.model";
import { RestaurantService } from "../../../../dist/restaurants/services/restaurant.service.js";

const form = document.getElementById("restaurantForm") as HTMLFormElement;
const restaurantService = new RestaurantService();
const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id'));
const ownerId = parseInt(localStorage.getItem('userId'))

  if(id){
    restaurantService.getById(id).then((restaurant)=>{
    if(!restaurant){
        alert("Restoran nije pronađen")
        return;
    }

    (document.getElementById('name') as HTMLInputElement).value = restaurant.name;
    (document.getElementById('description') as HTMLInputElement).value = restaurant.description;
    (document.getElementById('capacity') as HTMLInputElement).value = restaurant.capacity.toString();
    (document.getElementById('imageUrl') as HTMLInputElement).value = restaurant.imageUrl;
    (document.getElementById('latitude') as HTMLInputElement).value = restaurant.latitude.toString();
    (document.getElementById('longitude') as HTMLInputElement).value = restaurant.longitude.toString();
    
    const dugme = document.getElementById("submitBtn") as HTMLButtonElement;
    dugme.textContent = "Izmeni";
    }).catch((error: Error) =>{
        console.error("Greška prilikom učitavanja restorana:", error.message);
        alert("Došlo je do greške pri učitavanju restorana.");
    });
  }

  
  form.addEventListener("submit", async (e) => {
  e.preventDefault();

    const restaurant: Restaurant = {
        id: 0,
        name: (document.getElementById("name") as HTMLInputElement).value,
        description: (document.getElementById("description") as HTMLInputElement).value,
        capacity: parseInt((document.getElementById("capacity") as HTMLInputElement).value),
        imageUrl: (document.getElementById("imageUrl") as HTMLInputElement).value,
        latitude: parseFloat((document.getElementById("latitude") as HTMLInputElement).value),
        longitude: parseFloat((document.getElementById("longitude") as HTMLInputElement).value),
        ownerId: ownerId,
        status: "u pripremi",
    };

    if(id){
        await restaurantService.update(id, restaurant).then(()=>{
            window.location.href = "../restaurants/restaurants.html"
        })
        .catch((error: Error)=>{
            console.error('Greška:', error.message);
            alert('Došlo je do greške pri menjanju podataka');
        })
    }
    else {
        await restaurantService.create(restaurant).then(()=>{
            form.reset();
            alert('Restoran uspešno dodat!');
            window.location.href = "../restaurants/restaurants.html";
        }).catch((error: Error) => {
            console.error('Greška:', error.message);
            alert('Došlo je do greške pri dodavanju restorana');
      });
    }
    });
