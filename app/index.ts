const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
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
