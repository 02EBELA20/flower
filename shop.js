document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const offerItems = document.querySelectorAll('.offer-item');
    const modal = document.getElementById('cardModal');
    const closeModal = document.querySelector('.modal .close');

    // --- Filter Logic ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Manage active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Show/hide items based on filter
            offerItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Modal Logic ---
    offerItems.forEach(item => {
        const image = item.querySelector('img');
        image.addEventListener('click', () => {
            // Get data from the clicked item
            const imgSrc = image.src;
            const title = item.querySelector('h3').textContent;
            const price = item.querySelector('.price').textContent;
            // Assuming a hidden description paragraph exists for the modal
            const description = item.querySelector('.description') ? item.querySelector('.description').textContent : "Detailed description coming soon.";

            // Populate modal content
            document.getElementById('modalImage').src = imgSrc;
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalPrice').textContent = price;
            document.getElementById('modalDescription').textContent = description;
            
            // Show the modal
            modal.classList.add('active');
        });
    });

    // Close modal when 'x' is clicked
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close modal when clicking outside the content
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Note: Petals canvas or other unique animations for this page would also go here.
});
