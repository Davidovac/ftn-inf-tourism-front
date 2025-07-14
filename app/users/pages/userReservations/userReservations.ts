import { Reservation } from "../../../tours/model/reservation.model.js";
import { ReservationsService } from "../../../tours/service/reservations.service.js";
import { ReservationService } from "../../../restaurants/services/reservations.service.js";
import { RestaurantService } from "../../../restaurants/services/restaurant.service.js";

const reservationsService = new ReservationsService()
const restaurantReservationService = new ReservationService()
const restaurantService = new RestaurantService()
document.addEventListener('DOMContentLoaded', initialize)

function initialize(): void{
  if (localStorage.role != 'turista'){
    window.location.href = "../pages/login/login.html"
  }
    const userId = JSON.parse(localStorage.getItem('userId'))
    reservationsService.getByUser(userId)
    .then(data => {
        renderTourReservations(data)
    })
    .catch(error =>{
        console.error(error.status, error.text)
    })
    renderRestaurantReservations(userId);
}

function renderTourReservations(data: Reservation[]): void {
  const table = document.querySelector("table");
  const noDataMessage = document.querySelector("#no-data-message");

  if (data.length === 0) {
    table.classList.add("hidden");
    noDataMessage.classList.remove("hidden");
    return;
  }

  noDataMessage.classList.add("hidden");
  table.classList.remove("hidden");

  data.forEach((reservation) => {
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    name.textContent = reservation.tour.name;
    tr.appendChild(name);

    const description = document.createElement("td");
    if (reservation.tour.description.length > 130) {
      const descP = document.createElement("p");
      let shorter = reservation.tour.description.substring(0, 127);
      shorter += "...";
      descP.textContent = shorter;

      const tooltip = document.createElement("div") as HTMLElement;
      const tooltipTxt = document.createElement("span") as HTMLElement;
      tooltipTxt.textContent = reservation.tour.description;
      tooltip.classList.add("tooltip");
      tooltipTxt.classList.add("tooltip-text");
      tooltipTxt.style.width = "600px";
      tooltip.appendChild(tooltipTxt);
      tooltip.appendChild(descP);
      description.appendChild(tooltip);
      tr.appendChild(description);
    } else {
      description.textContent = reservation.tour.description;
      tr.appendChild(description);
    }

    const dateTime = document.createElement("td");
    const date = new Date(reservation.tour.dateTime);
    const formattedDate = date.toLocaleString();
    dateTime.textContent = formattedDate;
    tr.appendChild(dateTime);

    const guestsCount = document.createElement("td");
    guestsCount.textContent = reservation.guestsCount.toString();
    tr.appendChild(guestsCount);

    const deleteBtnCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Cancel";

    const msDifference = new Date(reservation.tour.dateTime).getTime() - Date.now();
    const hours = msDifference / (60 * 60 * 1000);
    if (hours < 25) {
      deleteBtn.classList.add("uncancelable");
      deleteBtn.disabled = true;
      deleteBtn.addEventListener("mouseover", () => {
        const uncancelableBtns = document.querySelectorAll(".uncancelable");
        for (const element of uncancelableBtns) {
          (element as HTMLButtonElement).style.opacity = "100%";
        }
      });
      const tooltip = document.createElement("div") as HTMLElement;
      const tooltipTxt = document.createElement("span") as HTMLElement;
      if (hours > 0) {
        tooltipTxt.textContent = "Rezervaciju nije moguce otkazati 24 sata pre pocetka.";
      }
      if (hours < 1) {
        tooltipTxt.textContent = "Rezervacija je vec pocela.";
      }
      tooltip.classList.add("tooltip");
      tooltipTxt.classList.add("tooltip-text");
      tooltip.appendChild(tooltipTxt);
      tooltip.appendChild(deleteBtn);
      deleteBtnCell.appendChild(tooltip);
    } else {
      if (deleteBtn.classList.contains("uncancelable")) {
        deleteBtn.classList.remove("uncancelable");
      }
      deleteBtn.classList.add("cancelable");
      deleteBtn.disabled = false;
      deleteBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm(`Are you sure that you want to cancel this reservation?`)) {
          reservationsService
            .delete(reservation.id.toString())
            .then(() => {
              alert(
                "Rezervacija za turu: " +
                  reservation.tour.name +
                  " je uspesno obrisana"
              );
            })
            .then(() => {
              window.location.assign(window.location.href);
            })
            .catch((error) => {
              console.error(error.status, error.message);
            });
        }
      });
      deleteBtnCell.appendChild(deleteBtn);
    }

    
    tr.appendChild(deleteBtnCell);

    tr.classList.add("row");
    table.appendChild(tr);
  });
}

