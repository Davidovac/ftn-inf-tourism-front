const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const guideToursLink = document.querySelector('#guide-tours') as HTMLElement;
const restaurantsLink = document.querySelector('#restaurants') as HTMLElement;
const toursCatalogLink = document.querySelector('#tours-catalog') as HTMLElement;
const userReservationsLink = document.querySelector('#user-reservations') as HTMLElement;
const restaurantsMap = document.querySelector('#restaurants-map') as HTMLElement;
const totalChart = document.getElementById('total-chart') as HTMLCanvasElement;

import { ReservationService } from "../dist/restaurants/services/reservations.service.js";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const restaurantReservationService = new ReservationService();

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        const role = localStorage.getItem('role');

        guideToursLink.style.display = 'none';
        restaurantsLink.style.display = 'none';
        toursCatalogLink.style.display = 'none';
        userReservationsLink.style.display = 'none';
        restaurantsMap.style.display = 'none';
        
        if (role === 'vlasnik') {
            restaurantsLink.style.display = 'block';
            getChartData()
        }
        else if (role === 'vodic') {
            guideToursLink.style.display = 'block';
            toursCatalogLink.style.display = 'block';
        }
        else if (role === 'turista') {
            toursCatalogLink.style.display = 'block';
            userReservationsLink.style.display = 'block';
            restaurantsLink.style.display = 'block';
            restaurantsMap.style.display = 'block';
        }

        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        guideToursLink.style.display = 'none';
        restaurantsLink.style.display = 'none';
        toursCatalogLink.style.display = 'block';
        userReservationsLink.style.display = 'none';
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}


function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    if (localStorage.getItem('userId')){
    localStorage.removeItem('userId');
    }
    if (localStorage.getItem('vlasnikId')){
    localStorage.removeItem('vlasnikId');
    }
    if (localStorage.getItem('guideId')){
        localStorage.removeItem('guideId')
    }
    setUserLoginState(false);
}

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        setUserLoginState(true);
    } else {
        setUserLoginState(false);
    }
}

const logoutElement = document.querySelector('#logout');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

checkLoginStatus();

async function getChartData(){
    const ownerId = parseInt(localStorage.getItem('vlasnikId'))
    if(!ownerId) return;

    try{
        const chartData = await restaurantReservationService.getAllStats(ownerId);


        const restaurantNames = chartData.map(r => r.name);
        const reservationCounts = chartData.map(r => r.totalReservations);

        new Chart(totalChart, {
            type: 'bar',
            data: {
                labels: restaurantNames,
                datasets: [{
                    label: 'Broj rezervacija',
                    data: reservationCounts,
                    backgroundColor: '#003153',
                    borderColor: '#b96d34',
                    borderWidth: 1,
                    barThickness: 70,
                    minBarLength: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Rezervacije po restoranima (tekuća godina)'
                    }
                },
                onClick: function (event) {
                const chart = this as Chart;

                const elements = chart.getElementsAtEventForMode(
                    event as unknown as Event,
                    'nearest',
                    { intersect: false },
                    true
                );

                if (!elements.length) {
                    console.log("Klik nije registrovao stub.");
                    return;
                }

                const index = elements[0].index;
                const selectedRestaurant = chartData[index];
                if (!selectedRestaurant) return;

                const restaurantId = selectedRestaurant.id;
                goToRestaurantStats(restaurantId);
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 0
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Greška prilikom učitavanja grafikona:", error);
    }

    function goToRestaurantStats(restaurantData){
        const params = new URLSearchParams({
        id: restaurantData,
        });
        window.location.href = `/restaurants/pages/restaurantStats/restaurantStats.html?${params.toString()}`;
    }
}