import { Tour } from "../../model/tour.model.js";
import { ToursService } from "../../service/tours.service.js";

const toursService = new ToursService()

const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;

function initialize(): void{
  checkLoginStatus()
  if (localStorage.role != 'vodic'){
    window.location.href = "../../../users/pages/login/login.html"
  }
    const params = new URLSearchParams(window.location.search);
    const guideId = params.get('id')
    const toFormBtn = document.querySelector('#toForm')
    toFormBtn.textContent = 'Dodaj turu'
    toFormBtn.addEventListener("click", function () {
        window.location.href = '../tourForm/tourForm.html'
    })
    toursService.getTours(guideId)
    .then(data => {
        renderData(data)
    })
    .catch(error =>{
        console.error(error.status, error.text)
    })
}

function renderData(data: Tour[]): void {
    const table = document.querySelector("table");
    const noDataMessage = document.querySelector("#no-data-message");

    if (data.length === 0) {
      table.classList.add("hidden");
      noDataMessage.classList.remove("hidden");
      return;
    }

    noDataMessage.classList.add("hidden");
    table.classList.remove("hidden");

    data.forEach((tour) => {
      if (!localStorage.getItem('guideId')){
        localStorage.setItem('guideId', tour.guideId.toString())
      }
      if (!tour.guide || tour.guide.username != localStorage.username){
        return
      }
      const tr = document.createElement("tr");

      const name = document.createElement("td");
      name.textContent = tour.name;
      tr.appendChild(name);

      const description = document.createElement("td");
      description.textContent = tour.name;
      tr.appendChild(description);

      const dateTime = document.createElement("td");
      const date = new Date(tour.dateTime);
      const formattedDate = date.toLocaleString()
      dateTime.textContent = formattedDate;
      tr.appendChild(dateTime);

      const maxGuests = document.createElement("td");
      maxGuests.textContent = tour.maxGuests.toString();
      tr.appendChild(maxGuests);

      const status = document.createElement("td");
      status.textContent = tour.status;
      tr.appendChild(status);

      const editBtnCell = document.createElement("td");
      tr.appendChild(editBtnCell);
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";

      editBtn.addEventListener("click", function () {
        window.location.href = "../tourForm/tourForm.html?id=" + tour.id;
      });
      editBtnCell.appendChild(editBtn);

      const deleteBtnCell = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.className = 'delete'
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", function () {
        toursService.delete(tour.id)
          .then(() => {
            alert('Tura ' + tour.name + ' je uspesno obrisana')
          })
          .then(() => {
            location.reload()
          })
          .catch((error) => {
            console.error(error.status, error.text);
          });
      });
      deleteBtnCell.appendChild(deleteBtn)
      tr.appendChild(deleteBtnCell)

      table.appendChild(tr)
    })
  }

  function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        setUserLoginState(true);
    } else {
        setUserLoginState(false);
    }
}

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    if (localStorage.getItem('guideId')){
        localStorage.removeItem('guideId')
    }
    setUserLoginState(false);
}

const logoutElement = document.querySelector('#logout');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

document.addEventListener('DOMContentLoaded', initialize)