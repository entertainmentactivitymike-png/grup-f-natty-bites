/* =============================================
   NATTY BITES — Landing Page Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll shadow ----
  const navbar = document.getElementById('navbar');

  function updateScrollPadding() {
    // Keep scroll-padding-top in sync with actual navbar height (accounts for mobile menu open state)
    document.documentElement.style.scrollPaddingTop = navbar.offsetHeight + 8 + 'px';
  }
  updateScrollPadding();

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  window.addEventListener('resize', updateScrollPadding, { passive: true });

  // ---- Mobile hamburger ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    updateScrollPadding();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    updateScrollPadding();
  });

  // Close mobile menu when any link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---- Waitlist Form ----
  const form = document.getElementById('waitlistForm');
  const fullNameInput = document.getElementById('fullName');
  const instagramInput = document.getElementById('instagram');
  const fullNameError = document.getElementById('fullNameError');
  const instagramError = document.getElementById('instagramError');
  const popupOverlay = document.getElementById('popupOverlay');
  const popupName = document.getElementById('popupName');
  const popupClose = document.getElementById('popupClose');

  function validateField(input, errorEl, message) {
    const val = input.value.trim();
    if (!val) {
      errorEl.textContent = message;
      input.classList.add('input--error');
      return false;
    }
    errorEl.textContent = '';
    input.classList.remove('input--error');
    return true;
  }

  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.value.trim()) {
      fullNameError.textContent = '';
      fullNameInput.classList.remove('input--error');
    }
  });

  instagramInput.addEventListener('input', () => {
    if (instagramInput.value.trim()) {
      instagramError.textContent = '';
      instagramInput.classList.remove('input--error');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameValid = validateField(fullNameInput, fullNameError, 'Nama lengkap wajib diisi.');
    const igValid   = validateField(instagramInput, instagramError, 'Username Instagram wajib diisi.');

    if (!nameValid || !igValid) return;

    // Show popup with user's name
    popupName.textContent = fullNameInput.value.trim();
    openPopup(popupOverlay);

    // Reset form
    form.reset();
  });

  // ---- Hero Form ----
  const heroForm = document.getElementById('heroForm');
  const heroFullNameInput = document.getElementById('heroFullName');
  const heroInstagramInput = document.getElementById('heroInstagram');
  const heroFullNameError = document.getElementById('heroFullNameError');
  const heroInstagramError = document.getElementById('heroInstagramError');

  heroFullNameInput.addEventListener('input', () => {
    if (heroFullNameInput.value.trim()) {
      heroFullNameError.textContent = '';
      heroFullNameInput.classList.remove('input--error');
    }
  });

  heroInstagramInput.addEventListener('input', () => {
    if (heroInstagramInput.value.trim()) {
      heroInstagramError.textContent = '';
      heroInstagramInput.classList.remove('input--error');
    }
  });

  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameValid = validateField(heroFullNameInput, heroFullNameError, 'Nama lengkap wajib diisi.');
    const igValid   = validateField(heroInstagramInput, heroInstagramError, 'Username Instagram wajib diisi.');

    if (!nameValid || !igValid) return;

    popupName.textContent = heroFullNameInput.value.trim();
    openPopup(popupOverlay);
    heroForm.reset();
  });

  // ---- Popup helpers ----
  function openPopup(overlay) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = overlay.querySelector('.popup__close');
    if (closeBtn) closeBtn.focus();
  }

  function closePopup(overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close thank-you popup
  popupClose.addEventListener('click', () => closePopup(popupOverlay));
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) closePopup(popupOverlay);
  });

  // ---- Value card modals ----
  document.querySelectorAll('.value__card[data-modal]').forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      const overlay = document.getElementById(modalId);
      if (overlay) openPopup(overlay);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Close value modals via their inner close buttons and backdrop click
  document.querySelectorAll('.popup--value').forEach(popup => {
    const overlay = popup.closest('.popup-overlay');
    popup.querySelector('.popup__close')?.addEventListener('click', () => closePopup(overlay));
    popup.querySelector('.popup__x-close')?.addEventListener('click', () => closePopup(overlay));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(overlay); });
  });

  // ---- Privacy Modal ----
  const privacyOverlay  = document.getElementById('privacyOverlay');
  const privacyClose    = document.getElementById('privacyClose');
  const privacyLinks    = document.querySelectorAll('#privacyLink, #footerPrivacyLink, #heroPrivacyLink');

  privacyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup(privacyOverlay);
    });
  });

  privacyClose.addEventListener('click', () => closePopup(privacyOverlay));
  privacyOverlay.addEventListener('click', (e) => {
    if (e.target === privacyOverlay) closePopup(privacyOverlay);
  });

  // Close any popup on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.popup-overlay.active').forEach(overlay => closePopup(overlay));
    }
  });

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq__answer').hidden = true;
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!isExpanded));
      answer.hidden = isExpanded;
    });
  });

  // ---- Scroll-reveal animation ----
  const revealEls = document.querySelectorAll(
    '.why__card, .value__card, .howto__card, .package-card, .faq__item, .section-header'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

});
