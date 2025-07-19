import { RestaurantService } from "../../../../dist/restaurants/services/restaurant.service.js";
import { Meal } from "../../../../dist/restaurants/models/meal.model.js";

const form = document.getElementById("restaurantForm") as HTMLFormElement;
const mealForm = document.getElementById("mealForm") as HTMLFormElement;
const addMealBtn = document.getElementById("addMealBtn") as HTMLButtonElement;
const cancelMealBtn = document.getElementById("cancelMealBtn") as HTMLButtonElement;
const publishBtn = document.getElementById("publishBtn") as HTMLButtonElement;

const imageInputsContainer = document.getElementById("imageInputs") as HTMLDivElement;
const addImageBtn = document.getElementById("addImageBtn") as HTMLButtonElement;

const restaurantService = new RestaurantService();
const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get("id"));
const ownerId = parseInt(localStorage.getItem("vlasnikId"));

let mealsList: Meal[] = [];

function loadData() {
  if (id) {
    restaurantService.getById(id).then((restaurant) => {
      if (!restaurant) {
        alert("Restoran nije pronađen");
        return;
      }

      (document.getElementById("name") as HTMLInputElement).value = restaurant.name;
      (document.getElementById("description") as HTMLInputElement).value = restaurant.description;
      (document.getElementById("capacity") as HTMLInputElement).value = restaurant.capacity.toString();
      imageInputsContainer.innerHTML = "";
      restaurant.imageUrls.forEach((url) => {
        const wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("image-url-group");

        const input = document.createElement("input");
        input.type = "text";
        input.name = "imageUrl";
        input.placeholder = "https://example.com/slika.jpg";
        input.classList.add("image-input");
        input.value = url;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "Obriši";
        removeBtn.classList.add("remove-image-btn");
        removeBtn.addEventListener("click", () => {
          wrapperDiv.remove();
        });

        wrapperDiv.appendChild(input);
        wrapperDiv.appendChild(removeBtn);
        imageInputsContainer.appendChild(wrapperDiv);
      });
      (document.getElementById("latitude") as HTMLInputElement).value = restaurant.latitude.toString();
      (document.getElementById("longitude") as HTMLInputElement).value = restaurant.longitude.toString();

      mealsList = restaurant.meals;
      renderMeals(mealsList);

      publishBtn.disabled = !(restaurant.meals.length >= 5 && restaurant.status === "u pripremi");
    }).catch((error: Error) => {
      console.error("Greška prilikom učitavanja restorana:", error.message);
      alert("Došlo je do greške pri učitavanju restorana.");
    });
  }
}

publishBtn.addEventListener("click", async () => {
  const restaurantData = {
    id: id || 0,
    name: (document.getElementById("name") as HTMLInputElement).value,
    description: (document.getElementById("description") as HTMLInputElement).value,
    capacity: parseInt((document.getElementById("capacity") as HTMLInputElement).value),
    imageUrls: Array.from(document.querySelectorAll(".image-input"))
    .map(input => (input as HTMLInputElement).value)
    .filter(url => url.trim() !== ""),

    latitude: parseFloat((document.getElementById("latitude") as HTMLInputElement).value),
    longitude: parseFloat((document.getElementById("longitude") as HTMLInputElement).value),
    ownerId: ownerId,
    status: "objavljeno",
  };

  try {
    await restaurantService.update(id, restaurantData);
    window.location.href = '/restaurants/pages/restaurants/restaurants.html';
  } catch (error) {
    console.error("Greška:", (error as Error).message);
    alert("Došlo je do greške pri objavljivanju restorana");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const restaurant = {
    id: id || 0,
    name: (document.getElementById("name") as HTMLInputElement).value,
    description: (document.getElementById("description") as HTMLInputElement).value,
    capacity: parseInt((document.getElementById("capacity") as HTMLInputElement).value),
    imageUrls: Array.from(document.querySelectorAll(".image-input"))
    .map(input => (input as HTMLInputElement).value)
    .filter(url => url.trim() !== ""),

    latitude: parseFloat((document.getElementById("latitude") as HTMLInputElement).value),
    longitude: parseFloat((document.getElementById("longitude") as HTMLInputElement).value),
    ownerId: ownerId,
    status: "u pripremi",
  };

  try {
    if (id) {
      await restaurantService.update(id, restaurant);
    } else {
      await restaurantService.create(restaurant);
    }
    window.location.href = '/restaurants/pages/restaurants/restaurants.html';
  } catch (error) {
    console.error("Greška:", (error as Error).message);
    alert("Došlo je do greške pri čuvanju restorana");
  }
});

mealForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newMeal = {
    id: 0,
    name: (document.getElementById("mealName") as HTMLInputElement).value,
    price: parseFloat((document.getElementById("mealPrice") as HTMLInputElement).value),
    ingredients: (document.getElementById("mealIngredients") as HTMLInputElement).value,
    imageUrl: (document.getElementById("mealImageUrl") as HTMLInputElement).value || "",
    restaurantId: id || 0,
  };

  try {
    await restaurantService.addMeal(newMeal, id);
    mealForm.reset();
    mealForm.classList.add("hidden");
    addMealBtn.classList.remove("hidden");
    loadData();
  } catch (error) {
    console.error("Greška:", (error as Error).message);
    alert("Došlo je do greške pri dodavanju jela");
  }
});

addMealBtn.addEventListener("click", () => {
  mealForm.classList.remove("hidden");
  addMealBtn.classList.add("hidden");
});

cancelMealBtn.addEventListener("click", () => {
  mealForm.reset();
  mealForm.classList.add("hidden");
  addMealBtn.classList.remove("hidden");
});

function renderMeals(meals: Meal[]) {
  const mealsContainer = document.getElementById("meals") as HTMLElement;
  mealsContainer.innerHTML = meals.length === 0
    ? "<p>Nema jela.</p>"
    : meals.map(meal => `
      <div class="meal-card" data-id="${meal.id}">
        <p><strong>${meal.name}</strong> - ${meal.price}e</p>
        <p><em>${meal.ingredients}</em></p>
        ${meal.imageUrl ? `<img src="${meal.imageUrl}" alt="Slika jela" width="100"/>` : ""}
        <button class="delete-meal" data-id="${meal.id}">Obriši</button>
      </div>
    `).join("");

  document.querySelectorAll(".delete-meal").forEach(button => {
    button.addEventListener("click", async (e) => {
      const mealId = parseInt((e.target as HTMLElement).getAttribute("data-id"));
      try {
        await restaurantService.deleteMeal(id, mealId);
        loadData();
      } catch (error) {
        console.error("Greška:", (error as Error).message);
        alert("Došlo je do greške pri brisanju jela");
      }
    });
  });
}

addImageBtn.addEventListener("click", () => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("image-url-group");

  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "imageUrl";
  newInput.placeholder = "https://example.com/slika.jpg";
  newInput.classList.add("image-input");

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "Obriši";
  removeBtn.classList.add("remove-image-btn");
  removeBtn.addEventListener("click", () => {
    wrapperDiv.remove();
  });

  wrapperDiv.appendChild(newInput);
  wrapperDiv.appendChild(removeBtn);
  imageInputsContainer.appendChild(wrapperDiv);
});


loadData();
