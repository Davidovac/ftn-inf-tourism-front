import { Tour } from "../../model/tour.model.js";
import { TourFormData } from "../../model/tourFormData.model.js";
import { ToursService } from "../../service/tours.service.js";

const toursService = new ToursService()

function initialize(): void{
  if (localStorage.role != 'vodic'){
    window.location.href = "../../../users/pages/login/login.html"
  }
    const params = new URLSearchParams(window.location.search);
    const guideId = params.get('id')
    const toFormBtn = document.querySelector('#toForm')
    toFormBtn.textContent = 'Dodaj turu'
    toFormBtn.addEventListener("click", function () {
        window.location.href = "../tourForm/tourForm.html?page=1";
    })
    toursService.getToursByGuide(guideId)
    .then(data => {
        renderData(data.data)
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

  data.forEach((touR) => {
    toursService.getById(touR.id.toString()).then((tour) => {
      if (!localStorage.getItem("guideId")) {
        localStorage.setItem("guideId", tour.guideId.toString());
      }
      if (!tour.guide || tour.guide.username != localStorage.username) {
        return;
      }
      const tr = document.createElement("tr");

      const name = document.createElement("td");
      name.textContent = tour.name;
      tr.appendChild(name);

      const description = document.createElement("td");
      if (tour.description.length > 130){
        const descP = document.createElement('p')
        let shorter = tour.description.substring(0, 127)
        shorter += "..."
        descP.textContent = shorter

        const tooltip = document.createElement('div') as HTMLElement
        const tooltipTxt = document.createElement('span') as HTMLElement
        tooltipTxt.textContent = tour.description
        tooltip.classList.add('tooltip')
        tooltipTxt.classList.add('tooltip-text')
        tooltipTxt.style.width = '600px'
        tooltip.appendChild(tooltipTxt)
        tooltip.appendChild(descP)
        description.appendChild(tooltip)
        tr.appendChild(description)
      }
      else{
        description.textContent = tour.description;
        tr.appendChild(description);
      }

      const dateTime = document.createElement("td");
      const date = new Date(tour.dateTime);
      const formattedDate = date.toLocaleString();
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

      const publishBtnCell = document.createElement("td");
      tr.appendChild(publishBtnCell);
      const publishBtn = document.createElement("button") as HTMLButtonElement;
      publishBtn.classList.add("publish-btn");
      publishBtn.textContent = "Publish";

      if (tour.status != "objavljeno") {
        if (tour.description.length < 250 || tour.keyPoints.length < 2) {
          publishBtn.classList.add("unpublishable");
          publishBtn.disabled = true;
          publishBtn.style.backgroundColor = "#9c9c9c";
          publishBtn.style.color = "white";
          publishBtn.style.cursor = "default";
          publishBtn.addEventListener("mouseover", () => {
            const publishedBtns = document.querySelectorAll(".unpublishable");
            for (const element of publishedBtns) {
              (element as HTMLButtonElement).style.opacity = "100%";
            }
          });

          const tooltip = document.createElement('div') as HTMLElement
          const tooltipTxt = document.createElement('span') as HTMLElement
          tooltipTxt.textContent = 'Tura mora da ima makar 2 kljucne tacke i opis od makar 250 karaktera'
          tooltip.classList.add('tooltip')
          tooltipTxt.classList.add('tooltip-text')
          tooltip.appendChild(tooltipTxt)
          tooltip.appendChild(publishBtn)
          publishBtnCell.appendChild(tooltip);
        } 
        else {
          publishBtn.classList.add("publishable");
          publishBtn.disabled = false;
          publishBtn.style.backgroundColor = "#155ce0";
          publishBtn.addEventListener("click", () => {
            tour.status = "objavljeno";
            const id = tour.id;
            const name = tour.name;
            const description = tour.description;
            const dateTime = tour.dateTime;
            const maxGuests = tour.maxGuests;
            const status = tour.status;
            const guideId = tour.guideId;
            const keyPoints = tour.keyPoints;
            const reqBody: TourFormData = {id, name, description, dateTime, maxGuests, status, guideId, keyPoints};
            toursService.addOrUpdate(reqBody)
              .then(() => {
                window.location.assign(window.location.href);
              })
              .catch((error) => {
                console.error(error.status, error.message);
              });
          });
          publishBtnCell.appendChild(publishBtn);
        }
      } else if (tour.status && tour.status === "objavljeno") {
        publishBtn.classList.add("published");
        publishBtn.textContent = "Published";
        publishBtn.disabled = true;
        publishBtn.style.backgroundColor = "white";
        publishBtn.style.color = "grey";
        publishBtn.style.cursor = "default";
        publishBtn.addEventListener("mouseover", () => {
          const publishedBtns = document.querySelectorAll(".published");
          for (const element of publishedBtns) {
            (element as HTMLButtonElement).style.opacity = "100%";
          }
        });
        publishBtnCell.appendChild(publishBtn);
      }

      tr.appendChild(publishBtnCell);

      editBtn.addEventListener("click", function () {
        window.location.href =
          "../tourForm/tourForm.html?id=" + tour.id + "&page=1";
      });
      editBtn.style.backgroundColor = '#ffe365'
      editBtn.style.color = 'black'
      editBtnCell.appendChild(editBtn);

      const deleteBtnCell = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", function () {
        if (confirm(`Are you sure you want to delete tour: ${tour.name}?`)) {
          toursService.delete(tour.id)
          .then(() => {
            alert("Tura " + tour.name + " je uspesno obrisana");
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
      tr.appendChild(deleteBtnCell);

      if (tour.ratings && tour.ratings.length > 0) {
        tr.style.cursor = "pointer";
        tr.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          renderReviewes(tour)
        })
      }

      tr.classList.add('row')
      table.appendChild(tr);
    });
  });
}

function renderReviewes(tour: Tour) {
  const fakeParent = document.createElement('div')
  fakeParent.id = 'fake-parent'
  const parentContainer = document.createElement('div')
  parentContainer.id = 'review-container';
  const reviewSegment = document.createElement('div')
  reviewSegment.id = 'review-block'
  const header = document.createElement('div')
  header.id = 'header-block';
  const tourH2 = document.createElement('h2')
  tourH2.textContent = "Ocene za: " + tour.name;
  const closeSpan = document.createElement('span')
  closeSpan.id = 'close-button';
  closeSpan.innerHTML = "&times;"

  closeSpan.addEventListener("click", () => {
    const body = document.querySelector('body')
    const fakeParent = document.getElementById("fake-parent") as HTMLElement;
    body.removeChild(fakeParent)
  })

  header.appendChild(tourH2)
  header.appendChild(closeSpan)

  parentContainer.appendChild(header)
  parentContainer.appendChild(reviewSegment)

  if (tour.ratings && tour.ratings.length > 0) {
    for (const element of tour.ratings) {

      const ratingBox = document.createElement('div');
      ratingBox.classList.add('rating-box')
      const ratingHeaderDiv = document.createElement('div')
      ratingHeaderDiv.id = 'rating-header'
      const ratingText = document.createElement('p');
      ratingText.textContent = "Ocenjeno sa: " + element.rating + "⭐";
      ratingText.style.fontWeight = 'bolder';
      const author = document.createElement('p')
      author.id = 'rating-author';
      author.textContent = "by: " + element.user.username;
      const commentLabel = document.createElement('p');
      commentLabel.style.fontWeight = 'bolder';
      commentLabel.classList.add('label');
      commentLabel.textContent = "Komentar korisnika:"
      const commentText = document.createElement('p');
      commentText.textContent = element.comment;
      commentText.id = 'comment';

      ratingHeaderDiv.appendChild(ratingText)
      ratingHeaderDiv.appendChild(author)
      ratingBox.appendChild(ratingHeaderDiv)
      ratingBox.appendChild(commentLabel)
      ratingBox.appendChild(commentText)
      reviewSegment.appendChild(ratingBox)

      if (element.rating == 2 || element.rating == 3) {
        ratingBox.style.backgroundColor = "orange"
      }

      if (element.rating == 1) {
        ratingBox.style.backgroundColor = "red"
      }
    }
  }
  fakeParent.appendChild(parentContainer)
  const body = document.querySelector('body')
  body.appendChild(fakeParent)
}

document.addEventListener('DOMContentLoaded', initialize)