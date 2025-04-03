// Particles.js ინიციალიზაცია ჰედერისთვის
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

// Falling Rose Petals ანიმაცია Special Offers სექციისთვის
const canvas = document.getElementById('petals-canvas');
const ctx = canvas.getContext('2d');

// Canvas-ის ზომის დაყენება
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

// Resize Canvas როცა ფანჯარა იცვლება
window.addEventListener('resize', resizeCanvas);

// ვარდის ფურცლის სურათის ჩატვირთვა
const petalImage = new Image();
petalImage.src = 'rose-petal.png'; // შეცვალეთ ეს URL თქვენი ვარდის ფურცლის სურათის მისამართით

// Petal კლასი
class Petal {
  constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height; // იწყება ეკრანის ზემოდან
      this.size = Math.random() * 20 + 10; // ფურცლის ზომა (10-30px)
      this.speedY = Math.random() * 2 + 1; // ვარდნის სიჩქარე
      this.speedX = Math.random() * 2 - 1; // ჰორიზონტალური მოძრაობა
      this.opacity = Math.random() * 0.5 + 0.5; // გამჭვირვალობა
      this.rotation = Math.random() * Math.PI * 2; // შემთხვევითი ბრუნვა
      this.rotationSpeed = Math.random() * 0.02 - 0.01; // ბრუნვის სიჩქარე
  }

  update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed; // ბრუნვის განახლება

      // თუ ფურცელი ეკრანის ბოლოში მივიდა, გადავაყენოთ ზევით
      if (this.y > canvas.height + this.size) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
      }

      // ჰორიზონტალური მოძრაობა (რხევა)
      if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
      }
  }

  draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.drawImage(petalImage, -this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
  }
}

// Petals მასივი
const petals = [];
const petalCount = 50; // ფურცლების რაოდენობა

// დაველოდოთ სურათის ჩატვირთვას, სანამ ანიმაციას დავიწყებთ
petalImage.onload = () => {
  for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
  }

  // ანიმაციის ფუნქცია
  function animatePetals() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(petal => {
          petal.update();
          petal.draw();
      });
      requestAnimationFrame(animatePetals);
  }

  // ანიმაციის გაშვება
  animatePetals();
};

// Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const offerItems = document.querySelectorAll('.offer-item');
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const itemsPerPage = 5; // თითო გვერდზე 5 ქარდი
let currentPage = 1;
let currentFilter = 'all';

function updateItems() {
  let filteredItems = Array.from(offerItems);
  if (currentFilter !== 'all') {
      filteredItems = filteredItems.filter(item => item.getAttribute('data-category') === currentFilter);
  }

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Hide all items initially
  offerItems.forEach(item => {
      item.style.display = 'none';
  });

  // Show items for the current page
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  filteredItems.slice(start, end).forEach(item => {
      item.style.display = 'block';
  });

  // Update pagination
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      if (i === currentPage) {
          button.classList.add('active');
      }
      button.addEventListener('click', () => {
          currentPage = i;
          updateItems();
      });
      pagination.appendChild(button);
  }
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.getAttribute('data-filter');
      currentPage = 1;
      updateItems();
  });
});

dropdownLinks.forEach(link => {
  link.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = link.getAttribute('data-filter');
      filterButtons.forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('data-filter') === filter) {
              btn.classList.add('active');
          }
      });
      currentFilter = filter;
      currentPage = 1;
      updateItems();
  });
});

// Initial update
updateItems();

// Modal Functionality
const modal = document.getElementById('cardModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalShopNow = document.getElementById('modalShopNow');
const closeModal = document.querySelector('.close');

offerItems.forEach(item => {
  const img = item.querySelector('img');
  img.addEventListener('click', () => {
      modalImage.src = img.src;
      modalTitle.textContent = item.querySelector('h3').textContent;
      modalDescription.textContent = item.querySelector('.description').textContent;
      const priceContainer = item.querySelector('.price-container');
      if (priceContainer) {
          modalPrice.innerHTML = priceContainer.innerHTML;
      } else {
          modalPrice.innerHTML = `<span class="new-price">${item.querySelector('.price').textContent}</span>`;
      }
      modalShopNow.href = item.querySelector('.luxury-btn').href;
      modal.style.display = 'flex';
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
      modal.style.display = 'none';
  }
});

// Scroll-ზე ანიმაციის გააქტიურება Special Offers სექციისთვის
const offersSection = document.querySelector('#special-offers-page');
const offersTitle = document.querySelector('.offers-title');
const offerItemsVisible = document.querySelectorAll('.offer-item');

const observerOptions = {
  threshold: 0.2
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          offersTitle.classList.add('animate');
          offerItemsVisible.forEach(item => {
              if (item.style.display !== 'none') {
                  item.classList.add('animate');
              }
          });
          observer.unobserve(entry.target);
      }
  });
}, observerOptions);

observer.observe(offersSection);