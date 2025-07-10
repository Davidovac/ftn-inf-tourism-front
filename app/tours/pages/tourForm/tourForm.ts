//import { Tour } from "../../model/tour.model.js";
import { TourFormData } from "../../model/tourFormData.model.js";
import { ToursService } from "../../service/tours.service.js";
import { KeyPoint } from "../../model/keyPoint.model.js";
import { KeyPointService } from "../../service/keyPoints.service.js";

const toursService = new ToursService()

const body = document.querySelector('body') as HTMLElement

function initializeForm(): void{
    if (!localStorage.getItem('guideId')){
        window.location.href = "../../../index.html"
    }

    localStorage.removeItem("tourKeyPoints");
    window.onbeforeunload = function () {
      localStorage.removeItem('tourKeyPoints');
      return "";
    };

    const tempPage = new URLSearchParams(window.location.search).get('page')  
    if (tempPage === null || Number(tempPage) === 0) {
      updateURL(0)
    }

    pageButtonsDisplay()
    let pagesCount = Number(localStorage.getItem('totalCount')) / 4;
    if (((pagesCount / Math.round(pagesCount))) > 1){
      pagesCount = Math.round(pagesCount) + 1
    }
    else {
      pagesCount = 1
    }

    const buttonFirst = document.querySelector('#buttonFirstPage')
    const buttonNext = document.querySelector('#buttonNextPage')
    const buttonPrevious = document.querySelector('#buttonPreviousPage')
    const buttonLast = document.querySelector('#buttonLastPage')

    buttonNext.addEventListener('click', () => {
      updateURL(1);
      pageButtonsDisplay()
      renderCatalogData()
    });


    buttonFirst.addEventListener('click', () => {;
      updateURL(0)
      pageButtonsDisplay()
      renderCatalogData()
    })


    buttonPrevious.addEventListener('click', () => {
    updateURL(-1);
    pageButtonsDisplay()
    renderCatalogData()
    });


    buttonLast.addEventListener('click', () => {
      updateURL(pagesCount)
      pageButtonsDisplay()
      renderCatalogData()
    })

    const submitBtn = document.querySelector('#submitBtn') as HTMLButtonElement
    submitBtn.addEventListener('click', submit)
    submitBtn.disabled = false

    const nameInput = document.querySelector("#name") as HTMLInputElement;
    const descInput = document.querySelector("#description") as HTMLInputElement;
    const dateInput = document.querySelector("#dateTime") as HTMLInputElement;
    const maxGuestsInput = document.querySelector("#maxGuests") as HTMLInputElement;

    nameInput.addEventListener("blur", validateName);
    descInput.addEventListener("blur", validateDescription);
    dateInput.addEventListener("blur", validateDateTime);
    maxGuestsInput.addEventListener("blur", validateMaxGuests);
    

    const urlParams = new URLSearchParams(window.location.search);
    const id: string | null = urlParams.get("id");
    
    if (id) {
      const spinner = document.querySelector('#loadingSpinner') as HTMLStyleElement
      spinner.style.display = 'block'
      body.style.backgroundColor = "rgb(202, 202, 202)"
      
      toursService.getById(id)
      .then((tour) => {
        nameInput.value = tour.name;
        descInput.value = tour.description;
        dateInput.value = tour.dateTime;
        maxGuestsInput.value = tour.maxGuests.toString();
        validityCheck()
        getAddedData()
      })
      .catch(error => {
        alert('Tour not found!')
        console.error(error.status, error.message)
      })
    }
    validityCheck()
    renderCatalogData()
}

document.addEventListener('DOMContentLoaded', initializeForm)

//CLICK LISTEN FUNCTIONS

