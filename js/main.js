/**
 * Silk & Semolina / September Brescia - Main Engine
 * Vanilla JavaScript implementation: I18n, Dark Mode, Dynamic Status, Modals, Cursor
 */

(function () {
  'use strict';

  // --- State Variables ---
  let currentLang = localStorage.getItem('silk_semolina_lang') || 'it';
  let currentTheme = localStorage.getItem('silk_semolina_theme') || 'light';
  let activeCakeModalKey = null;

  // --- DOM Elements ---
  const header = document.getElementById('siteHeader');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langMenu = document.getElementById('langMenu');
  const currentLangLabel = document.getElementById('currentLangLabel');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  const cakesGridContainer = document.getElementById('cakesGrid');
  const priceCatsGridContainer = document.getElementById('priceCatsGrid');
  const photoMenusContainer = document.getElementById('photoMenusGrid');
  const liveStatusDot = document.getElementById('liveStatusDot');
  const liveStatusText = document.getElementById('liveStatusText');
  const hoursTableBody = document.getElementById('hoursTableBody');
  const guestbookCardsContainer = document.getElementById('guestbookGrid');
  
  const cakeModal = document.getElementById('cakeModal');
  const cakeModalImg = document.getElementById('cakeModalImg');
  const cakeModalName = document.getElementById('cakeModalName');
  const cakeModalDesc = document.getElementById('cakeModalDesc');
  const cakeModalPrice = document.getElementById('cakeModalPrice');
  const cakeModalCloseBtn = document.getElementById('cakeModalCloseBtn');

  // --- 1. Theme Management ---
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('silk_semolina_theme', theme);
    updateThemeIcons();
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  }

  function updateThemeIcons() {
    const sunIcon = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M22 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    const iconHtml = currentTheme === 'dark' ? sunIcon : moonIcon;
    if (themeToggleBtn) themeToggleBtn.innerHTML = iconHtml;
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.innerHTML = iconHtml;
  }

  // --- 2. Language Management (I18n) ---
  function getTranslation(path, lang = currentLang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.it;
    const parts = path.split('.');
    let current = dict;
    for (const p of parts) {
      if (current && typeof current === 'object' && p in current) {
        current = current[p];
      } else {
        return path;
      }
    }
    return current;
  }

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'it';
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('silk_semolina_lang', lang);

    // Update all static i18n nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getTranslation(key, lang);
      if (typeof val === 'string') {
        el.innerHTML = val;
      }
    });

    // Update Header active lang label
    const langObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
    if (currentLangLabel) currentLangLabel.textContent = langObj.label;

    // Update active class on dropdown options
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Re-render dynamic sections
    renderCakesGrid();
    renderPriceBoard();
    renderPhotoMenus();
    renderLiveStatus();
    renderGuestbook();

    // If modal is currently open, refresh its content in the new language
    if (activeCakeModalKey) {
      populateCakeModal(activeCakeModalKey);
    }
  }

  // --- 3. Dynamic Rendering Functions ---

  // Cakes Grid
  function renderCakesGrid() {
    if (!cakesGridContainer) return;
    cakesGridContainer.innerHTML = '';

    CAKES_DATA.forEach(cake => {
      const cakeName = cake.name[currentLang] || cake.name.en;
      const cakeDesc = cake.desc[currentLang] || cake.desc.en;

      const card = document.createElement('button');
      card.className = 'cake-card-btn';
      card.type = 'button';
      card.setAttribute('aria-label', cakeName);
      card.innerHTML = `
        <div class="cake-img-wrapper moon-gate">
          <img src="${cake.image}" alt="${cakeName}" class="cake-img" loading="lazy">
        </div>
        <p class="cake-name">${cakeName}</p>
        <p class="cake-price-tag">${cake.price}</p>
      `;

      card.addEventListener('click', () => openCakeModal(cake.key));
      cakesGridContainer.appendChild(card);
    });
  }

  // Price List Board
  function renderPriceBoard() {
    if (!priceCatsGridContainer) return;
    priceCatsGridContainer.innerHTML = '';

    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.it;

    PRICE_LIST_DATA.forEach(cat => {
      const col = document.createElement('div');
      col.className = 'price-cat-col';

      const catTitle = t.menu.cats[cat.key] || cat.key;
      const catNote = cat.note ? `<span class="price-cat-note">${cat.note}</span>` : '';

      let itemsHtml = '';
      cat.items.forEach(item => {
        const itemName = currentLang === 'zh' ? item.zh : item.name;
        const itemZh = currentLang !== 'zh' && item.zh ? `<span class="price-item-zh">${item.zh}</span>` : '';
        const pricePrefix = cat.prefix ? `${cat.prefix}€` : '€';
        itemsHtml += `
          <li class="price-item-row">
            <span class="price-item-name">
              ${itemName}
              ${itemZh}
            </span>
            <span class="price-item-dots"></span>
            <span class="price-item-cost">${pricePrefix}${item.price}</span>
          </li>
        `;
      });

      col.innerHTML = `
        <div class="price-cat-header">
          <h4 class="price-cat-title">${catTitle}</h4>
          ${catNote}
        </div>
        <div class="brush-divider" style="width: 100%; margin-bottom: 0.75rem;"></div>
        <ul class="price-items-list">
          ${itemsHtml}
        </ul>
      `;

      priceCatsGridContainer.appendChild(col);
    });
  }

  // Photo Menus Showcase
  function renderPhotoMenus() {
    if (!photoMenusContainer) return;
    photoMenusContainer.innerHTML = '';

    PHOTO_MENUS_DATA.forEach(pm => {
      const label = pm.label[currentLang] || pm.label.en;
      const card = document.createElement('div');
      card.className = 'photo-menu-card';
      card.innerHTML = `
        <img src="${pm.src}" alt="${label}" loading="lazy">
        <span class="photo-menu-badge">${label}</span>
      `;
      card.addEventListener('click', () => openImageLightbox(pm.src, label));
      photoMenusContainer.appendChild(card);
    });
  }

  // Live Opening Hours & Status
  function renderLiveStatus() {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.it;
    const now = new Date();
    const day = now.getDay(); // 0: Sunday, 1: Monday, ...
    const hour = now.getHours();

    let status = { open: false, label: t.location.vibe.morning };

    if (day === 1) {
      status = { open: false, label: t.location.vibe.resting };
    } else if (hour >= 12 && hour < 15) {
      status = { open: true, label: t.location.vibe.lunch };
    } else if (hour >= 15 && hour < 20) {
      status = { open: true, label: t.location.vibe.afternoon };
    } else if (hour >= 20) {
      status = { open: false, label: t.location.vibe.evening };
    } else {
      status = { open: false, label: t.location.vibe.morning };
    }

    if (liveStatusDot) {
      liveStatusDot.className = `status-dot ${status.open ? 'active' : 'closed'}`;
    }
    if (liveStatusText) {
      liveStatusText.textContent = status.label;
    }

    // Render Hours Table
    if (hoursTableBody) {
      hoursTableBody.innerHTML = '';
      STORE_INFO.hours.forEach(h => {
        const dayName = t.days[h.key] || h.key;
        const timeDisplay = h.time === 'closed' ? t.location.closed : h.time;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${dayName}</td>
          <td>${timeDisplay}</td>
        `;
        hoursTableBody.appendChild(tr);
      });
    }

    // Update Address in location & footer
    const addressLines = STORE_INFO.addressLines[currentLang] || STORE_INFO.addressLines.en;
    const addrEl = document.getElementById('storeAddress');
    if (addrEl) {
      addrEl.innerHTML = addressLines.join('<br>');
    }
    const footerAddrEl = document.getElementById('footerStoreAddress');
    if (footerAddrEl) {
      footerAddrEl.innerHTML = addressLines.join('<br>');
    }
  }

  // Guestbook Reviews
  function renderGuestbook() {
    if (!guestbookCardsContainer) return;
    guestbookCardsContainer.innerHTML = '';

    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.it;
    const reviews = t.reviews || [];

    reviews.forEach((rev) => {
      const card = document.createElement('div');
      card.className = 'guestbook-card';
      card.innerHTML = `
        <span class="quote-mark">“</span>
        <p class="review-quote-text">${rev.text}</p>
        <div class="review-author-line">
          <span class="review-author-name">${rev.author}</span> · ${rev.place}
        </div>
      `;
      guestbookCardsContainer.appendChild(card);
    });
  }

  // --- 4. Modals (Cake Details & Lightbox) ---
  function openCakeModal(cakeKey) {
    const cake = CAKES_DATA.find(c => c.key === cakeKey);
    if (!cake || !cakeModal) return;

    activeCakeModalKey = cakeKey;
    populateCakeModal(cakeKey);

    cakeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function populateCakeModal(cakeKey) {
    const cake = CAKES_DATA.find(c => c.key === cakeKey);
    if (!cake) return;

    const cakeName = cake.name[currentLang] || cake.name.en;
    const cakeDesc = cake.desc[currentLang] || cake.desc.en;

    if (cakeModalImg) {
      cakeModalImg.src = cake.image;
      cakeModalImg.alt = cakeName;
    }
    if (cakeModalName) cakeModalName.textContent = cakeName;
    if (cakeModalDesc) cakeModalDesc.textContent = cakeDesc;
    if (cakeModalPrice) cakeModalPrice.textContent = cake.price;
  }

  function closeCakeModal() {
    if (!cakeModal) return;
    cakeModal.classList.remove('active');
    activeCakeModalKey = null;
    document.body.style.overflow = '';
  }

  function openImageLightbox(src, alt) {
    if (!cakeModal) return;
    if (cakeModalImg) {
      cakeModalImg.src = src;
      cakeModalImg.alt = alt;
    }
    if (cakeModalName) cakeModalName.textContent = alt;
    if (cakeModalDesc) cakeModalDesc.textContent = getTranslation('menu.boardHint');
    if (cakeModalPrice) cakeModalPrice.textContent = '';
    cakeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --- 5. Smooth Custom Cursor ---
  function initCustomCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    document.body.appendChild(follower);

    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const target = e.target;
      const isInteractive = !!target.closest('a, button, .photo-menu-card, .cake-card-btn, [data-cursor-hover]');
      follower.classList.toggle('is-hovered', isInteractive);
    });

    function loop() {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // --- 6. Event Listeners Initialization ---
  function initEventListeners() {
    // Theme Toggles
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    // Language Dropdown
    if (langToggleBtn && langMenu) {
      langToggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        langMenu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        langMenu.classList.remove('show');
      });
    }

    // Language Option Clicks
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
        if (langMenu) langMenu.classList.remove('show');
      });
    });

    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    // Mobile Menu Burger
    if (burgerBtn && mobileNav) {
      burgerBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
      });

      // Close mobile menu when clicking any nav link
      document.querySelectorAll('.mobile-nav-link, .btn-pill-cta').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
        });
      });
    }

    // Modal Close Events
    if (cakeModalCloseBtn) cakeModalCloseBtn.addEventListener('click', closeCakeModal);
    if (cakeModal) {
      cakeModal.addEventListener('click', e => {
        if (e.target === cakeModal) closeCakeModal();
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeCakeModal();
    });

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }
    }, { passive: true });
  }

  // --- 7. Application Bootstrapping ---
  function init() {
    applyTheme(currentTheme);
    setLanguage(currentLang);
    initEventListeners();
    initCustomCursor();

    // Re-check live opening vibe periodically (every minute)
    setInterval(renderLiveStatus, 60000);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
