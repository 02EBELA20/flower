
// Particles.js for header
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#d4af37' },
        shape: { type: 'circle' },
        opacity: { value: 0.7, random: true },
        size: { value: 2, random: true },
        move: { enable: true, speed: 0.5, direction: 'none', random: true, out_mode: 'out' }
    },
    interactivity: {
        events: { 
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' }
        }
    }
});


// Smooth scroll for navigation and external page redirects
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Check if the link is an in-page anchor (starts with #)
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = document.querySelector(href);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // For external pages (e.g., shop.html, about.html), allow default behavior
    });
});

// Carousel functionality (for index.html) - Horizontal Carousel
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        let currentIndex = 0;
        const totalItems = carouselItems.length;
        const itemWidth = carouselItems[0].offsetWidth + 40; // 350px (სიგანე) + 40px (მარჯინი)

        // Clone items for infinite scroll
        const clonesPerSide = Math.ceil(window.innerWidth / itemWidth) + 1;
        for (let i = 0; i < clonesPerSide; i++) {
            carouselItems.forEach(item => {
                const cloneStart = item.cloneNode(true);
                const cloneEnd = item.cloneNode(true);
                carousel.appendChild(cloneStart);
                carousel.insertBefore(cloneEnd, carouselItems[0]);
            });
        }

        // Update total items after cloning
        const updatedItems = document.querySelectorAll('.carousel-item');
        const updatedTotalItems = updatedItems.length;

        // Set initial position to start with the first original item in the center
        carousel.style.transition = 'none';
        currentIndex = clonesPerSide; // Start at the first original item (after left clones)
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        // Function to update carousel and highlight the center item
        function updateCarousel() {
            // Apply the transform to move the carousel
            carousel.style.transition = 'transform 0.5s ease-in-out';
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

            // Highlight the center item
            const centerIndex = currentIndex;
            updatedItems.forEach((item, index) => {
                if (index === centerIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Infinite scroll logic
            if (currentIndex <= 0) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    currentIndex = totalItems;
                    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                    updateCarousel(); // Re-apply styles after repositioning
                }, 500);
            } else if (currentIndex >= totalItems + clonesPerSide - 1) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    currentIndex = clonesPerSide;
                    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                    updateCarousel(); // Re-apply styles after repositioning
                }, 500);
            }
        }

        // Next button
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
        });

        // Previous button
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
        });

        // Initial update to set the correct styles
        updateCarousel();
    }
});

// Filter and Search functionality for shop.html
const categoryFilter = document.querySelector('#category-filter');
const searchBar = document.querySelector('#search-bar');
const shopItems = document.querySelectorAll('.shop-item');

if (categoryFilter && searchBar) {
    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchBar.value.toLowerCase();

        shopItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDescription = item.querySelector('p').textContent.toLowerCase();

            const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;
            const matchesSearch = itemName.includes(searchTerm) || itemDescription.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Filter by category
    categoryFilter.addEventListener('change', applyFilters);

    // Search functionality
    searchBar.addEventListener('input', applyFilters);

    // Filter by URL parameter (e.g., shop.html?category=roses)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        categoryFilter.value = categoryParam;
        applyFilters();
    }
}

// Particles.js for header
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#d4af37' },
        shape: { type: 'circle' },
        opacity: { value: 0.7, random: true },
        size: { value: 2, random: true },
        move: { enable: true, speed: 0.5, direction: 'none', random: true, out_mode: 'out' }
    },
    interactivity: {
        events: { 
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' }
        }
    }
});