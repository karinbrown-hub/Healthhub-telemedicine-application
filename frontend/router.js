// frontend/router.js

 export const routes = {
    '/': 'index.html',
    '/login': '/frontend/login.html',
    '/register': '/frontend/register.html',
    '/dashboard': '/frontend/dashboard.html',
    '/patient-dashboard': '/frontend/patient-dashboard.html',
    '/provider-dashboard': '/frontend/provider-dashboard.html',
    '/admin-dashboard': '/frontend/admin-dashboard.html',
    '/search': '/frontend/search.html',
    '/appointments': '/frontend/appointments.html',
    '/video-chat': '/frontend/video-chat.html',
    '/profile': '/frontend/profile.html',
    '/forgot-password': '/frontend/forgot-password.html',
    '/reset-password': '/frontend/reset-password.html',
    '/change-password': '/frontend/change-password.html'
};
export function router() {
console.log('Router.js loaded');

let path = window.location.hash.slice(1) || '/';
const route = routes[path];
console.log('Current path:', path);
console.log('Loading route:', route);

if (route) {
    fetch(route)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.text();
        })
        .then(content => {
            const appDiv = document.getElementById('app');
            if (appDiv) {
                appDiv.innerHTML = ''; // Clear existing content
                appDiv.innerHTML = content;
            } else {
                console.error('Error: No element with id "app" found');
            }
        })
        .catch(error => {
            console.error('Error loading page:', error);
            const appDiv = document.getElementById('app');
            if (appDiv) {
                appDiv.innerHTML = '<h1>404 - Page Not Found</h1>';
            } else {
                console.error('Error: No element with id "app" found');
            }
        });
} else {
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.innerHTML = '<h1>404 - Page Not Found</h1>';
    } else {
        console.error('Error: No element with id "app" found');
    }
}
}

