import { RestaurantService } from "../../../../dist/restaurants/services/restaurant.service.js";
const addRestaurantBtn = document.querySelector('#addRestaurantBtn') as HTMLElement;


const restaurantService = new RestaurantService();
const list = document.getElementById("restaurantList")!;
const ownerIdString = localStorage.getItem("userId");
const ownerId = ownerIdString ? parseInt(ownerIdString) : null;

addRestaurantBtn.addEventListener('click', () => {
    window.location.href = '../restaurantForm/restaurantForm.html';
});

async function loadRestaurants() {
    const restaurants = await restaurantService.getByOwner(ownerId);

    if(restaurants.length <= 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Nema restorana za prikaz.';
        emptyMessage.classList.add('empty-message');
        list.appendChild(emptyMessage);
    } else {
        restaurants.forEach((r) => {
            const div = document.createElement("div");
            div.classList.add('restaurant-card');

            // Slika restorana
            if (r.imageUrl) {
                const img = document.createElement("img");
                img.src = r.imageUrl;
                img.alt = `Slika restorana ${r.name}`;
                img.classList.add("restaurant-image");
                div.appendChild(img);
            }

            const contentDiv = document.createElement("div");
            contentDiv.classList.add("restaurant-content");

            const h3 = document.createElement("h3");
            h3.textContent = r.name;

            const p = document.createElement("p");
            p.textContent = r.description;

            const locationInfo = document.createElement("p");
            locationInfo.textContent = `Lokacija: ${r.latitude}, ${r.longitude}`;
            locationInfo.classList.add("location-info");

            const capacityInfo = document.createElement("p");
            capacityInfo.textContent = `Kapacitet: ${r.capacity}`;
            capacityInfo.classList.add("capacity-info");

            const buttonGroup = document.createElement("div");
            buttonGroup.classList.add("button-group");

            const editBtn = document.createElement("button");
            editBtn.classList.add("edit");
            editBtn.textContent = "Izmeni";
            editBtn.addEventListener("click", () => {
                window.location.href = `../restaurantForm/restaurantForm.html?id=${r.id}`;
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete");
            deleteBtn.textContent = "Obriši";
            deleteBtn.addEventListener("click", async () => {
                await restaurantService.delete(r.id);
                location.reload();
            });

            buttonGroup.appendChild(editBtn);
            buttonGroup.appendChild(deleteBtn);

            contentDiv.appendChild(h3);
            contentDiv.appendChild(p);
            contentDiv.appendChild(locationInfo);
            contentDiv.appendChild(capacityInfo);
            contentDiv.appendChild(buttonGroup);

            div.appendChild(contentDiv);

            const hr = document.createElement("hr");
            div.appendChild(hr);

            list.appendChild(div);
        });
    }
}

loadRestaurants();