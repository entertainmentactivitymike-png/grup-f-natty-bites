/* =============================================
   NATTY BITES — Landing Page Scripts
   ============================================= */

// ---- Google Sheets Integration ----
// IMPORTANT: Replace the URL below with your deployed Google Apps Script Web App URL.
// Steps: Apps Script → Deploy → New Deployment → Web App → Execute as: Me → Anyone → Deploy
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwR1CRGjgXNOsbe4Pu6m3TBfPIezE8jia2B75Q1V3Kl8iLvh52qGIE74uNmjXLGcd_A/exec';

function sendToSheets(nama, instagram) {
  // Guard: warn clearly if URL has not been configured yet
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbwR1CRGjgXNOsbe4Pu6m3TBfPIezE8jia2B75Q1V3Kl8iLvh52qGIE74uNmjXLGcd_A/exec') {
    console.warn('[Natty Bites] Google Sheets URL not configured. Data was NOT saved.');
    return;
  }

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama, instagram }),
    mode: 'no-cors' // required for Apps Script cross-origin requests
  }).catch(err => console.error('[Natty Bites] Failed to send to Google Sheets:', err));
}

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

  // ---- Hero Form ----
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

    // Send data to Google Sheets
    sendToSheets(heroFullNameInput.value.trim(), heroInstagramInput.value.trim());

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
