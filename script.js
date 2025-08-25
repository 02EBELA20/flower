// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // ========================================= //
    // =========== Carousel (New Circular Logic) ====== //
    // ========================================= //
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const carousel = carouselContainer.querySelector('.carousel');
        const prevBtn = carouselContainer.querySelector('.prev-btn');
        const nextBtn = carouselContainer.querySelector('.next-btn');
        let isTransitioning = false;

        if (carousel.children.length > 1) {
            const itemWidth = () => carousel.children[0].offsetWidth + 40; // Function to recalculate on resize

            const moveToNext = () => {
                if (isTransitioning) return;
                isTransitioning = true;
                
                carousel.style.transition = 'transform 0.5s ease-in-out';
                carousel.style.transform = `translateX(-${itemWidth()}px)`;
            };

            const moveToPrev = () => {
                if (isTransitioning) return;
                isTransitioning = true;

                const lastItem = carousel.lastElementChild;
                carousel.insertBefore(lastItem, carousel.firstElementChild);

                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(-${itemWidth()}px)`;
                
                // This is a browser trick to force it to apply the style change before the animation
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.5s ease-in-out';
                    carousel.style.transform = 'translateX(0)';
                }, 20);
            };

            carousel.addEventListener('transitionend', () => {
                // This part cleans up after the "next" button animation
                if (carousel.style.transform !== 'translateX(0px)') {
                    const firstItem = carousel.firstElementChild;
                    carousel.appendChild(firstItem); // Move the first item to the end
                    
                    carousel.style.transition = 'none';
                    carousel.style.transform = 'translateX(0)';
                }
                isTransitioning = false;
            });

            nextBtn.addEventListener('click', moveToNext);
            prevBtn.addEventListener('click', moveToPrev);
        }
    }


    // ========================================= //
    // =========== FAQ Accordion (Updated) ========= //
    // ========================================= //
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items before opening a new one
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                }
            });

            // Toggle the clicked item
            if (!isActive) {
                item.classList.add('active');
                toggle.textContent = '×'; // Change to 'x' or '-'
            } else {
                item.classList.remove('active');
                toggle.textContent = '+';
            }
        });
    });

});
