document.addEventListener('DOMContentLoaded', () => {

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

    // ========================================= //
    // =========== UNIVERSAL IMAGE MODAL LOGIC ========= //
    // ========================================= //

    // 1. Create the modal structure dynamically
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
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 2. Get references to modal elements
    const imageModal = document.querySelector('.image-modal');
    const modalImage = imageModal.querySelector('img');
    const modalTitle = imageModal.querySelector('.image-modal-title');
    const modalPrice = imageModal.querySelector('.image-modal-price');
    const closeModalBtn = imageModal.querySelector('.image-modal-close');

    // 3. Find all clickable product images
    const productImages = document.querySelectorAll('.offer-item img, .carousel-item img, .special-bouquet-item img');

    // 4. Add click event listener to each image
    productImages.forEach(img => {
        img.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
        img.addEventListener('click', (e) => {
            const parent = e.target.closest('.offer-item, .carousel-item, .special-bouquet-item');
            
            if (parent) {
                const title = parent.querySelector('h3').textContent;
                const priceElement = parent.querySelector('.price, .new-price');
                const price = priceElement ? priceElement.textContent : '';

                // Populate and show the modal
                modalImage.src = img.src;
                modalTitle.textContent = title;
                modalPrice.textContent = price;
                imageModal.classList.add('active');
            }
        });
    });

    // 5. Function to close the modal
    const closeModal = () => {
        imageModal.classList.remove('active');
    };

    // 6. Add event listeners to close the modal
    closeModalBtn.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => {
        // Close if the dark overlay is clicked, but not the content inside it
        if (e.target === imageModal) {
            closeModal();
        }
    });
});
