import { UserService } from "../../service/user.service.js";

const userService = new UserService();
const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const submitButton = document.querySelector("#submit") as HTMLElement;
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
            toursCatalogLink.style.display = 'block';
        }

        if (role === 'vodic') {
            guideToursLink.style.display = 'block';
            toursCatalogLink.style.display = 'block';
        }

        if (role === 'turista') {
            toursCatalogLink.style.display = 'block';
            userReservationsLink.style.display = 'block';
        }

        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        guideToursLink.style.display = 'none';
        restaurantsLink.style.display = 'none';
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

function handleLogin(event: Event) {
    event.preventDefault();

    const form = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    userService.login(username, password)
        .then((user) => {
            localStorage.setItem('username', user.username);
            localStorage.setItem('role', user.role);
            localStorage.setItem('userId', user.id.toString())
            if (user.role === "vlasnik") {
              localStorage.setItem("vlasnikId", user.id.toString());
            } else {
              if (localStorage.getItem("vlasnikId")) {
                localStorage.removeItem("vlasnikId");
              }
            }
            if (user.role === "vodic") {
              localStorage.setItem("guideId", user.id.toString());
            } else {
              if (localStorage.getItem("guideId")) {
                localStorage.removeItem("guideId");
              }
            }
            if (user.role === "turista") {
                localStorage.setItem("userId", user.id.toString());
            } else {
              if (localStorage.getItem("userId")) {
                localStorage.removeItem("userId");
              }
            }
            setUserLoginState(true);
            window.location.href = "../../../../app/index.html"
        })
        .catch((error) => {
            console.error('Login failed', error.message);
        });
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
    if (localStorage.getItem('ownerId')){
        localStorage.removeItem('ownerId')
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

if (submitButton) {
    submitButton.addEventListener("click", handleLogin);
}

const logoutElement = document.querySelector('#logout');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

checkLoginStatus();
