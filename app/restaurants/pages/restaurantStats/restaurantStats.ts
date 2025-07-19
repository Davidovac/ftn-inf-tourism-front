import { ReservationService } from "../../services/reservations.service";

const restaurantReservationService = new ReservationService();
const ownerId = parseInt(localStorage.getItem('vlasnikId'))
const params = new URLSearchParams(window.location.search);
const restaurantId = parseInt(params.get('id') || '');
const percentChart = document.getElementById('percent-chart') as HTMLCanvasElement;
const reservationChart = document.getElementById('reservation-chart') as HTMLCanvasElement;
const header = document.getElementById('header') as HTMLElement;
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


async function getChartData(){
    if(!ownerId){
        return;
    }
    try{
        const chartData = await restaurantReservationService.getRestaurantSummaryStats(restaurantId, ownerId);

        header.textContent = chartData.name;
        const percentData = Object.values(chartData.monthlyOccupancy);
        const reservationData = Object.values(chartData.monthlyCounts);
        const months = Object.keys(chartData.monthlyCounts);

        new Chart(percentChart, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Procenat popunjenosti',
                    data: percentData,
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
                        text: 'Procenat popunjenosti po mesecima'
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

        new Chart(reservationChart, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Broj rezervacija',
                    data: reservationData,
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
                        text: 'Broj rezervacija po mesecima'
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
    }
    catch(error){
        console.error("Greška prilikom učitavanja grafikona:", error);
    }
}

getChartData();