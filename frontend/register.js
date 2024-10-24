// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('registerForm');
//     const userTypeSelect = document.getElementById('userType');
//     const specializationField = document.getElementById('specializationField');
//     const specializationInput = document.getElementById('specialization');
//     console.log("register.js loaded");

//     userTypeSelect.addEventListener('change', function() {
//         if (this.value === 'provider') {
//             specializationField.classList.remove('hidden');
//             specializationInput.required = true;
//         } else {
//             specializationField.classList.add('hidden');
//             specializationInput.required = false;
//             specializationInput.value = '';
//         }
//     });
//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const formData = new FormData(form);
//         const data = Object.fromEntries(formData.entries());
    
//         // Check if passwords match
//         if (data.password !== data.confirmPassword) {
//             alert('Passwords do not match');
//             return;
//         }
    
//         // Remove confirmPassword before sending
//         delete data.confirmPassword;
        
//         // If user type is not provider, remove specialization from data
//         if (data.userType !== 'provider') {
//             delete data.specialization;
//         }
    
//         try {
//             const response = await fetch('/api/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data)
//             });
    
//             if (response.ok) {
//                 // Handle successful registration
//                 const result = await response.json();
//                 alert(result.message);
//                 // You might want to clear the form or reset it
//                 form.reset();
//                 // Redirect to login page
//                 window.location.href = '/login.html';
//             } else {
//                 // Handle error
//                 const errorData = await response.json();
//                 // Display a more user-friendly error message
//                 if (errorData.message) {
//                     alert(`Registration failed: ${errorData.message}`);
//                 } else {
//                     alert('Registration failed. Please try again.');
//                 }
//                 // You might want to log the full error for debugging
//                 console.error('Registration error:', errorData);
//             }
//         } catch (error) {
//             // Handle network errors or other exceptions
//             console.error('Error:', error);
//             alert('An error occurred while trying to register. Please check your internet connection and try again.');
//         }
//     });
// });
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const userTypeSelect = document.getElementById('userType');
    const specializationField = document.getElementById('specializationField');
    const specializationInput = document.getElementById('specialization');
    console.log("register.js loaded");

    userTypeSelect.addEventListener('change', function() {
        if (this.value === 'provider') {
            specializationField.classList.remove('hidden');
            specializationInput.required = true;
        } else {
            specializationField.classList.add('hidden');
            specializationInput.required = false;
            specializationInput.value = '';
        }
    });

    form.addEventListener('submit', async (e) => {
        console.log('Form submitted'); 
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
    
        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        // Remove confirmPassword before sending
        delete data.confirmPassword;
    
        // If user type is not provider, remove specialization from data
        if (data.userType !== 'provider') {
            delete data.specialization;
        }
    
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const result = await response.json();
                alert('Registered successfully!'); // or use a more sophisticated notification system
                form.reset();
                
     console.log('Redirecting to /login...'); // Add this log
    try {
        window.location.href = '/login';
        
        console.log('Redirect command executed'); // Add this log
    } catch (e) {
        console.error('Redirect failed:', e); // Add this log
    }  
            } else {
                // Handle error
                const errorData = await response.json();
                // Display a more user-friendly error message
                if (errorData.message) {
                    alert(`Registration failed: ${errorData.message}`);
                } else {
                    alert('Registration failed. Please try again.');
                }
                // You might want to log the full error for debugging
                console.error('Registration error:', errorData);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error:', error);
            alert('An error occurred while trying to register. Please check your internet connection and try again.');
        }
    });
});