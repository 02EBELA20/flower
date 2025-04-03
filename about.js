// Particles.js ინიციალიზაცია
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#d4af37' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#d4af37', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
});

// Scroll-ზე ანიმაციის გააქტიურება Contact Info სექციისთვის
document.addEventListener('DOMContentLoaded', () => {
    const contactInfoSection = document.querySelector('#contact-info');
    const contactInfoTitle = document.querySelector('.contact-info-title');
    const contactInfoText = document.querySelector('.contact-info-text');
    const contactInfoMethods = document.querySelectorAll('.contact-info-method');
    const contactInfoSocials = document.querySelector('.contact-info-socials');

    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                contactInfoTitle.classList.add('animate');
                contactInfoText.classList.add('animate');
                contactInfoMethods.forEach(method => method.classList.add('animate'));
                contactInfoSocials.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(contactInfoSection);
});