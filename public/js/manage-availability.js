document.addEventListener('DOMContentLoaded', fetchAvailability);

document.getElementById('availabilityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dayOfWeek = document.getElementById('dayOfWeek').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    try {
        const response = await fetch('/api/availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ dayOfWeek, startTime, endTime })
        });

        if (response.ok) {
            alert('Availability set successfully');
            fetchAvailability();
        } else {
            const data = await response.json();
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

async function fetchAvailability() {
    try {
        const response = await fetch(`/api/availability/provider/${getUserId()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const availability = await response.json();
        displayAvailability(availability);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching availability.');
    }
}

function displayAvailability(availability) {
    const availabilityDiv = document.getElementById('currentAvailability');
    availabilityDiv.innerHTML = '<h2>Current Availability</h2>';
    availability.forEach(slot => {
        availabilityDiv.innerHTML += `
            <div>
                <p>${slot.day_of_week}: ${slot.start_time} - ${slot.end_time}</p>
                <button onclick="deleteAvailability(${slot.id})">Delete</button>
            </div>
        `;
    });
}

async function deleteAvailability(id) {
    try {
        const response = await fetch(`/api/availability/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('Availability deleted successfully');
            fetchAvailability();
        } else {
            const data = await response.json();
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

function getUserId() {
    // Implement this function to get the current user's ID from the JWT token
    // This is a placeholder and should be replaced with actual logic
    return 'current_user_id';
}

