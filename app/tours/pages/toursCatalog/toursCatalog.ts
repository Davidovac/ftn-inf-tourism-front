import { Tour } from "../../model/tour.model.js";
import { KeyPoint } from "../../model/keyPoint.model.js";
import { ToursService } from "../../service/tours.service.js";

interface TourRowElement extends HTMLElement {
  tourData?: Tour;
}

document.addEventListener('DOMContentLoaded', initialize)

let currentlyExpandedRow: TourRowElement | null = null;

function initialize() {
    const tempPage = new URLSearchParams(window.location.search).get('page')  
    if (isNaN(Number(tempPage)) || Number(tempPage) === 0) {
      updateURL(0)
    }

    window.onbeforeunload = function () {
      localStorage.removeItem('totalCount');
      localStorage.removeItem('pagesCount');
      return "";
    };

    const orderBySelect = document.querySelector('#sortByPicker')
    orderBySelect.addEventListener("change", changeSortBy)

    const pageSizeSelect = document.querySelector('#pageSizePicker')
    pageSizeSelect.addEventListener("change", changePageSize)

    changeSortDirection()
    getData()

    const buttonFirst = document.querySelector('#buttonFirstPage')
    const buttonNext = document.querySelector('#buttonNextPage')
    const buttonPrevious = document.querySelector('#buttonPreviousPage')
    const buttonLast = document.querySelector('#buttonLastPage')

    buttonNext.addEventListener('click', () => {
      updateURL(1);
      pageButtonsDisplay()
      getData()
    });


    buttonFirst.addEventListener('click', () => {;
      updateURL(0)
      pageButtonsDisplay()
      getData()
    })


    buttonPrevious.addEventListener('click', () => {
    updateURL(-1);
    pageButtonsDisplay()
    getData()
    });


    buttonLast.addEventListener('click', () => {
      updateURL(Number(JSON.parse(localStorage.getItem('pagesCount'))))
      pageButtonsDisplay()
      getData()
    })

}

function getData() {
    paramsValidation()
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page')
    const pageSize = params.get('pageSize')
    const orderBy = params.get('orderBy')
    const orderDirection = params.get('orderDirection')

    const toursService = new ToursService();
    toursService.getTours(page, pageSize, orderBy, orderDirection)
    .then(data => {
        const totalCount = data.totalCount;
        localStorage.setItem("totalCount", JSON.stringify(totalCount));
            if (localStorage.getItem("totalCount")) {
              let pagesCount = Number(localStorage.getItem("totalCount")) / Number(pageSize);
              if (pagesCount / Math.round(pagesCount) > 1) {
                pagesCount = Math.round(pagesCount) + 1;
              } else {
                pagesCount = Math.round(pagesCount)
              }
              localStorage.setItem("pagesCount", JSON.stringify(pagesCount));
            }
        renderData(data.data)
    })
    .catch(error =>{
        console.error(error.status, error.message)
    })
}

function renderData(data) {
    renderTours(data)
    pageButtonsDisplay()
}

function renderTours(tours: Tour[]) {
    const mainDiv = document.querySelector('#catalog-container')
    mainDiv.innerHTML = ""
    if (!tours && tours.length < 1) {
        const noDataMessage = document.createElement('h4')
        noDataMessage.textContent = 'No tours found'
        mainDiv.appendChild(noDataMessage)
        return
    }

    for (const tour of tours) {
        if (tour.status != "objavljeno") {
            continue
        }
        const row = document.createElement('div')
        buildRow(row, tour)
        mainDiv.appendChild(row)
    };
}


function buildRow(row, tour: Tour) {
    row.classList.add('row')
    row.classList.add('minimized')
    const naziv = document.createElement('p')
    naziv.id = 'naziv'
    const dateTimeLabel = document.createElement('p')
    dateTimeLabel.classList.add('label')
    const dateTime = document.createElement('p')
    const maxBrLabel = document.createElement('p')
    maxBrLabel.classList.add('label')
    const maxBr = document.createElement('p')
    const kpListLabel = document.createElement('p')
    kpListLabel.classList.add('label')
    const kpList = document.createElement('p')

    naziv.textContent = tour.name;
    const date = new Date(tour.dateTime);
    const formattedDate = date.toLocaleString();
    dateTimeLabel.textContent = 'Polazak:';
    dateTime.textContent = formattedDate;
    maxBrLabel.textContent = 'Max. broj mesta:';
    maxBr.textContent = tour.maxGuests.toString();
    kpListLabel.textContent = 'Kljucne tacake:';
    kpList.textContent = tour.keyPoints.map((keyPoint: KeyPoint) => keyPoint.name).join(", ");
    kpList.id = 'keyPoints'

    row.appendChild(naziv)
    row.appendChild(dateTimeLabel)
    row.appendChild(dateTime)
    row.appendChild(maxBrLabel)
    row.appendChild(maxBr)
    row.appendChild(kpListLabel)
    row.appendChild(kpList)

    row.addEventListener('click', () => {
        for (const className of row.classList) {
            if (className == "minimized") {
                expandRow(row, tour)
            }
            else if (className == "maximized") {

                shrinkRow(row, tour)
            }
        }
    })
}


