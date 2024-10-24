document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await authenticatedFetch('/api/profile');
        const userData = await response.json();
        
        document.getElementById('firstName').value = userData.first_name;
        document.getElementById('lastName').value = userData.last_name;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('dateOfBirth').value = userData.date_of_birth;
        document.getElementById('gender').value = userData.gender;
        document.getElementById('address').value = userData.address;
    } catch (error) {
        console.error('Error fetching user data:', error);
        showAlert('Error fetching user data', 'error');
    }
});

document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await authenticatedFetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Profile updated successfully');
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('An error occurred. Please try again.', 'error');
    }
});
