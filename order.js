// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get product details from URL
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  const productName = document.getElementById('product-name');
  const productPrice = document.getElementById('product-price');

  if (product) {
      switch (product) {
          case 'enchanted-roses':
              productName.textContent = 'Enchanted Roses';
              productPrice.textContent = 'Price: $120';
              break;
          case 'elegant-lilies':
              productName.textContent = 'Elegant Lilies';
              productPrice.textContent = 'Price: $150';
              break;
          case 'luxury-tulips':
              productName.textContent = 'Luxury Tulips';
              productPrice.textContent = 'Price: $100';
              break;
          default:
              productName.textContent = 'Unknown Product';
              productPrice.textContent = 'Price: $0';
      }
  }
});


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