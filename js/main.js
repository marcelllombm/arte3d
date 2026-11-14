document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initRevealAnimations();
  initSmoothScroll();
  initPortfolioFilter();
  initBackToTop();
  initFormValidation();
  initHeroVideo();
});

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 100);
  }, { passive: true });
}

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');
  
  if (!toggle || !menu) return;
  
  function setOpen(open) {
    toggle.classList.toggle('active', open);
    menu.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('active')));

  links.forEach(link => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      setOpen(false);
      toggle.focus();
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
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);

      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        history.replaceState(null, '', id);
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
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
      
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      
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

function initBackToTop() {
  const backToTop = document.querySelector('.footer-back-to-top');
  
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  
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
      const v = id => form.elements[id].value.trim();
      const texto = encodeURIComponent(
        `Olá, gostaria de solicitar um orçamento.\n\n*Nome:* ${v('name')}\n*Email:* ${v('email')}\n*Telefone:* ${v('phone')}\n*Serviço:* ${v('service')}\n*Mensagem:* ${v('message')}`
      );
      window.open(`https://wa.me/5582996324195?text=${texto}`, '_blank', 'noopener');
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
    input.removeAttribute('aria-invalid');
    input.style.borderColor = '';
  } else {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    input.style.borderColor = '#FF3B30';
  }
  
  return isValid;
}

function showSuccessMessage(form) {
  const existingMessage = form.querySelector('.success-message');
  if (existingMessage) existingMessage.remove();
  
  const message = document.createElement('div');
  message.className = 'success-message';
  message.setAttribute('role', 'status');
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

// O pôster (imagem) é o LCP; o vídeo só é carregado depois que a página terminou de carregar.
function initHeroVideo() {
  const img = document.getElementById('hero-media');
  if (!img || !img.dataset.video) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData) return;

  const swap = () => {
    const video = document.createElement('video');
    video.className = img.className;
    video.poster = img.currentSrc || img.src;
    video.width = img.width || 720;
    video.height = img.height || 406;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('aria-label', img.alt);
    video.setAttribute('disablepictureinpicture', '');
    video.src = img.dataset.video;
    video.addEventListener('canplay', () => {
      img.replaceWith(video);
      video.play().catch(() => {});
    }, { once: true });
  };

  const start = () => ('requestIdleCallback' in window ? requestIdleCallback(swap, { timeout: 3000 }) : setTimeout(swap, 1500));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