function submit(): void{
    const btn = document.querySelector('#submitBtn') as HTMLButtonElement
    const name = (document.querySelector("#name") as HTMLInputElement).value
    const description = (document.querySelector("#description") as HTMLInputElement).value
    const dateTime = (document.querySelector("#dateTime") as HTMLInputElement).value
    const maxGuestsString = (document.querySelector("#maxGuests") as HTMLInputElement).value
    const status = 'u pripremi'

    const maxGuests = Number(maxGuestsString)

    const guideId = Number(localStorage.getItem('guideId'))
    const keyPoints = JSON.parse(localStorage.getItem('tourKeyPoints'))
    localStorage.removeItem('tourKeyPoints')

    const reqBody: TourFormData = {name, description, dateTime, maxGuests, status, guideId, keyPoints}

    btn.disabled = true
    btn.style.backgroundColor = 'grey'
    btn.style.color = 'white'
    btn.style.borderColor = 'grey'

    const spinner = document.querySelector('#loadingSpinner') as HTMLStyleElement
    spinner.style.display = 'block'
    body.style.backgroundColor = "rgb(202, 202, 202)"

    toursService.addOrUpdate(reqBody)
    .catch((error) => {
        console.error("Error: " + error.message);
        if (error.status && error.status === 404) {
          alert("User does not exist.");
        } else if (error.status && error.status === 400) {
          alert("Data is invalid");
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
        body.style.backgroundColor = "#ffffff"
      })
      .then(() =>{
        window.location.href = "../preview/tours.html";
      })
}

function addKeyPoint(keyPoint: KeyPoint | null) {
    if (!keyPoint){
        alert('An error has occured, invalid action!')
        return
    }
    let keyPoints = JSON.parse(localStorage.getItem('tourKeyPoints'))
    if (keyPoints && JSON.parse(localStorage.getItem('tourKeyPoints')).length >= 4) {
       alert('Dostigli ste maksimalan broj kljucnih tacaka(4)!')
       return
    }

    if (keyPoints) {
      for (const element of keyPoints) {
        if (keyPoint.id === element.id) {
          alert("This Key Point already exists on this tour");
          return;
        }
      }
    }
    else {
      keyPoints = []
    }
    
    keyPoints.push(keyPoint)
    localStorage.setItem('tourKeyPoints', JSON.stringify(keyPoints))
    renderAddedData(keyPoints)
    renderCatalogData()
}


function removeKeyPoint(keyPoint: KeyPoint | null) {
    if (!keyPoint){
        alert('An error has occured, invalid action!')
        return
    }

    const keyPoints: KeyPoint[] = JSON.parse(localStorage.getItem('tourKeyPoints'))
    for (const element of keyPoints) {
        if (keyPoint.id === element.id) {
          const index = keyPoints.map(function (el) {
            return el.id
          }).indexOf(keyPoint.id)
            keyPoints.splice(index , 1)
            localStorage.setItem('tourKeyPoints', JSON.stringify(keyPoints))
            renderCatalogData()
            renderAddedData(keyPoints)
            return
        }
    }
    alert("Invalid action, Key Point already doesnt exist on this tour!")
}

//------------VALIDATON FUNCTIONS-------------

function validityCheck(): void {
    const btn = document.querySelector("#submitBtn") as HTMLInputElement

    const name = (document.querySelector("#name") as HTMLInputElement).value
    const description = (document.querySelector("#description") as HTMLInputElement).value
    const date = (document.querySelector("#dateTime") as HTMLInputElement).value
    const maxGuests = (document.querySelector("#maxGuests") as HTMLInputElement).value

    let errorSwitch = false

    if (name.trim() === '') {
        errorSwitch = true
    }

    if (description.trim() === '') {
        errorSwitch = true
    }

    if (maxGuests.trim() === '' || isNaN(Number(maxGuests))) {
        errorSwitch = true
    }
    const dateDate = new Date(date)

    if (date === "" ||dateDate.getTime() < Date.now()) {
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


function validateName(event: FocusEvent): void{
    validityCheck()
    const nameErrorMessage = document.querySelector('#nameError')
    nameErrorMessage.textContent = ''
    const targetInput = event.target as HTMLInputElement;
    console.log('Input lost focus. Value:', targetInput.value);
    if (targetInput.value.trim() === '') {
        nameErrorMessage.textContent = 'Name is required'
    }
    else{
        nameErrorMessage.textContent = ''
    }
}

function validateDescription(event: FocusEvent): void{
    validityCheck()
    const descriptionErrorMessage = document.querySelector('#descriptionError')
    descriptionErrorMessage.textContent = ''
    const targetInput = event.target as HTMLInputElement;
    console.log('Input lost focus. Value:', targetInput.value);
    if (targetInput.value.trim() === '') {
        descriptionErrorMessage.textContent = 'Description is required'
    }
    else{
        descriptionErrorMessage.textContent = ''
    }
}

function validateDateTime(event: FocusEvent): void{
    validityCheck()
    const dateTimeErrorMessage = document.querySelector('#dateTimeError')
    dateTimeErrorMessage.textContent = ''
    const targetInput = event.target as HTMLInputElement;
    console.log('Input lost focus. Value:', targetInput.value);
    const dateDate = new Date(targetInput.value)
    if (targetInput.value === "" || dateDate.getTime() < Date.now()) {
        dateTimeErrorMessage.textContent = 'Starting Date and Time is required and has to be in future'
    }
    else{
        dateTimeErrorMessage.textContent = ''
    }
}

function validateMaxGuests(event: FocusEvent): void{
    validityCheck()
    const maxGuestsErrorMessage = document.querySelector('#maxGuestsError')
    maxGuestsErrorMessage.textContent = ''
    const targetInput = event.target as HTMLInputElement;
    console.log('Input lost focus. Value:', targetInput.value);
    if (targetInput.value.trim() === '' || targetInput.value.length < 2) {
        maxGuestsErrorMessage.textContent = 'Max. Guests field is required and its a number'
    }
    else{
        maxGuestsErrorMessage.textContent = ''
    }
}

//------------RENDER FUNCTIONS-------------

function renderCatalogData() {
  const urlParams = new URLSearchParams(window.location.search);
  const page: string | null = urlParams.get("page");

  const keyPointService = new KeyPointService();

  const spinner = document.querySelector('#loadingSpinner') as HTMLStyleElement
  spinner.style.display = 'block'
  body.style.backgroundColor = "rgb(202, 202, 202)"

  keyPointService
    .getKeyPoints(page)
    .then((data) => {
      const catalogList = data.data;
      const totalCount = data.totalCount;
      localStorage.setItem("totalCount", JSON.stringify(totalCount));
      const cards = document.querySelectorAll(".key-point-card");
      for (let i = 0; i < 4; i++) {
        const keyP = catalogList[i];
        const card = cards[i];
        const keyPoints = JSON.parse(localStorage.getItem("tourKeyPoints"));
        let bool = false;
        if (keyPoints) {
          for (const element of keyPoints) {
            if (keyP && element.id === keyP.id) {
              //Ako KeyPoint postoji u Added listi brisu se podaci i sklanja se plus
              card.innerHTML = "";
              const cardBro = card.nextElementSibling;
              const plus = cardBro.firstChild as HTMLElement;
              plus.style.display = "none";
              bool = true;
            } else if (!keyP) {
              card.innerHTML = "";
              const cardBro = card.nextElementSibling;
              const plus = cardBro.firstChild as HTMLElement;
              plus.style.display = "none";
              bool = true;
            }
          }
        } 
        if (!keyP){
          card.innerHTML = "";
          const cardBro = card.nextElementSibling;
          const plus = cardBro.firstChild as HTMLElement;
          plus.style.display = "none";
          bool = true;
        }
        if (bool) {
          const secondRowSection = card.nextElementSibling;
          const addBtn = secondRowSection.firstChild;
          const newAddBtn = addBtn.cloneNode(true);
          addBtn.parentNode.replaceChild(newAddBtn, addBtn);
          continue;
        }
        const cardBro = card.nextElementSibling;
        const plus = cardBro.firstChild as HTMLElement;
        plus.style.display = "block";
        card.innerHTML = "";
        const secondRowSection = card.nextElementSibling;
        const addBtn = secondRowSection.firstChild;

        buildCard(card, keyP);

        const newAddBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newAddBtn, addBtn);

        newAddBtn.addEventListener("click", (event) => {
            addKeyPoint(keyP);
            event.stopImmediatePropagation();
          },
          { once: true }
        );
      }
    })
    .then(() => {
      spinner.style.display = 'none'
      body.style.backgroundColor = "#ffffff"
    })
    .catch((error) => {
      console.error("Error: " + error.message);
      if (error.status && error.status === 404) {
        alert("No Key Points found.");
      } else if (error.status && error.status === 400) {
        alert("Data is invalid");
      } else {
        alert(
          "An error has occurred while loading the data. Please try again. "
        );
      }
    });
}

function getAddedData(){
  const urlParams = new URLSearchParams(window.location.search);
  const id: string | null = urlParams.get("id");
  localStorage.removeItem('tourKeyPoints')
    toursService.getById(id)
    .then((data) => {
      const tour = data;
      const tourKeyPoints = tour.keyPoints;
      localStorage.setItem("tourKeyPoints", JSON.stringify(tourKeyPoints));
      renderAddedData(tourKeyPoints)
    })
    .catch((error) => {
      console.error("Error: " + error.message);
      if (error.status && error.response.status === 404) {
        alert("Tour does not exist.");
      } else if (error.status && error.status === 400) {
        alert("Data is invalid");
      } else {
        alert(
          "An error has occurred while loading the data. Please try again. "
        );
      }
    });
}

function renderAddedData(tourKeyPoints) {
  const mainDiv = document.querySelector("#key-points-added");
  mainDiv.innerHTML = "<h3>Dodate kljucne tacke:</h3>";
  if (tourKeyPoints) {
    for (const kp of tourKeyPoints) {
      const row = document.createElement("id");
      row.classList.add("row");
      const card = document.createElement("id");
      card.classList.add("key-point-card");
      card.classList.add("card-chosen");
      const minusHolderDiv = document.createElement("id");
      minusHolderDiv.classList.add("second-row-section");
      const minusDiv = document.createElement("id");
      minusDiv.classList.add("minus");
      minusDiv.addEventListener("click", function () {
        removeKeyPoint(kp);
      });

      mainDiv.appendChild(row);
      row.appendChild(card);
      row.appendChild(minusHolderDiv);
      minusHolderDiv.appendChild(minusDiv);

      buildCard(card, kp);
    }
  }
}

function buildCard(card, keyPoint: KeyPoint) {
  if (!keyPoint){
    return
  }
    const imageDiv = document.createElement('div')
    imageDiv.classList.add('image-div')
    card.appendChild(imageDiv)

    const imgEle = document.createElement('img')
    imgEle.src = keyPoint.imageUrl
    imageDiv.appendChild(imgEle)


    const textDiv = document.createElement('div')
    textDiv.classList.add('text-div')
    card.appendChild(textDiv)
    
    //Naziv kljucne tacke
    const nameDiv = document.createElement('div')
    nameDiv.classList.add('name-div')
    textDiv.appendChild(nameDiv)
    textDiv.appendChild(nameDiv)

    const nazivText = document.createElement('p')
    nazivText.textContent = keyPoint.name
    nameDiv.appendChild(nazivText)

    //Opis kljucne tacke
    const descDiv = document.createElement('div')
    descDiv.classList.add('desc-div')
    card.appendChild(descDiv)
    textDiv.appendChild(descDiv)

    const descEle = document.createElement('p')
    if (keyPoint.description.length > 130) {
      let shorter = keyPoint.description.substring(0, 127)
      shorter += "..."
      descEle.textContent = shorter
    }
    else {
      descEle.textContent = keyPoint.description
    }
    descDiv.appendChild(descEle)
    
    //Koordinate kljucne tacke
    const coordsDiv = document.createElement('div')
    coordsDiv.classList.add('coords-div')
    card.appendChild(coordsDiv)
    textDiv.appendChild(coordsDiv)

    const xH = document.createElement('h4')
    xH.textContent = 'X: '
    coordsDiv.appendChild(xH)

    const xEle = document.createElement('p')
    xEle.textContent = keyPoint.longitude.toString()
    coordsDiv.appendChild(xEle)

    const yH = document.createElement('h4')
    yH.textContent = 'Y: '
    coordsDiv.appendChild(yH)

    const yEle = document.createElement('p')
    yEle.textContent = keyPoint.latitude.toString()
    coordsDiv.appendChild(yEle)
}

function pageButtonsDisplay() {
    const currentPage = parseInt(new URLSearchParams(window.location.search).get('page') || '1');
    let pagesCount = Number(localStorage.getItem('totalCount')) / 4;
    if (((pagesCount / Math.round(pagesCount))) > 1){
      pagesCount = Math.round(pagesCount) + 1
    }
    else {
      pagesCount = Math.round(pagesCount)
    }

    if (pagesCount <= 1){
      (document.querySelector('#buttonFirstPage') as HTMLElement).style.display = 'none';
      (document.querySelector('#buttonPreviousPage') as HTMLElement).style.display = 'none';
      (document.querySelector('#buttonNextPage') as HTMLElement).style.display = 'none';
      (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'none';
      updateURL(0);
      return
    }

    //ONLOAD BUTTON SHOW
    if (currentPage <= 1) {
      (document.querySelector('#buttonFirstPage') as HTMLElement).style.display = 'none';
      (document.querySelector('#buttonPreviousPage') as HTMLElement).style.display = 'none';
      (document.querySelector('#buttonNextPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'block';
      if (currentPage == (pagesCount-1)) {
        (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'none';
      }
    }
    else if (currentPage == 2) {
      (document.querySelector('#buttonFirstPage') as HTMLElement).style.display = 'none';
      (document.querySelector('#buttonPreviousPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonNextPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'block';
      if(currentPage == (pagesCount-1)) {
        (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'none';
      }
      if (currentPage == pagesCount) {
        (document.querySelector('#buttonNextPage') as HTMLElement).style.display = 'none';
        (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'none';
      }
    }
    else if (currentPage >= pagesCount) {
      (document.querySelector('#buttonFirstPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonPreviousPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonNextPage') as HTMLElement).style.display = 'none';
      (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'none';
    }
    else if(currentPage == (pagesCount-1)) {
      (document.querySelector('#buttonFirstPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonPreviousPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonNextPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'none';
    }
    else {
      (document.querySelector('#buttonFirstPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonPreviousPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonNextPage') as HTMLElement).style.display = 'block';
      (document.querySelector('#buttonLastPage') as HTMLElement).style.display = 'block';
    }
}

function updateURL(ind) {
  const baseUrl = window.location.origin + window.location.pathname;

  const urlParams = new URLSearchParams(window.location.search);
  const id: string | null = urlParams.get("id");
  let page: string | null = urlParams.get("page")
  let newUrl
  if (ind === 0) {
    page = "1"
  }
  else if (ind === 1){
    const number = Number(page) +1
    page = number.toString()
  }
  else if (ind === -1) {
    const number = Number(page) -1
    page = number.toString()
  }
  else if (ind > 1) {
    page = ind.toString()
  }

  if (!id || id === null){
    newUrl = `${baseUrl}?page=${page}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    return
  }

  newUrl = `${baseUrl}?id=${id}&page=${page}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}