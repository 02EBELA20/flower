// password-reset.js
// მართავს პაროლის აღდგენის მოთხოვნას და პაროლის შეცვლას
document.addEventListener('DOMContentLoaded', () => {
    // Forgot password form
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            try {
                const response = await fetch('http://localhost:5000/api/request-password-reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();
                if (response.ok) {
                    // რეალურ სისტემაში მომხმარებელს ელფოსტით მიუვა ბმული.
                    // ტესტირებისას ვაჩვენებთ alert-ით
                    let msg = 'If that email exists, a reset link has been sent.';
                    if (data.resetLink) {
                        msg += `\nFor testing, use this link: ${data.resetLink}`;
                    }
                    alert(msg);
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Something went wrong.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // Reset password form
    const resetForm = document.getElementById('reset-password-form');
    if (resetForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (!token) {
            alert('Invalid or missing reset token.');
        }
        resetForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, password })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Your password has been reset successfully. You can now log in with your new password.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Password reset failed.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred. Please try again later.');
            }
        });
    }
});
