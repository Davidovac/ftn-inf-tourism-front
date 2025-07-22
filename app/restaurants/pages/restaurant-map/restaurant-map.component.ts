import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RestaurantService } from '../../services/restaurant.service';

const map = L.map('map').setView([44.7866, 20.4489], 7);
const restaurantService = new RestaurantService();


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


async function getRestaurants(){
  await restaurantService.getAllMapRestaurants().then(res => {
    res.forEach(element => {
      const marker = L.marker([element.latitude, element.longitude]).addTo(map);
      marker.bindPopup(`
        <div style="font-size: 14px;">
          <strong>${element.name}</strong><br>
          <em>${element.description}</em><br>
          <em>Ocena: ${element.averageRating}/5⭐</em><br>
          <em>Kapacitet: ${element.capacity}</em><br>
          ${element.imageUrls ? `<img src="${element.imageUrls[0]}" alt="Slika restorana" width="200"/>` : ""}
        </div>`)
    });
  })

}

getRestaurants()
