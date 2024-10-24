document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password reset email sent. Please check your inbox.');
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
