import { ToursStatsData } from "../../model/toursStatsData.model.js";
import { ToursService } from "../../service/tours.service.js";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const toursService = new ToursService()

document.addEventListener('DOMContentLoaded', initialize)

function initialize(): void{
  if (localStorage.role != 'vodic'){
    window.location.href = "/users/pages/login/login.html"
  }
    const guideId = JSON.parse(localStorage.getItem('guideId'))
    toursService.getToursStatsByGuide(guideId)
    .then(data => {
        renderData(data)
    })
    .catch(error =>{
        console.error(error.status, error.text)
    })
}

function renderData(toursStatsData: ToursStatsData) {
    const mostReservedChart = document.querySelector('#most-reserved') as HTMLCanvasElement;
    const leastReservedChart = document.querySelector('#least-reserved') as HTMLCanvasElement;
    const mostFilledChart = document.querySelector('#most-filled') as HTMLCanvasElement;
    const leastFilledChart = document.querySelector('#least-filled') as HTMLCanvasElement;
    const naslov = document.querySelector('h2')
    if (toursStatsData.mostReserved.length != 0 || toursStatsData.leastReserved.length != 0 || toursStatsData.mostFilled.length != 0 || toursStatsData.leastFilled.length != 0) {
        naslov.textContent = "Vasa statistika tura"
    }
    else {
        naslov.textContent = "Statistiku nije moguce obraditi zbog manjka podataka"
        naslov.style.marginTop = "30vh"
        const mainDiv = document.querySelector('#main-container') as HTMLElement
        mainDiv.innerHTML = ""
    }

    const label1: string[] = []
    const stats1: number[] = [] 
    toursStatsData.mostReserved.forEach(tour => {
        label1.push(tour.name)
        stats1.push(tour.reservationsSum)
    })
    const label2: string[] = []
    const stats2: number[] = [] 
    toursStatsData.leastReserved.forEach(tour => {
        label2.push(tour.name)
        stats2.push(tour.reservationsSum)
    })
    const label3: string[] = []
    const stats3: number[] = [] 
    toursStatsData.mostFilled.forEach(tour => {
        label3.push(tour.name)
        stats3.push(tour.reservationRate)
    })
    const label4: string[] = []
    const stats4: number[] = [] 
    toursStatsData.leastFilled.forEach(tour => {
        label4.push(tour.name)
        stats4.push(tour.reservationRate)
    })

    new Chart(mostReservedChart, {
                type: 'bar',
                data: {
                    labels: label1,
                    datasets: [{
                        label: 'Broj rezervacija(rastuce)',
                        data: stats1,
                        backgroundColor: '#003153',
                        borderColor: '#b96d34',
                        borderWidth: 1,
                        barThickness: 50,
                        minBarLength: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Broj rezervacija (rastuce)'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });

            new Chart(leastReservedChart, {
                type: 'bar',
                data: {
                    labels: label2,
                    datasets: [{
                        label: 'Broj rezervacija',
                        data: stats2,
                        backgroundColor: '#003153',
                        borderColor: '#b96d34',
                        borderWidth: 1,
                        barThickness: 50,
                        minBarLength: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Broj rezervacija (opadajuce)'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });


            new Chart(mostFilledChart, {
                type: 'bar',
                data: {
                    labels: label3,
                    datasets: [{
                        label: 'Procenat popunjenosti',
                        data: stats3,
                        backgroundColor: '#003153',
                        borderColor: '#b96d34',
                        borderWidth: 1,
                        barThickness: 50,
                        minBarLength: 1,
                        barPercentage: 100
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Procenat popunjenosti (rastuce)'
                        }
                    },
                    scales: {
                       y: {
                            min: 0,
                            max: 100,
                            beginAtZero: true,
                            ticks: {
                                stepSize: 10,
                                callback: value => value + '%'
                            }
                        }
                    }
                }
            });

            new Chart(leastFilledChart, {
                type: 'bar',
                data: {
                    labels: label4,
                    datasets: [{
                        label: 'Procenat popunjenosti',
                        data: stats4,
                        backgroundColor: '#003153',
                        borderColor: '#b96d34',
                        borderWidth: 1,
                        barThickness: 50,
                        minBarLength: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Procenat popunjenosti (opadajuce)'
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            beginAtZero: true,
                            ticks: {
                                stepSize: 10,
                                callback: value => value + '%'
                            }
                        }
                    }
                }
            });
}