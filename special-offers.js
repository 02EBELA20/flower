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

// Scroll-ზე ანიმაციის გააქტიურება Special Offers სექციისთვის
document.addEventListener('DOMContentLoaded', () => {
  const specialOffersSection = document.querySelector('#special-offers');
  const specialOffersTitle = document.querySelector('.underlined-title');
  const specialBouquetItems = document.querySelectorAll('.special-bouquet-item');

  const observerOptions = {
      threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              specialOffersTitle.classList.add('animate');
              specialBouquetItems.forEach(item => item.classList.add('animate'));
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);

  observer.observe(specialOffersSection);
});