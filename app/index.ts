const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const guideToursLink = document.querySelector('#guide-tours') as HTMLElement;
const restaurantsLink = document.querySelector('#restaurants') as HTMLElement;
const toursCatalogLink = document.querySelector('#tours-catalog') as HTMLElement;
const userReservationsLink = document.querySelector('#user-reservations') as HTMLElement

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        const role = localStorage.getItem('role');

        guideToursLink.style.display = 'none';
        restaurantsLink.style.display = 'none';
        toursCatalogLink.style.display = 'none';
        userReservationsLink.style.display = 'none';
        
        if (role === 'vlasnik') {
            restaurantsLink.style.display = 'block';
        }

        if (role === 'vodic') {
            guideToursLink.style.display = 'block';
            toursCatalogLink.style.display = 'block';
        }

        if (role === 'turista') {
            toursCatalogLink.style.display = 'block';
            userReservationsLink.style.display = 'block';
            restaurantsLink.style.display = 'block';
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
