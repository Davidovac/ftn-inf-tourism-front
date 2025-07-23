import { Tour } from "../../model/tour.model.js";
import { KeyPoint } from "../../model/keyPoint.model.js";
import { ToursService } from "../../service/tours.service.js";
import { ReservationFormData } from "../../model/reservationFormData.model.js";
import { ReservationsService } from "../../service/reservations.service.js";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const body = document.querySelector('body') as HTMLElement
let thisTour: Tour = null

document.addEventListener('DOMContentLoaded', initialize)

function initialize() {
    const submitBtn = document.querySelector('#submitBtn') as HTMLButtonElement
    submitBtn.addEventListener('click', submit)
    submitBtn.disabled = false

    const guestsCountInput = document.querySelector("#guest-count-input") as HTMLInputElement;
    guestsCountInput.addEventListener("blur", validateGvalidateGuestsCount);

    getTour()
}

function getTour(): void {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const toursService = new ToursService();
  toursService.getById(id)
    .then((data: Tour) => {
      renderData(data);
      thisTour = data
      renderReviewes()
    })
    .catch((error) => {
      console.error(error.status, error.text);
    });
}

function renderData(tour: Tour): void {
    if (!tour) {
        return
    }
    renderTourInfo(tour)
    const kpBlocks = document.querySelectorAll('.single-kp-block')
    const map = L.map("map")
    const markers = []
    for (let i = 0; i < kpBlocks.length; i++) {
        const block = kpBlocks[i] as HTMLElement
        const keyPoint = tour.keyPoints[i];
        if (!keyPoint) {
            block.style.display = 'none'
            continue
        }
        if (i == 0) {
          map.setView([keyPoint.latitude, keyPoint.longitude], 13);
        }
        markers.push({lat: keyPoint.latitude, lng: keyPoint.longitude, popup: keyPoint.name})
        buildKeyPointBlock(keyPoint, block as HTMLElement);
    }
    const latLngs = markers.map(m => [m.lat, m.lng]);
    L.polyline(latLngs, {
      color: 'blue',
      weight: 4,
      opacity: 0.7,
      smoothFactor: 1
    }).addTo(map);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    markers.forEach(({ lat, lng, popup }) => {
      L.marker([lat, lng]).addTo(map).bindPopup(popup);
    });
}

function renderTourInfo(tour: Tour): void {
    const name = document.querySelector('#tour-name')
    name.textContent = tour.name

    const dateTimeLabel = document.querySelector('#dateTimeLabel')
    dateTimeLabel.textContent = 'Datum i vreme polaska:';
    const dateTime = document.querySelector('#dateTime')
    const date = new Date(tour.dateTime);
    let formattedDate = date.toLocaleString();
    formattedDate = formattedDate.replace(/,/g, '\n')
    dateTime.textContent = formattedDate;

    const maxGuestsLabel = document.querySelector('#maxGuestsLabel')
    maxGuestsLabel.textContent = 'Max. broj mesta:'
    const maxGuests = document.querySelector('#maxGuests')
    maxGuests.textContent = tour.maxGuests.toString();
    const tourDesc = document.querySelector('#tourDesc')
    tourDesc.textContent = tour.description
    const tourDescLabel = document.querySelector('#tourDescLabel')
    tourDescLabel.textContent = "Opis ture:"

}

function buildKeyPointBlock(keyPoint: KeyPoint, kpBlock: HTMLElement): void {
    const leftColumn = document.createElement('div')
    leftColumn.classList.add('left-column-block')
    const img = document.createElement('img') as HTMLImageElement
    img.src = keyPoint.imageUrl;
    img.style.backgroundColor = "grey";

    leftColumn.appendChild(img)
    kpBlock.appendChild(leftColumn)

    const rightColumn = document.createElement('div')
    rightColumn.classList.add('right-column-block')
    const name = document.createElement('h3')
    const desc = document.createElement('p')

    name.textContent = keyPoint.name
    desc.textContent = keyPoint.description
    
    const mapDiv = document.createElement('div')
    const lat = keyPoint.latitude
    const lng = keyPoint.longitude
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    mapDiv.innerHTML = `<iframe width='280' height='220' style={{ border: 0 }} loading='lazy' allowFullScreen src=${mapUrl}></iframe>`;

    rightColumn.appendChild(name)
    rightColumn.appendChild(desc)
    rightColumn.appendChild(mapDiv)
    kpBlock.appendChild(rightColumn)
}

