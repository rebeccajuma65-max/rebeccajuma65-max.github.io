/**
 * SUDAN WOMEN EMPOWER - MAIN INTERACTIVE SCRIPT
 * Handles mobile navigation, donation modal, interactive tabs,
 * animated stats counter, accordions, and form confirmations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveLinks();
  initDonationModal();
  initStatsCounter();
  initAccordions();
  initForms();
  initFilters();
});

/* ==========================================================================
   1. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
      toggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. ACTIVE LINK HIGHLIGHTING
   ========================================================================== */
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. DONATION MODAL & CALCULATOR
   ========================================================================== */
function initDonationModal() {
  const modal = document.getElementById('donationModal');
  const openButtons = document.querySelectorAll('[data-open-modal="donationModal"], .btn-donate');
  const closeBtn = document.querySelector('.modal-close');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Backdrop click closes modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Interactive Amount & Impact Calculation
  const amountBtns = modal.querySelectorAll('.amount-btn');
  const customInput = modal.querySelector('.custom-amount-input');
  const impactText = modal.querySelector('#impactPreviewText');
  const freqBtns = modal.querySelectorAll('.freq-btn');

  const impacts = {
    25: "Provides 2 comprehensive emergency dignity and maternal hygiene kits for displaced mothers.",
    50: "Supplies vocational tailoring or digital literacy training materials for 1 Sudanese woman for a full month.",
    100: "Funds emergency shelter stipend, nutrition, and essential healthcare for a vulnerable family for 3 weeks.",
    250: "Supplies a catalytic micro-grant seed fund enabling a woman entrepreneur to launch a local market co-op.",
    500: "Sponsors legal advocacy representation and trauma-recovery support for survivors of gender-based violence."
  };

  const updateImpact = (val) => {
    if (!impactText) return;
    const num = parseInt(val, 10);
    if (num >= 500) {
      impactText.textContent = impacts[500];
    } else if (num >= 250) {
      impactText.textContent = impacts[250];
    } else if (num >= 100) {
      impactText.textContent = impacts[100];
    } else if (num >= 50) {
      impactText.textContent = impacts[50];
    } else {
      impactText.textContent = impacts[25];
    }
  };

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amt = btn.dataset.amount;
      if (customInput) customInput.value = amt;
      updateImpact(amt);
    });
  });

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      amountBtns.forEach(b => b.classList.remove('active'));
      const val = e.target.value;
      // If matches one of the presets, highlight it
      const matchedBtn = Array.from(amountBtns).find(b => b.dataset.amount === val);
      if (matchedBtn) matchedBtn.classList.add('active');
      updateImpact(val || 25);
    });
  }

  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Handle mock donation submission
  const donateForm = modal.querySelector('#donationForm');
  if (donateForm) {
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = customInput ? (customInput.value || '50') : '50';
      closeModal();
      showToast(`Thank you! Your generous pledge of $${amount} directly empowers Sudanese women.`);
    });
  }
}

/* ==========================================================================
   4. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1500;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   5. ACCORDIONS (FAQ)
   ========================================================================== */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other accordions in the same group
      const parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
      }

      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ==========================================================================
   6. FORMS & FEEDBACK
   ========================================================================== */
function initForms() {
  // General forms with class .ajax-form
  const forms = document.querySelectorAll('form[data-handle="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Processing...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        form.reset();
        const successMsg = form.getAttribute('data-success') || 'Thank you! Your submission has been received.';
        showToast(successMsg);
      }, 700);
    });
  });

  // Newsletter forms
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(nf => {
    nf.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nf.querySelector('input[type="email"]');
      if (input && input.value) {
        input.value = '';
        showToast('Subscribed! Thank you for staying connected with Sudanese women.');
      }
    });
  });
}

/* ==========================================================================
   7. FILTER BUTTONS (FOR PROGRAMS OR STORIES)
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('.filter-item');

  if (!filterBtns.length || !filterCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      filterCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <div>${message}</div>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
