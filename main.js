// Wait for the DOM to be fully loaded
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
    // Check if the particles-js container exists on the page
    if (document.getElementById('particles-js')) {
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
    }
});