function renderReviewes() {
  const parentContainer = document.querySelector('#tour-and-reserve-block')

  if (thisTour.ratings && thisTour.ratings.length > 0) {
    for (let i = 0; i < thisTour.ratings.length; i++) {
      const element = thisTour.ratings[i];
      if (i == 3) {
        break;
      }

      const ratingBox = document.createElement('div');
      ratingBox.classList.add('rating-box')
      const ratingText = document.createElement('p');
      ratingText.textContent = "Ocenjeno sa: " + element.rating + "⭐";
      ratingText.style.fontWeight = 'bolder';
      const commentLabel = document.createElement('p');
      commentLabel.style.fontWeight = 'bolder';
      commentLabel.classList.add('label');
      commentLabel.textContent = "Komentar korisnika:"
      const commentText = document.createElement('p');
      commentText.textContent = element.comment;
      commentText.style.fontStyle = "italic";

      ratingBox.appendChild(ratingText)
      ratingBox.appendChild(commentLabel)
      ratingBox.appendChild(commentText)
      parentContainer.appendChild(ratingBox)
    }
  } 
}

function submit(event) {
  event.preventDefault()
  const reservationsService: ReservationsService = new ReservationsService()
  const btn = document.querySelector("#submitBtn") as HTMLButtonElement;
  const guestsCountInput = document.querySelector("#guest-count-input") as HTMLInputElement;
  if (!localStorage.getItem("userId")) {
    alert('Uloguj se kao korisnik kako bi mogao da rezervises.')
    return;
  }
  const userId = JSON.parse(localStorage.getItem("userId"));
  const tourId = thisTour.id
  const guestsCount = Number(guestsCountInput.value)

  if (guestsCount > thisTour.maxGuests) {
    alert('Broj mesta koji ste upisali premasuje kapacitet. Unesite manji broj od maksimalnog')
    return
  }

  if (guestsCount < 1) {
    alert('Broj mesta rezervacije mora biti pozitivan');
    return
  }


  const reqBody: ReservationFormData = {guestsCount, userId, tourId, }

    btn.disabled = true
    btn.style.backgroundColor = 'grey'
    btn.style.color = 'white'
    btn.style.borderColor = 'grey'

    const spinner = document.querySelector('#loadingSpinner') as HTMLStyleElement
    spinner.style.display = 'block'
    body.style.backgroundColor = "rgb(202, 202, 202)"

    reservationsService.create(reqBody)
    .then(() =>{
        alert(`Uspesno ste rezervisali turu: ${thisTour.name}, za ${guestsCount} osoba/e.`)
    })
    .catch((error) => {
        console.error("Error: " + error.message);
        if (error.status === 404) {
          alert("User and/or Tour do not exist.");
        } else if (error.status === 409) {
          alert(error.message);
        } else {
          alert(
            "An error has occurred while loading the data. Please try again. "
          );
        }
      }).then(() => {
        btn.disabled = false
        btn.style.color = 'white'
        btn.style.backgroundColor = '#28a745'
        spinner.style.display = 'none'
        body.style.backgroundColor = "rgb(33, 68, 95)"
      })
}

function validityCheck() {
    const btn = document.querySelector("#submitBtn") as HTMLButtonElement;
    const guestsCountInput = document.querySelector("#guest-count-input") as HTMLInputElement;
    const guestsCount = guestsCountInput.value

    let errorSwitch = false

    if (guestsCount.trim() === '' || isNaN(Number(guestsCount))) {
        errorSwitch = true
    }
    
    if (errorSwitch){
        btn.disabled = true
        btn.style.backgroundColor = 'grey'
        btn.style.color = 'white'
        btn.style.borderColor = 'grey'
        btn.addEventListener('mouseover', () => {
          btn.style.cursor = 'default'
        })
        return
    }

    btn.addEventListener('mouseover', () => {
          btn.style.cursor = 'pointer'
        })
    btn.style.color = 'white'
    btn.style.backgroundColor = '#28a745'
    btn.disabled = false
}


function validateGvalidateGuestsCount(event: FocusEvent): void{
    validityCheck()
    const guestsCountErrorMessage = document.querySelector('#guestsCountError')
    guestsCountErrorMessage.textContent = ''
    const targetInput = event.target as HTMLInputElement;
    console.log('Input lost focus. Value:', targetInput.value);
    if (targetInput.value.trim() === '' || isNaN(Number(targetInput.value))) {
        guestsCountErrorMessage.textContent = 'Guests count field is required and its a number'
    }
    else{
        guestsCountErrorMessage.textContent = ''
    }
}