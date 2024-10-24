document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    try {
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password reset successful. You can now log in with your new password.');
            window.location.href = '/login';
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