function expandRow(row: TourRowElement, tour: Tour) {
    row.innerHTML = "";

    if (currentlyExpandedRow && currentlyExpandedRow !== row && currentlyExpandedRow != row) {
      shrinkRow(currentlyExpandedRow, currentlyExpandedRow.tourData!);

      if (currentlyExpandedRow && currentlyExpandedRow.classList.contains("maximized")) {
        currentlyExpandedRow.classList.remove("maximized");
      }
    }

    row.tourData = tour;
    currentlyExpandedRow = row;

    const firstInfoDiv = document.createElement('div')
    firstInfoDiv.classList.add('first-info-block')
    const naziv = document.createElement('h3')
    const dateDiv = document.createElement('div')
    dateDiv.classList.add('dateTime-block')
    const dateTimeLabel = document.createElement('p')
    dateTimeLabel.classList.add('label')
    const dateTime = document.createElement('p')
    const maxBrDiv = document.createElement('div')
    maxBrDiv.classList.add('maxBr-block')
    const maxBrLabel = document.createElement('p')
    maxBrLabel.classList.add('label')
    const maxBr = document.createElement('p')
    
    naziv.textContent = tour.name
    const date = new Date(tour.dateTime);
    let formattedDate = date.toLocaleString();
    formattedDate = formattedDate.replace(/,/g, '\n')
    dateTimeLabel.textContent = 'Polazak:';
    dateTime.textContent = formattedDate;
    maxBrLabel.textContent = 'Max. br mesta:'
    maxBr.textContent = tour.maxGuests.toString();

    dateDiv.appendChild(dateTimeLabel)
    dateDiv.appendChild(dateTime)

    maxBrDiv.appendChild(maxBrLabel)
    maxBrDiv.appendChild(maxBr)

    firstInfoDiv.appendChild(naziv)
    firstInfoDiv.appendChild(dateDiv)
    firstInfoDiv.appendChild(maxBrDiv)

    const secondInfoDiv = document.createElement('div')
    secondInfoDiv.classList.add('second-info-block')
    const descLabel = document.createElement('p')
    descLabel.classList.add('label')
    const desc = document.createElement('p')
    descLabel.textContent = 'Opis:';
    if (tour.description && tour.description.length > 265) {
      let shorter = tour.description.substring(0, 265)
      shorter += "..."
      desc.textContent = shorter
    }
    else {
      desc.textContent = tour.description
    }
    

    secondInfoDiv.appendChild(descLabel)
    secondInfoDiv.appendChild(desc)

    row.appendChild(firstInfoDiv)
    row.appendChild(secondInfoDiv)

    for (const keyPoint of tour.keyPoints) {
        if (tour.keyPoints.indexOf(keyPoint) > 1){
            break
        }
        const keyPointCard = document.createElement('div')
        keyPointCard.classList.add('key-point-card')

        const tooltip = document.createElement('div') as HTMLElement
        const tooltipTxt = document.createElement('span') as HTMLElement
        tooltipTxt.textContent = "X: " + keyPoint.longitude + "\n Y: " + keyPoint.latitude
        tooltip.classList.add('tooltip')
        tooltipTxt.classList.add('tooltip-text')

        const img = document.createElement('img')
        img.src = keyPoint.imageUrl

        const txtDiv = document.createElement('div')
        txtDiv.classList.add('kp-info-block')
        const kpNaziv = document.createElement('p')
        kpNaziv.classList.add('naziv')
        kpNaziv.textContent = keyPoint.name
        const kpDesc = document.createElement('p')
        kpDesc.textContent = keyPoint.description

        txtDiv.appendChild(kpNaziv)
        txtDiv.appendChild(kpDesc)

        tooltip.appendChild(tooltipTxt)
        tooltip.appendChild(img)
        keyPointCard.appendChild(tooltip)
        keyPointCard.appendChild(txtDiv)

        row.appendChild(keyPointCard)
    }

    const seeMore = document.createElement('a')
    seeMore.href = '../tourOverview/tourOverview.html?id=' + tour.id
    seeMore.textContent = 'Saznaj vise'
    seeMore.id = 'see-more'

    row.appendChild(seeMore)

    row.classList.add('maximized')
    row.classList.remove('minimized')
}

