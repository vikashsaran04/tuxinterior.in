/**
 * TUX INTERIOR - MODERN CLIENT-SIDE JAVASCRIPT
 * Handles Loading Screen, Sticky Nav, Mobile Menu, Interactive Portfolio,
 * Pricing Switcher, Enquiry Modal & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initStickyHeader();
  initMobileMenu();
  initEnquiryModal();
  initPricingSwitcher();
  initPortfolioFilter();
  initContactForms();
});

/* --------------------------------------------------------------------------
   1. Page Loader
   -------------------------------------------------------------------------- */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('loaded');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.style.display = 'none';
      }
    }, 450);
  };

  // Smooth dismiss when page finishes loading or 750ms fallback
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 350);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 350));
    setTimeout(hideLoader, 1500); // Safety timeout
  }
}

/* --------------------------------------------------------------------------
   2. Sticky Header with Scroll Effect
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const navLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!hamburgerBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    hamburgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   4. Enquiry Popup Modal & WhatsApp Trigger
   -------------------------------------------------------------------------- */
function initEnquiryModal() {
  const modal = document.getElementById('enquiry-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const modalForm = document.getElementById('popup-enquiry-form');
  const triggers = document.querySelectorAll('[data-open-enquiry], .open-enquiry-btn');

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Automatic gentle popup on first arrival (with 3-second dwell time)
  // Only show once per browser session so it doesn't disturb user
  const hasSeenPopup = sessionStorage.getItem('tux_popup_dismissed');
  if (!hasSeenPopup) {
    setTimeout(() => {
      // Check if user is still on the page and didn't open it already
      if (!sessionStorage.getItem('tux_popup_dismissed') && !modal.classList.contains('open')) {
        openModal();
        sessionStorage.setItem('tux_popup_dismissed', 'true');
      }
    }, 2800);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sessionStorage.setItem('tux_popup_dismissed', 'true');
    });
  }

  // Handle Form Submission
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modalForm.querySelector('#popup-name').value.trim();
      const mobile = modalForm.querySelector('#popup-mobile').value.trim();
      const address = modalForm.querySelector('#popup-address').value.trim();
      const config = modalForm.querySelector('#popup-config').value.trim();
      const budget = modalForm.querySelector('#popup-budget').value.trim();

      if (!name || !mobile || !address || !config || !budget) {
        alert('Please fill out all required fields.');
        return;
      }

      sendWhatsAppEnquiry({
        name,
        mobile,
        address,
        config,
        budget
      });

      closeModal();
      modalForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   5. WhatsApp Form Dispatcher
   Destination Number: +91 9145879563
   -------------------------------------------------------------------------- */
function sendWhatsAppEnquiry({ name, mobile, address, config, budget }) {
  const whatsappNumber = '919145879563';
  
  const text = `Hello Tux Interior,

I am interested in a home interior project.

Name: ${name}
Mobile: ${mobile}
Project Address: ${address}
Configuration: ${config}
Budget: ${budget}

Please contact me regarding my project.`;

  const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(encodedUrl, '_blank', 'noopener,noreferrer');
}

/* --------------------------------------------------------------------------
   6. Contact Page Form Handler
   -------------------------------------------------------------------------- */
function initContactForms() {
  const contactForm = document.getElementById('main-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#contact-name').value.trim();
    const mobile = contactForm.querySelector('#contact-mobile').value.trim();
    const address = contactForm.querySelector('#contact-address').value.trim();
    const config = contactForm.querySelector('#contact-config').value.trim();
    const budget = contactForm.querySelector('#contact-budget').value.trim();

    if (!name || !mobile || !address || !config || !budget) {
      alert('Please fill out all required fields.');
      return;
    }

    sendWhatsAppEnquiry({
      name,
      mobile,
      address,
      config,
      budget
    });

    contactForm.reset();
  });
}

/* --------------------------------------------------------------------------
   7. Pricing Switcher (Apartment vs Bungalow)
   Editable data structure with exact provided figures
   -------------------------------------------------------------------------- */
