const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const restaurantsLink = document.querySelector('#restaurants') as HTMLElement;

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        const role = localStorage.getItem('role');
        if (role === 'vlasnik') {
            restaurantsLink.style.display = 'block';
        } else {
            restaurantsLink.style.display = 'none';
        }

        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        restaurantsLink.style.display = 'none';
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