function shrinkRow(row: TourRowElement, tour: Tour) {
    const mainDiv = document.querySelector('#catalog-container')
    const newRow = row.cloneNode(false) as HTMLElement
    newRow.classList.add('row')
    buildRow(newRow, tour)
    
    mainDiv.insertBefore(newRow, row);
    mainDiv.removeChild(row)

    newRow.classList.remove('maximized')
    newRow.classList.add('minimized')

    delete row.tourData;
    currentlyExpandedRow = null
}

function changePageSize(event) {
  const url = new URL(window.location.href);
  this.inputBoxes = event.target.value
  const totalCount = JSON.parse(localStorage.getItem('totalCount'))
  if (totalCount && ((totalCount / this.inputBoxes) < 1)) {
    url.searchParams.set("page", "1");
  }
  url.searchParams.set("pageSize", this.inputBoxes);
  window.history.replaceState({}, document.title, url.toString());
  getData()
  currentlyExpandedRow = null;
}

function changeSortBy(event) {
  const url = new URL(window.location.href);
  this.inputBoxes = event.target.value
  url.searchParams.set("orderBy", this.inputBoxes);
  window.history.replaceState({}, document.title, url.toString());
  getData()
  currentlyExpandedRow = null;
}


function changeSortDirection() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderDirection = urlParams.get("orderDirection");
  const ascButton = document.querySelector("#asc-button");
  const descButton = document.querySelector("#desc-button");

  if (orderDirection == "ASC") {
    if (!ascButton.classList.contains("active-direction")) {
      ascButton.classList.add("active-direction");

      if (ascButton.classList.contains("inactive-direction")) {
      ascButton.classList.remove("inactive-direction");
      }

      descButton.addEventListener("click", () => {
          const url = new URL(window.location.href);
          url.searchParams.set("orderDirection", "DESC");
          window.history.replaceState({}, document.title, url.toString());
          getData();
          changeSortDirection();
        },
        { once: true }
      );
    }
    if (descButton.classList.contains("active-direction")) {
      descButton.classList.remove("active-direction");
    }
    if (!descButton.classList.contains("inactive-direction")) {
        descButton.classList.add("inactive-direction");
    }
  } else if (orderDirection == "DESC") {
    if (!descButton.classList.contains("active-direction")) {
      descButton.classList.add("active-direction");

      if (descButton.classList.contains("inactive-direction")) {
      descButton.classList.remove("inactive-direction");
      }

      ascButton.addEventListener("click", () => {
          const url = new URL(window.location.href);
          url.searchParams.set("orderDirection", "ASC");
          window.history.replaceState({}, document.title, url.toString());
          getData()
          changeSortDirection()
        },
        { once: true }
      );
    }
    if (!ascButton.classList.contains("inactive-direction")) {
        ascButton.classList.add("inactive-direction")
      }
    if (ascButton.classList.contains("active-direction")) {
      ascButton.classList.remove("active-direction");
    }
  }
  currentlyExpandedRow = null;
}


function pageButtonsDisplay() {
    const currentPage = parseInt(new URLSearchParams(window.location.search).get('page') || '1');
    let pagesCount = Number(JSON.parse(localStorage.getItem('pagesCount')))
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
  paramsValidation()
  const urlParams = new URLSearchParams(window.location.search);
  let page: string | null = urlParams.get("page")
  const pageSize = urlParams.get('pageSize')
  const orderBy = urlParams.get('orderBy')
  const orderDirection = urlParams.get('orderDirection')
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

  const newUrl = `${baseUrl}?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}`;
  window.history.pushState({ path: newUrl }, '', newUrl);

  currentlyExpandedRow = null
}

function paramsValidation() {
    const params = new URLSearchParams(window.location.search);
    let page = params.get('page')
    let pageSize = params.get('pageSize')
    let orderBy = params.get('orderBy')
    let orderDirection = params.get('orderDirection')
    
    if (isNaN(Number(page)) || Number(page) === 0) {
        page = '1'
    }

    if (isNaN(Number(pageSize)) || Number(pageSize) != 5 && Number(pageSize) != 10 && Number(pageSize) != 20){
        pageSize = '5'
    }

    if (orderBy != "Name" && orderBy != "DateTime" && orderBy != "MaxGuests") {
        orderBy = "Name"
    }

    if (orderDirection != "DESC" && orderDirection != "ASC") {
        orderDirection = "DESC"
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const newUrl = `${baseUrl}?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}