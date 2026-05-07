// ===========================
// PAGE LOADER
// ===========================
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  setTimeout(() => loader.classList.add('hidden'), 1400);
});

// ===========================
// THEME TOGGLE
// ===========================
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  if (next === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', next);
  }
  localStorage.setItem('theme', next);
});

// ===========================
// CANVAS PARTICLE BACKGROUND
// ===========================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

const particles = [];
const NUM_PARTICLES = 80;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '#818cf8' : '#38bdf8';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#38bdf8';
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateBg() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateBg);
}

animateBg();

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// ===========================
// TYPING ANIMATION
// ===========================
const typingPhrases = [
  "I build AI agents",
  "I automate workflows",
  "I create intelligent systems",
  "I design RAG pipelines",
  "I develop LLM applications"
];

const typingElement = document.querySelector('.typing-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 40;
  } else {
    typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 80;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typingSpeed = 1500; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    typingSpeed = 400; // Pause before new phrase
  }

  setTimeout(typeEffect, typingSpeed);
}

// Start typing animation after page loads
setTimeout(typeEffect, 1800);

// ===========================
// SCROLL PROGRESS
// ===========================
const progress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  progress.style.width = pct + '%';

  // Navbar scroll state
  const navbar = document.getElementById('navbar');
  if (scrollTop > 30) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
}

// ===========================
// SMOOTH SCROLL FOR NAV
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================
// REVEAL ON SCROLL
// ===========================
const revealElements = document.querySelectorAll(
  '.glass-card, .skill-category, .project-card, .cert-card, .timeline-item, .section-heading, .section-label, .about-text, .contact-sub, .contact-layout'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => observer.observe(el));

// ===========================
// STAGGER CHILDREN
// ===========================
function staggerChildren(parentSelector, childSelector, delay = 80) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    parent.querySelectorAll(childSelector).forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}ms`;
    });
  });
}

staggerChildren('.projects-grid', '.project-card', 100);
staggerChildren('.skills-grid', '.skill-category', 80);
staggerChildren('.certs-grid', '.cert-card', 80);
staggerChildren('.timeline', '.timeline-item', 100);

// ===========================
// ACTIVE NAV LINK
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active-link');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===========================
// BACK TO TOP
// ===========================
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===========================
// CONTACT FORM
// ===========================
function handleFormSubmit(btn) {
  const form = btn.closest('.contact-form');
  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const message = form.querySelector('textarea').value.trim();

  if (!name || !email || !message) {
    btn.textContent = '⚠ Please fill all fields';
    btn.style.background = '#ef4444';
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
    }, 2500);
    return;
  }

  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#34d399';
  btn.style.color = '#030712';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    form.querySelectorAll('input, textarea').forEach(el => el.value = '');
  }, 3500);
}

// ===========================
// CURSOR GLOW EFFECT
// ===========================
const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9998;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.5s ease, top 0.5s ease;
  will-change: left, top;
`;
document.body.appendChild(glow);

document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ===========================
// TYPING EFFECT ON HERO TITLE
// ===========================
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      heroTitle.textContent += text[i++];
      setTimeout(typeChar, 40);
    }
  }
  setTimeout(typeChar, 1200);
}
