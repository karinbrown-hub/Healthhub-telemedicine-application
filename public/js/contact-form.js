document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  
  form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
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
              form.reset(); // Reset the form after successful submission
          } else {
              throw new Error('Form submission failed');
          }
      } catch (error) {
          console.error('Error:', error);
          showNotification('An error occurred. Please try again.', 'error');
      }
  });
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