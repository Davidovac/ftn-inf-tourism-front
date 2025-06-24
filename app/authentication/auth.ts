const loginLink = document.querySelector('#login') as HTMLElement | null;
const logoutLink = document.querySelector('#logout') as HTMLElement | null;

export function setUserLoginState(isLoggedIn: boolean) {
    if (!loginLink || !logoutLink) return;
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
    if (localStorage.getItem('userId')){
    localStorage.removeItem('userId');
    }
    if (localStorage.getItem('guideId')){
        localStorage.removeItem('guideId')
    }
    setUserLoginState(false);
    window.location.href = '../users/pages/login/login.html';

}

export function checkLoginStatus() {
    const username = localStorage.getItem('username');
    setUserLoginState(!!username);
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutElement = document.querySelector('#logout');
    if (logoutElement) {
        logoutElement.addEventListener('click', handleLogout);
    }
    checkLoginStatus();
});
