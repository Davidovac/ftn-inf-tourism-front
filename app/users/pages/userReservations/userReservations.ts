import { Reservation } from "../../../tours/model/reservation.model.js";
import { ReservationsService } from "../../../tours/service/reservations.service.js";

const reservationsService = new ReservationsService()
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
document.addEventListener('DOMContentLoaded', initialize)