document.addEventListener('DOMContentLoaded', () => {
  // Scroll animation for Special Offers section
  const specialOffersSection = document.querySelector('#special-offers');

  if (specialOffersSection) {
    const title = document.querySelector('.underlined-title');
    const items = document.querySelectorAll('.special-bouquet-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate title and items
          if(title) title.style.animation = 'fadeInDown 1s ease forwards';
          items.forEach((item, index) => {
            item.style.animation = `fadeInUp 1s ease forwards ${index * 0.2}s`;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(specialOffersSection);
  }
});