function renderRestaurantReservations(userId): void{
  restaurantReservationService.getByUser(userId)
    .then(data => {
      console.log("data", data)

    const table = document.getElementById("restaurant-table") as HTMLElement;
    const noDataMessage = document.getElementById("no-data") as HTMLElement;

    table.querySelectorAll("tr.row").forEach(row => row.remove());

    if (data.length === 0) {
      table.classList.add("hidden");
      noDataMessage.classList.remove("hidden");
      return;
    }

    noDataMessage.classList.add("hidden");
    table.classList.remove("hidden");

    data.forEach((reservation) => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = reservation?.restaurant?.name;
      tr.appendChild(nameTd);

      const createdAtTd = document.createElement("td");
      createdAtTd.textContent = formatDate(reservation.createdAt);
      tr.appendChild(createdAtTd)

      const startingDateTd = document.createElement("td");
      let startDate;
      if(reservation.mealTime === 'dorucak'){
        startDate = new Date(reservation.date)
        startDate.setHours(8)
      }
      else if (reservation.mealTime === 'rucak'){
        startDate = new Date(reservation.date)
        startDate.setHours(13)
      }
      else if (reservation.mealTime === 'vecera'){
        startDate = new Date(reservation.date)
        startDate.setHours(18)
      }

      startingDateTd.textContent = formatDate(startDate);
      tr.appendChild(startingDateTd)

      const numberOfPeopleTd = document.createElement("td");
      numberOfPeopleTd.textContent = reservation.numberOfPeople.toString();
      tr.appendChild(numberOfPeopleTd);

      const deleteTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.textContent = "Cancel";

      const hoursDiff = (startDate.getTime() - Date.now()) / (1000 * 60 * 60);

      let cancellationLimit = 4;
      if (reservation.mealTime === "dorucak") {
        cancellationLimit = 12;
      }

      if(hoursDiff < cancellationLimit){
        deleteBtn.classList.add("uncancelable");
        deleteBtn.disabled = true;

        deleteBtn.addEventListener("mouseover", () => {
        document.querySelectorAll(".uncancelable").forEach((el) => {
          (el as HTMLButtonElement).style.opacity = "100%";
          });
        });

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");

        const tooltipText = document.createElement("span");
        tooltipText.classList.add("tooltip-text");

       tooltipText.textContent =
        hoursDiff < 1
          ? "Rezervacija je već počela."
          : `Rezervaciju nije moguće otkazati manje od ${cancellationLimit}h pre termina (${reservation.mealTime}).`;

        tooltip.appendChild(tooltipText);
        tooltip.appendChild(deleteBtn);
        deleteTd.appendChild(tooltip);
      }
      else{
        deleteBtn.classList.add("cancelable");
        deleteBtn.disabled = false;

        deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm(`Da li ste sigurni da želite da otkažete ovu rezervaciju?`)) {
          restaurantReservationService
            .delete(reservation.id)
            .then(() => {
              alert(
                `Rezervacija za restoran: ${reservation.restaurant.name} je uspešno otkazana.`
              );
              window.location.reload();
            })
            .catch((err) => {
              console.error(err.status, err.message);
            });
        }
      });

      deleteTd.appendChild(deleteBtn);
    }    

    const now = new Date().getTime();
    const startTime = startDate.getTime();
    const diffHoursSinceStart = (now - startTime) / (1000 * 60 * 60);

    if (diffHoursSinceStart >= 1 && diffHoursSinceStart <= 72) {
      const rateBtn = document.createElement("button");
      rateBtn.className = "rate";
      rateBtn.textContent = "Rate";

      rateBtn.addEventListener("click", () => {
        openRatingModal(reservation.restaurantId, userId);
      });

      deleteTd.appendChild(rateBtn);
    }

      tr.appendChild(deleteTd);
      tr.classList.add("row");
      table.appendChild(tr);
    })

    })
    .catch(error =>{
        console.error(error.status, error.text)
    })
}

document.addEventListener('DOMContentLoaded', initialize)

function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function openRatingModal(restaurantId: number, userId: number): void {
  const modal = document.getElementById("ratingModal") as HTMLElement;
  modal.classList.remove("hidden");
  modal.style.display = "flex";

  const starContainer = document.getElementById("starRating") as HTMLElement;
  starContainer.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const starInput = document.createElement("input");
    starInput.type = "radio";
    starInput.name = "stars";
    starInput.value = i.toString();
    starInput.id = `star-${i}`;

    const label = document.createElement("label");
    label.htmlFor = `star-${i}`;
    label.textContent = `${i}⭐`;

    starContainer.appendChild(starInput);
    starContainer.appendChild(label);
  }

    document.getElementById("closeModal").addEventListener("click", () => {
    const modal = document.getElementById("ratingModal") as HTMLElement;
    modal.classList.add("hidden");
    modal.style.display = "none";
  });

  document.getElementById("ratingForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const rating = Number((document.querySelector('input[name="rating"]:checked') as HTMLInputElement)?.value);
    const comment = (document.getElementById("comment") as HTMLTextAreaElement).value;

    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    const ratingData = {
      userId: userId,
      restaurantId,
      rating: rating,
      comment
    };

    restaurantService.addRating(ratingData, restaurantId)

  });
}
