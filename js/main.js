document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initRevealAnimations();
  initSmoothScroll();
  initPortfolioFilter();
  initTestimonialSlider();
  initBackToTop();
  initFormValidation();
});

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');
  
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });
  
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if (!reveals.length) return;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  reveals.forEach(el => observer.observe(el));
  
  const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-scale-in');
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (!filterBtns.length || !portfolioItems.length) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      portfolioItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function initTestimonialSlider() {
  const dots = document.querySelectorAll('.testimonial-dot');
  const cards = document.querySelectorAll('.testimonial-card');
  
  if (!dots.length || !cards.length) return;
  
  let currentSlide = 0;
  const cardsPerView = getCardsPerView();
  
  function updateSlider() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
    
    cards.forEach((card, index) => {
      const cardIndex = Math.floor(index / cardsPerView);
      card.style.display = cardIndex === currentSlide ? 'block' : 'none';
    });
  }
  
  function getCardsPerView() {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlider();
    });
  });
  
  window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      location.reload();
    }
  });
  
  updateSlider();
}

function initBackToTop() {
  const backToTop = document.querySelector('.footer-back-to-top');
  
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initFormValidation() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;
  
  const inputs = form.querySelectorAll('.form-input, .form-textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      showSuccessMessage(form);
      form.reset();
    }
  });
}

function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  
  if (input.hasAttribute('required') && !value) {
    isValid = false;
  }
  
  if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  }
  
  if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    isValid = phoneRegex.test(value);
  }
  
  if (isValid) {
    input.classList.remove('error');
    input.style.borderColor = '';
  } else {
    input.classList.add('error');
    input.style.borderColor = '#FF3B30';
  }
  
  return isValid;
}

function showSuccessMessage(form) {
  const existingMessage = form.querySelector('.success-message');
  if (existingMessage) existingMessage.remove();
  
  const message = document.createElement('div');
  message.className = 'success-message';
  message.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #00C853, #00E676);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      text-align: center;
      font-weight: 600;
      animation: fadeInUp 0.5s ease-out;
    ">
      ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
    </div>
  `;
  
  form.insertBefore(message, form.firstChild);
  
  setTimeout(() => {
    message.style.animation = 'fadeInDown 0.5s ease-out reverse';
    setTimeout(() => message.remove(), 500);
  }, 5000);
}

const style = document.createElement('style');
style.textContent = `
  .form-input.error, .form-textarea.error {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
