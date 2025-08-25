// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Carousel functionality (for index.html)
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;

        function updateCarousel() {
            const itemWidth = carouselItems[0].offsetWidth + 40; // Item width + margin
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < carouselItems.length - 1) { // Adjust logic based on visible items
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other active items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle the clicked item
            item.classList.toggle('active');
        });
    });

});
