// main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- ახალი: ავტორიზაციის UI-ის განახლების ლოგიკა ---
    const handleAuthUI = () => {
        const token = localStorage.getItem('token');
        const userFullName = localStorage.getItem('userFullName');

        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.getElementById('user-info');
        const userNameSpan = document.getElementById('user-name');
        const logoutBtn = document.getElementById('logout-btn');

        if (token && userFullName) {
            // თუ მომხმარებელი ავტორიზებულია
            if (authButtons) authButtons.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (userNameSpan) userNameSpan.textContent = ` ${userFullName}`;

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    // ლოკალური მეხსიერების გასუფთავება
                    localStorage.removeItem('token');
                    localStorage.removeItem('userFullName');
                    // გადამისამართება მთავარ გვერდზე
                    window.location.href = 'index.html';
                });
            }
        } else {
            // თუ მომხმარებელი არ არის ავტორიზებული
            if (authButtons) authButtons.style.display = 'flex';
            if (userInfo) userInfo.style.display = 'none';
        }
    };

    // ამ ფუნქციის გამოძახება ყოველი გვერდის ჩატვირთვისას
    handleAuthUI();
    // --- ახალი ლოგიკის დასასრული ---


    // Hamburger Menu Toggle Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Particles.js for Background Effect
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: { number: { value: 80, density: { enable: true, value_area: 800 } }, color: { value: '#d4af37' }, shape: { type: 'circle' }, opacity: { value: 0.7, random: true }, size: { value: 2, random: true }, move: { enable: true, speed: 0.5, direction: 'none', random: true, out_mode: 'out' } },
            interactivity: { events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } } }
        });
    }

    // UNIVERSAL IMAGE MODAL LOGIC (ეს კოდი უცვლელია)
    const modalHTML = `
        <div class="image-modal">
            <div class="image-modal-content">
                <span class="image-modal-close">&times;</span>
                <img src="" alt="Enlarged Bouquet">
                <div class="image-modal-details">
                    <h3 class="image-modal-title"></h3>
                    <p class="image-modal-price"></p>
                </div>
            </div>
        </div>
    `;
    if (!document.querySelector('.image-modal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const imageModal = document.querySelector('.image-modal');
    const modalImage = imageModal.querySelector('img');
    const modalTitle = imageModal.querySelector('.image-modal-title');
    const modalPrice = imageModal.querySelector('.image-modal-price');
    const closeModalBtn = imageModal.querySelector('.image-modal-close');

    const productImages = document.querySelectorAll('.offer-item img, .carousel-item img, .special-bouquet-item img');

    productImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            const parent = e.target.closest('.offer-item, .carousel-item, .special-bouquet-item');
            if (parent) {
                const title = parent.querySelector('h3').textContent;
                const priceElement = parent.querySelector('.price, .new-price');
                const price = priceElement ? priceElement.textContent : '';

                modalImage.src = img.src;
                modalTitle.textContent = title;
                modalPrice.textContent = price;
                imageModal.classList.add('active');
            }
        });
    });

    const closeModal = () => {
        imageModal.classList.remove('active');
    };

    closeModalBtn.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });
});
