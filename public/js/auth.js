// // Token handling functions
// function setToken(token) {
//     localStorage.setItem('token', token);
// }

// function getToken() {
//     return localStorage.getItem('token');
// }

// function removeToken() {
//     localStorage.removeItem('token');
// }

// function isLoggedIn() {
//     return !!getToken();
// }

// // API call function with authentication
// async function authenticatedFetch(url, options = {}) {
//     const token = getToken();
//     if (token) {
//         options.headers = {
//             ...options.headers,
//             'Authorization': `Bearer ${token}`
//         };
//     }
//     const response = await fetch(url, options);
//     if (response.status === 401) {
//         // Token is invalid or expired
//         removeToken();
//         window.location.href = '/login.html';
//         throw new Error('Authentication failed');
//     }
//     return response;
// }

// async function login(email, password) {
//     try {
//         const loginButton = document.querySelector('#loginForm button');
//         loginButton.disabled = true;
//         loginButton.textContent = 'Logging in...';

//         const response = await fetch('/api/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await response.json();

//         // if (response.ok) {
//         //     setToken(data.token);
//         //     window.location.href = '/dashboard.html';
//         if (response.ok) {
//             setToken(data.token);
//             // Store user type in localStorage
//             localStorage.setItem('userType', data.userType);
//             localStorage.setItem('userId', data.userId);
//             // Redirect based on user type
//             switch(data.userType) {
//                 case 'patient':
//                     window.location.href = '/patient-dashboard.html';
//                     break;
//                 case 'provider':
//                     window.location.href = '/provider-dashboard.html';
//                     break;
//                 case 'admin':
//                     window.location.href = '/admin-dashboard.html';
//                     break;
//                 default:
//                     // Handle unexpected user type
//                     console.error('Unknown user type:', data.userType);
//                     showAlert('Login successful, but unable to determine user type. Please contact support.', 'warning');
//                     // Optionally, you could redirect to a generic page or stay on the login page
//                     // window.location.href = '/account.html';
//             }
//         } else {
//             showAlert(data.message || 'Login failed. Please try again.', 'error');
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//         showAlert('An error occurred. Please try again.', 'error');
//     } finally {
//         const loginButton = document.querySelector('#loginForm button');
//         loginButton.disabled = false;
//         loginButton.textContent = 'Login';
//     }
// }
// Utility Functions
function showAlert(message, type = 'success') {
    const alertElement = document.getElementById('alert');
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}

// Token handling functions
function setToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

function isLoggedIn() {
    return !!getToken();
}

// API Functions
async function authenticatedFetch(url, options = {}) {
    const token = getToken();
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    const response = await fetch(url, options);
    if (response.status === 401) {
        removeToken();
        window.location.href = '/login';
        throw new Error('Authentication failed');
    }
    return response;
}

// Authentication Functions
async function login(email, password) {
    try {
        const loginButton = document.querySelector('#loginForm button');
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setToken(data.token);
            localStorage.setItem('userType', data.userType);
            localStorage.setItem('userId', data.userId);

            switch(data.userType) {
                case 'patient':
                    window.location.replace('/patient-dashboard');
                    break;
                case 'provider':
                    window.location.replace('/provider-dashboard');
                    break;
                case 'admin':
                    window.location.replace('/admin-dashboard');
                    break;
                default:
                    console.error('Unknown user type:', data.userType);
                    showAlert('Login successful, but unable to determine user type. Please contact support.', 'warning');
            }
        } else {
            showAlert(data.message || 'Login failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred. Please try again.', 'error');
    } finally {
        const loginButton = document.querySelector('#loginForm button');
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
}

function logout() {
    removeToken();
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    window.location.replace('/login');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showAlert('Please enter both email and password.', 'error');
                return;
            }

            await login(email, password);
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

