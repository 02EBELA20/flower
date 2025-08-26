document.addEventListener('DOMContentLoaded', () => {
    const contactInfoSection = document.querySelector('#contact-info');

    // Check if we are on the contact page to avoid errors on other pages
    if (contactInfoSection) {
        // Select all elements that need to be animated
        const elementsToAnimate = contactInfoSection.querySelectorAll('.contact-info-title, .contact-info-text, .contact-info-method, .contact-info-socials');

        // This function will be called when the section comes into view
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                // If the section is intersecting (visible)
                if (entry.isIntersecting) {
                    // Add the 'is-visible' class to each element
                    elementsToAnimate.forEach(el => {
                        el.classList.add('is-visible');
                    });
                    // Stop observing after the animation has been triggered once
                    observer.unobserve(contactInfoSection);
                }
            });
        };

        // Create the observer
        const observer = new IntersectionObserver(callback, {
            threshold: 0.2 // Trigger when 20% of the section is visible
        });

        // Start observing the contact section
        observer.observe(contactInfoSection);
    }
});
