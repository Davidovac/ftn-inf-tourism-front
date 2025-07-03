import { RestaurantService } from "../../../../dist/restaurants/services/restaurant.service.js";
const addRestaurantBtn = document.querySelector('#addRestaurantBtn') as HTMLButtonElement;
const buttonOne = document.querySelector('#button-one') as HTMLButtonElement;
const buttonTwo = document.querySelector('#button-two') as HTMLButtonElement;
const buttonThree = document.querySelector('#button-three') as HTMLButtonElement;
const prevPageBtn = document.getElementById("prevPageBtn") as HTMLButtonElement;
const nextPageBtn = document.getElementById("nextPageBtn") as HTMLButtonElement;
const currentPageSpan = document.getElementById("currentPage") as HTMLSpanElement;
const sortBySelect = document.getElementById("sortBy-select") as HTMLSelectElement;
const sortInSelect = document.getElementById("sortIn-select") as HTMLSelectElement;


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
    let restaurants ;
    let restaurantCount;
    currentPageSpan.textContent = currentPage.toString();
    if(ownerId){
        restaurants = await restaurantService.getPaged(ownerId, currentPage, pageCount, sortBy, sortIn);
    }
    else{
        addRestaurantBtn.classList.add("hidden");
        const data = await restaurantService.getPaged(0, currentPage, pageCount, sortBy, sortIn);
        restaurants = data.data
        restaurantCount = data.totalCount;
        console.log("restaurants", restaurants)
        console.log("count", restaurantCount)
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

            const statusInfo = document.createElement("p");
            statusInfo.textContent = `Status: ${r.status}`
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