const PRICING_DATA = {
  apartment: {
    starting: {
      title: 'Starting',
      desc: 'Smart, essential home interiors with reliable materials & carpentry',
      rates: [
        { label: '2 BHK', price: '₹10–11 Lakh' },
        { label: '3 BHK', price: '₹15–17 Lakh' },
        { label: '4 BHK', price: '₹20–22 Lakh' }
      ]
    },
    premium: {
      title: 'Premium',
      desc: 'Enhanced finishes, custom designer units & premium hardware',
      rates: [
        { label: '2 BHK', price: '₹14–16 Lakh' },
        { label: '3 BHK', price: '₹20–23 Lakh' },
        { label: '4 BHK', price: '₹26–30 Lakh' }
      ]
    },
    luxury: {
      title: 'Luxury',
      desc: 'Architectural details, bespoke veneers & turnkey luxury craft',
      rates: [
        { label: '2 BHK', price: 'Customised' },
        { label: '3 BHK', price: 'Customised' },
        { label: '4 BHK', price: 'Customised' }
      ]
    }
  },
  bungalow: {
    starting: {
      title: 'Starting',
      desc: 'Spacious villa interiors designed for durability and elegant aesthetics',
      rates: [
        { label: '2 BHK', price: '₹13–14 Lakh' },
        { label: '3 BHK', price: '₹19–21 Lakh' },
        { label: '4 BHK', price: '₹27–32 Lakh' }
      ]
    },
    premium: {
      title: 'Premium',
      desc: 'Luxury villa carpentry, false ceilings, lighting & modular setups',
      rates: [
        { label: '2 BHK', price: '₹17–16 Lakh' }, // Provided figure preserved
        { label: '3 BHK', price: '₹30–40 Lakh' },
        { label: '4 BHK', price: '₹43–50 Lakh' }
      ]
    },
    luxury: {
      title: 'Luxury',
      desc: 'Comprehensive bespoke turnkey bungalow architecture & lavish finish',
      rates: [
        { label: '2 BHK', price: 'Customised' },
        { label: '3 BHK', price: 'Customised' },
        { label: '4 BHK', price: 'Customised' }
      ]
    }
  }
};

function initPricingSwitcher() {
  const switchBtns = document.querySelectorAll('.pricing-toggle-btn');
  const container = document.getElementById('pricing-cards-container');
  if (!switchBtns.length || !container) return;

  function renderPricing(type) {
    const data = PRICING_DATA[type];
    if (!data) return;

    const cardsHtml = `
      <!-- STARTING TIER -->
      <div class="pricing-card">
        <h3 class="pricing-tier-name">${data.starting.title}</h3>
        <p class="pricing-tier-desc">${data.starting.desc}</p>
        <div class="pricing-rows-list">
          ${data.starting.rates.map(r => `
            <div class="pricing-row">
              <span class="pricing-config-label">${r.label}</span>
              <span class="pricing-amount tabular-nums">${r.price}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-outline" data-open-enquiry>Discuss Your Project</button>
      </div>

      <!-- PREMIUM TIER (Featured) -->
      <div class="pricing-card featured">
        <span class="pricing-card-badge">Most Popular</span>
        <h3 class="pricing-tier-name">${data.premium.title}</h3>
        <p class="pricing-tier-desc">${data.premium.desc}</p>
        <div class="pricing-rows-list">
          ${data.premium.rates.map(r => `
            <div class="pricing-row">
              <span class="pricing-config-label">${r.label}</span>
              <span class="pricing-amount tabular-nums">${r.price}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary" data-open-enquiry>Discuss Your Project</button>
      </div>

      <!-- LUXURY TIER -->
      <div class="pricing-card">
        <h3 class="pricing-tier-name">${data.luxury.title}</h3>
        <p class="pricing-tier-desc">${data.luxury.desc}</p>
        <div class="pricing-rows-list">
          ${data.luxury.rates.map(r => `
            <div class="pricing-row">
              <span class="pricing-config-label">${r.label}</span>
              <span class="pricing-amount tabular-nums">${r.price}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-outline" data-open-enquiry>Discuss Your Project</button>
      </div>
    `;

    container.innerHTML = cardsHtml;

    // Reattach enquiry trigger to new buttons
    container.querySelectorAll('[data-open-enquiry]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('enquiry-modal');
        if (modal) {
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetType = btn.getAttribute('data-type');
      renderPricing(targetType);
    });
  });

  // Initial render
  renderPricing('apartment');
}

/* --------------------------------------------------------------------------
   8. Portfolio Category Filter
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}
