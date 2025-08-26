// auth.js

document.addEventListener('DOMContentLoaded', () => {
    // --- რეგისტრაციის ფორმის ლოგიკა ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert("პაროლები არ ემთხვევა!");
                return;
            }

            const userData = { fullName, email, password };

            try {
                const response = await fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                if (response.status === 201) {
                    alert('რეგისტრაცია წარმატებით დასრულდა! ახლა შეგიძლიათ გაიაროთ ავტორიზაცია.');
                    window.location.href = 'login.html';
                } else {
                    alert(`რეგისტრაციის შეცდომა: ${result.message}`);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ მოგვიანებით.');
            }
        });
    }

    // --- ავტორიზაციის (Login) ფორმის ლოგიკა ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const userData = { email, password };

            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                if (response.ok) {
                    // თუ ავტორიზაცია წარმატებულია
                    alert(`მოგესალმებით, ${result.fullName}!`);
                    
                    // --- ყველაზე მნიშვნელოვანი ნაწილი ---
                    // ვინახავთ მიღებულ ტოკენს ბრაუზერის მეხსიერებაში (localStorage)
                    // ეს ტოკენი დაგვჭირდება იმის დასადასტურებლად, რომ მომხმარებელი ავტორიზებულია
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('userFullName', result.fullName);
                    
                    // გადამისამართება მთავარ გვერდზე
                    window.location.href = 'index.html';
                } else {
                    // თუ სერვერმა დააბრუნა შეცდომა
                    alert(`ავტორიზაციის შეცდომა: ${result.message}`);
                }

            } catch (error) {
                console.error('Error during login:', error);
                alert('დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ მოგვიანებით.');
            }
        });
    }
});
