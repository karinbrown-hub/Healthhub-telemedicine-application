async function apiCall(url, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'CSRF-Token': document.getElementById('csrfToken').value
    };

    const options = {
        method,
        headers,
        credentials: 'include'
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
        // Token is expired, try to refresh
        const refreshResponse = await fetch('/api/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (refreshResponse.ok) {
            // Retry the original request
            return apiCall(url, method, body);
        } else {
            // Refresh failed, redirect to login
            window.location.href = '/login';
            throw new Error('Authentication failed');
        }
    }

    return response.json();
}

// Example usage:
async function getAppointments() {
    try {
        const appointments = await apiCall('/api/appointments');
        // Update UI with appointments data
    } catch (error) {
        console.error('Error fetching appointments:', error);
        // Handle error (show message to user, etc.)
    }
}

