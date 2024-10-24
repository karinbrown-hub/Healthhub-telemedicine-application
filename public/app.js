document.addEventListener('DOMContentLoaded', function() {
    // Forgot Password functionality
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const loginModal = document.getElementById('login-modal'); // Assuming this exists

    if (forgotPasswordLink && forgotPasswordModal && forgotPasswordForm) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            forgotPasswordModal.style.display = 'block';
        });

        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send a request to your backend to handle the password reset
            showNotification('Password reset link sent to your email.');
            forgotPasswordModal.style.display = 'none';
        });
    }

    // Cookie consent
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');

    if (cookieConsent && acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            cookieConsent.classList.add('hidden');
            // Set a cookie to remember user's choice
            document.cookie = "cookiesAccepted=true; max-age=31536000; path=/";
        });

        // Check if user has already accepted cookies
        if (document.cookie.indexOf("cookiesAccepted=true") > -1) {
            cookieConsent.classList.add('hidden');
        } else {
            cookieConsent.classList.remove('hidden');
        }
    }

    // Terms of Service and Privacy Policy modals
    const termsLink = document.getElementById('terms-of-service');
    const privacyLink = document.getElementById('privacy-policy');
    const termsModal = document.getElementById('terms-modal');
    const privacyModal = document.getElementById('privacy-modal');

    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.style.display = 'block';
        });
    }

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.style.display = 'block';
        });
    }

    // Close modal functionality
    const closeModals = document.querySelectorAll('.close-modal');
    closeModals.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
   // Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const formObject = Object.fromEntries(formData);

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
            });

            if (response.ok) {
                const result = await response.json();
                showNotification(result.message, 'success');
                this.reset(); // Reset the form after successful submission
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}


});



function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}
import { router } from '/frontend/router.js';

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

