import { RestaurantService } from "../../../../dist/restaurants/services/restaurant.service.js";
import { Meal } from "../../models/meal.model.js";
const addRestaurantBtn = document.querySelector('#addRestaurantBtn') as HTMLButtonElement;
const buttonOne = document.querySelector('#button-one') as HTMLButtonElement;
const buttonTwo = document.querySelector('#button-two') as HTMLButtonElement;
const buttonThree = document.querySelector('#button-three') as HTMLButtonElement;
const prevPageBtn = document.getElementById("prevPageBtn") as HTMLButtonElement;
const nextPageBtn = document.getElementById("nextPageBtn") as HTMLButtonElement;
const currentPageSpan = document.getElementById("currentPage") as HTMLSpanElement;
const sortBySelect = document.getElementById("sortBy-select") as HTMLSelectElement;
const sortInSelect = document.getElementById("sortIn-select") as HTMLSelectElement;

const modal = document.getElementById("restaurantModal")!;
const closeModalBtn = document.getElementById("closeModal")!;
const modalName = document.getElementById("modalName")!;
const modalDescription = document.getElementById("modalDescription")!;
const modalImages = document.getElementById("modalImages")!;
const modalMenu = document.getElementById("modalMenu")!;


const restaurantService = new RestaurantService();
const list = document.getElementById("restaurantList")!;
const ownerIdString = localStorage.getItem("userId");
const ownerId = ownerIdString ? parseInt(ownerIdString) : null;

let pageCount = 20;
let currentPage = 1;
let sortBy: "Name" | "Capacity" = "Name";
let sortIn: "ASC" | "DESC" = "ASC";


addRestaurantBtn.addEventListener('click', () => {
    window.location.href = '../restaurantForm/restaurantForm.html';
});

buttonOne.addEventListener('click', () => {
    buttonOne.classList.add('active')
    buttonTwo.classList.remove('active')
    buttonThree.classList.remove('active')
    pageCount = 5;
    currentPage = 1;
    loadRestaurants()
})
buttonTwo.addEventListener('click', () => {
    buttonOne.classList.remove('active')
    buttonTwo.classList.add('active')
    buttonThree.classList.remove('active')
    pageCount = 10;
    currentPage = 1;
    loadRestaurants()
})

buttonThree.addEventListener('click', () => {
    buttonOne.classList.remove('active')
    buttonTwo.classList.remove('active')
    buttonThree.classList.add('active')
    pageCount = 20;
    currentPage = 1;
    loadRestaurants()
})

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadRestaurants();
    }
});

nextPageBtn.addEventListener("click", () => {
    currentPage++;
    loadRestaurants();
});

sortBySelect.addEventListener("change", () => {
    const value = sortBySelect.value;
    if (value === "Name" || value === "Capacity") {
        sortBy = value;
        currentPage = 1;
        loadRestaurants();
    }
});

sortInSelect.addEventListener("change", () => {
    const value = sortInSelect.value;
    if (value === "ASC" || value === "DESC") {
        sortIn = value;
        currentPage = 1;
        loadRestaurants();
    }
});

async function loadRestaurants() {
    list.innerHTML = "";
    currentPageSpan.textContent = currentPage.toString();

    const data = await restaurantService.getPaged(ownerId ? ownerId : 0, currentPage, pageCount, sortBy, sortIn);
    const restaurants = data.data
    const restaurantCount = data.totalCount;
    console.log("restaurants", restaurants)
    console.log("count", restaurantCount)
    
    if(!ownerId){
        addRestaurantBtn.classList.add("hidden");        
    }

    if (restaurantCount) {
    const maxPage = Math.ceil(restaurantCount / pageCount);
    nextPageBtn.disabled = currentPage >= maxPage;
    nextPageBtn.classList.add('disabled')
    currentPageSpan.textContent = (currentPage + '/' + maxPage).toString()
    } else {
        nextPageBtn.disabled = false;
    }
    prevPageBtn.disabled = currentPage <= 1;

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
            if (r.imageUrls) {
                const img = document.createElement("img");
                img.src = r.imageUrls[0];
                img.alt = `Slika restorana ${r.name}`;
                img.classList.add("restaurant-image");
                div.appendChild(img);
            }

            const contentDiv = document.createElement("div");
            contentDiv.classList.add("restaurant-content");

            const h3 = document.createElement("h3");
            h3.classList.add('click')
            h3.textContent = r.name;

            h3.addEventListener("click", () =>{
                showDetails(r.id)
                console.log(h3.textContent)
            })

            const p = document.createElement("p");
            p.textContent = r.description;

            const locationInfo = document.createElement("p");
            locationInfo.textContent = `Lokacija: ${r.latitude}, ${r.longitude}`;
            locationInfo.classList.add("location-info");

            const capacityInfo = document.createElement("p");
            capacityInfo.textContent = `Kapacitet: ${r.capacity}`;
            capacityInfo.classList.add("capacity-info");

            const statusInfo = document.createElement("p");
            statusInfo.textContent = `Status: ${r.status}`
            capacityInfo.classList.add("capacity-info");

            const buttonGroup = document.createElement("div");
            buttonGroup.classList.add("button-group");

            const editBtn = document.createElement("button");
            editBtn.classList.add("edit");
            editBtn.textContent = "Izmeni";
            editBtn.addEventListener("click", () => {
                event.stopPropagation();
                window.location.href = `../restaurantForm/restaurantForm.html?id=${r.id}`;
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete");
            deleteBtn.textContent = "Obriši";
            deleteBtn.addEventListener("click", async () => {
                event.stopPropagation();
                await restaurantService.delete(r.id);
                location.reload();
            });

            contentDiv.appendChild(h3);
            if(ownerId){
                contentDiv.appendChild(statusInfo);
                buttonGroup.appendChild(editBtn);
                buttonGroup.appendChild(deleteBtn);
            }
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

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});


function showDetails(id) {
    restaurantService.getById(id).then((restaurant)=>{
    if (!restaurant) {
    alert("Restoran nije pronađen");
    return;
    }
    modalName.textContent = restaurant.name;
    modalDescription.textContent = restaurant.description;

    modalImages.innerHTML = "";
    modalMenu.innerHTML = "";

    if (restaurant.imageUrls) {
        console.log("restaurant.imageUrls", restaurant.imageUrls)
        restaurant.imageUrls.forEach((imgUrl: string) => {
            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = `Enterijer restorana ${restaurant.name}`;
            modalImages.appendChild(img);
        });
    } else {
        modalImages.textContent = "Nema slika enterijera.";
    }

    showMeals(restaurant.meals)

    modal.classList.remove("hidden");
    })
}


function showMeals(meals: Meal[]) {
    console.log("meals?", meals)
  const mealsContainer = document.getElementById("modalMenu") as HTMLElement;
  mealsContainer.innerHTML = meals.length === 0
    ? "<p>Nema jela.</p>"
    : meals.map(meal => `
      <div class="meal-card" data-id="${meal.id}">
        <p><strong>${meal.name}</strong> - ${meal.price}€</p>
        <p><em>${meal.ingredients}</em></p>
        ${meal.imageUrl ? `<img src="${meal.imageUrl}" alt="Slika jela" width="100"/>` : ""}
      </div>
    `).join("");
}