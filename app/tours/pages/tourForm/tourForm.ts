import { Tour } from "../../model/tour.model.js";
import { TourFormData } from "../../model/tourFormData.model.js";
import { ToursService } from "../../service/tours.service.js";

const toursService = new ToursService()

function initializeForm(): void{
    if (!localStorage.getItem('guideId')){
        window.location.href = "../../../index.html"
    }
    const submitBtn = document.querySelector('button')
    submitBtn.addEventListener('click', submit)

    const urlParams = new URLSearchParams(window.location.search);
    const id: string | null = urlParams.get("id");
    
    if (id) {
      toursService.getById(id)
      .then((tour: Tour) => {
        (document.querySelector("#name") as HTMLInputElement).value = tour.name;
        (document.querySelector("#description") as HTMLInputElement).value = tour.description;
        (document.querySelector("#dateTime") as HTMLInputElement).value = tour.dateTime;
        (document.querySelector("#maxGuests") as HTMLInputElement).value = tour.maxGuests.toString();
        (document.querySelector("#status") as HTMLInputElement).value = tour.status;
      })
      .catch(error => {
        alert()
        console.error(error.status, error.text)
      })
    }
}

document.addEventListener('DOMContentLoaded', initializeForm)

function submit(): void{
    const name = (document.querySelector("#name") as HTMLInputElement).value
    const description = (document.querySelector("#description") as HTMLInputElement).value
    const dateTime = (document.querySelector("#dateTime") as HTMLInputElement).value
    const maxGuestsString = (document.querySelector("#maxGuests") as HTMLInputElement).value
    let status = (document.querySelector("#status") as HTMLInputElement).value
    if (!status.trim()){
        status = 'u pripremi'
    }

    let maxGuests: number

    const nameErrorMessage = document.querySelector('#nameError')
    nameErrorMessage.textContent = ''
    const descriptionErrorMessage = document.querySelector('#descriptionError')
    descriptionErrorMessage.textContent = ''
    const dateTimeErrorMessage = document.querySelector('#dateTimeError')
    dateTimeErrorMessage.textContent = ''
    const maxGuestsErrorMessage = document.querySelector('#maxGuestsError')
    maxGuestsErrorMessage.textContent = ''

    let errorSwitch = false

    if (name.trim() === '') {
        nameErrorMessage.textContent = 'Name is required'
        errorSwitch = true
    }
    else{
        nameErrorMessage.textContent = ''
    }

    if (description.trim() === '') {
        descriptionErrorMessage.textContent = 'Description is required'
        errorSwitch = true
    }
    else{
        descriptionErrorMessage.textContent = ''
    }

    if (dateTime.trim() === '') {
        dateTimeErrorMessage.textContent = 'Starting date and time is required'
        errorSwitch = true
    }
    else{
        dateTimeErrorMessage.textContent = ''
    }

    if (maxGuestsString.trim() === "") {
        maxGuestsErrorMessage.textContent = 'Maximum number of guests field is required'
        errorSwitch = true
    }
    else{
        maxGuestsErrorMessage.textContent = ''
        maxGuests = Number(maxGuestsString)
    }

    if (errorSwitch){
        return
    }

    const guideId = Number(localStorage.getItem('guideId'))
    const reqBody: TourFormData = {name, description, dateTime, maxGuests, status, guideId}

    toursService.addOrUpdate(reqBody)
}
