function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);

