document.addEventListener('DOMContentLoaded', () => {
    // Contact Info Section Animation on Scroll
    const contactInfoSection = document.querySelector('#contact-info');

    // Check if we are on the correct page
    if (contactInfoSection) {
        const elementsToAnimate = [
            document.querySelector('.contact-info-title'),
            document.querySelector('.contact-info-text'),
            ...document.querySelectorAll('.contact-info-method'),
            document.querySelector('.contact-info-socials')
        ].filter(el => el !== null); // Filter out any null elements

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class to each element with a delay
                    elementsToAnimate.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('animate-popup');
                        }, index * 200); // 200ms delay between each item
                    });
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the element is visible
        });

        observer.observe(contactInfoSection);
    }
});
