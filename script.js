// ==========================================================
// THEME TOGGLE (persisted in localStorage)
// ==========================================================
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  
  const sunIcon = toggle.querySelector('.sun-icon');
  const moonIcon = toggle.querySelector('.moon-icon');

  const stored = localStorage.getItem('portfolio-theme-2');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');

  applyTheme(initial);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme-2', next);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
})();

// ==========================================================
// HAMBURGER / MOBILE MENU
// ==========================================================
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    sidebar.classList.remove('is-open');
  }

  function toggleMenu() {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    sidebar.classList.toggle('is-open', !isOpen);
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close the mobile menu whenever a nav link is used
  sidebar.querySelectorAll('.nav-item').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

// ==========================================================
// ACTIVE NAV LINK ON SCROLL
// ==========================================================
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-item');

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.nav === id);
    });
  }

  const sections = [
    { el: document.getElementById('home'), id: 'home' },
    { el: document.getElementById('about'), id: 'about' },
    { el: document.getElementById('skills'), id: 'skills' },
    { el: document.getElementById('projects'), id: 'projects' },
    { el: document.getElementById('contact'), id: 'contact' },
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = sections.find((s) => s.el === entry.target)?.id;
          if (sectionId) setActive(sectionId);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(({ el }) => {
    if (el) observer.observe(el);
  });
})();

// ==========================================================
// CONTACT FORM VALIDATION
// ==========================================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => (value.trim().length === 0 ? 'Please enter your name.' : ''),
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => {
        if (value.trim().length === 0) return 'Please enter your email.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value.trim()) ? '' : 'Please enter a valid email address.';
      },
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => (value.trim().length === 0 ? 'Please enter a message.' : ''),
    },
  };

  function showFieldError(field, message) {
    field.error.textContent = message;
    field.input.closest('.form-row').classList.toggle('has-error', Boolean(message));
    field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  // Validate on blur for immediate feedback
  Object.values(fields).forEach((field) => {
    field.input.addEventListener('blur', () => {
      showFieldError(field, field.validate(field.input.value));
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    Object.values(fields).forEach((field) => {
      const message = field.validate(field.input.value);
      showFieldError(field, message);
      if (message) isValid = false;
    });

    if (!isValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.className = 'form-status error';
      const firstInvalid = Object.values(fields).find((f) => f.error.textContent);
      if (firstInvalid) firstInvalid.input.focus();
      return;
    }

    status.textContent = `Thanks! Your message has been sent — I'll reply as soon as I can.`;
    status.className = 'form-status success';
    form.reset();
    Object.values(fields).forEach((field) => showFieldError(field, ''));
  });
})();

// ==========================================================
// FOOTER YEAR
// ==========================================================
(function initFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
