const API_BASE = (typeof window !== 'undefined' && window.location.origin && window.location.origin.includes('localhost')) ? 'http://localhost:3001' : '';

// ── Load Dynamic Data ──────────────────────
async function loadData() {
  try {
    const [settings, rooms, gallery] = await Promise.all([
      fetch(`${API_BASE}/api/settings`).then(r => r.json()),
      fetch(`${API_BASE}/api/rooms`).then(r => r.json()),
      fetch(`${API_BASE}/api/gallery`).then(r => r.json()),
    ]);

    applySettings(settings);
    renderRooms(rooms);
    renderGallery(gallery);
    updateTelegramLinks(settings.telegram_link);
    updateHeroImage(settings.hero_image);
  } catch (err) {
    console.log('Offline mode: using static content');
  }
}

function applySettings(settings) {
  document.querySelectorAll('[data-setting]').forEach(el => {
    const key = el.dataset.setting;
    if (settings[key] !== undefined && settings[key] !== null && settings[key] !== '') {
      el.textContent = settings[key];
    }
  });
}

function renderRooms(rooms) {
  const grid = document.getElementById('rooms-grid');
  if (!grid || !rooms.length) return;

  const icons = ['🛏️', '👥', '👑'];
  const gradients = [
    'linear-gradient(135deg, #1e3a6b 0%, #2563eb 40%, #1e4d8c 70%, #0f2347 100%)',
    'linear-gradient(135deg, #102a54 0%, #1a3a6b 35%, #2563eb 65%, #3b82f6 100%)',
    'linear-gradient(135deg, #0a1628 0%, #1a3a6b 35%, #2563eb 65%, #1e4d8c 100%)',
  ];

  grid.innerHTML = '';
  grid.innerHTML = rooms.map((room, i) => {
    const isFeatured = room.is_featured;
    const hasImage = room.image_url && room.image_url !== '/uploads/null';
    const gradientIdx = i % gradients.length;
    const icon = room.bed_type?.toLowerCase().includes('king') ? '👑'
      : room.bed_type?.toLowerCase().includes('queen') ? '🛏️'
      : icons[i] || '🛏️';

    return `
      <div class="room-card${isFeatured ? ' featured' : ''}" data-room-id="${room.id}">
        <div class="room-img-wrap" style="${hasImage ? '' : `background: ${gradients[gradientIdx]}`}">
          ${hasImage
            ? `<img src="${room.image_url.startsWith('http') ? room.image_url : API_BASE + room.image_url}" alt="${room.name}" class="room-img" />`
            : `<div class="no-image-icon" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);font-size:5rem;opacity:0.5;z-index:0">${icon}</div>`
          }
          ${room.badge ? `<div class="room-badge ${getBadgeClass(room.badge)}">${room.badge}</div>` : ''}
          <div class="room-img-overlay"></div>
          ${room.price ? `<div class="room-price-tag">$${room.price}<span>/night</span></div>` : ''}
        </div>
        <div class="room-body">
          <h3 class="room-name">${room.name}</h3>
          <p class="room-desc">${room.description || ''}</p>
          <ul class="room-amenities">
            <li><span class="amenity-icon">🛏️</span> ${room.bed_type || 'Comfortable bed'}</li>
            <li><span class="amenity-icon">📶</span> Free Wi-Fi</li>
            <li><span class="amenity-icon">🚿</span> Private bathroom</li>
            <li><span class="amenity-icon">❄️</span> Air conditioning</li>
          </ul>
          <a href="${getTelegramLink()}" target="_blank" class="room-btn${isFeatured ? ' featured-btn' : ''}">Book This Room</a>
        </div>
      </div>
    `;
  }).join('');
}

function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (!items.length) {
    grid.innerHTML = '<p class="text-center" style="color:#94a3b8;padding:40px 0">Gallery coming soon.</p>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <a href="${item.image_url.startsWith('http') ? item.image_url : API_BASE + item.image_url}" target="_blank" class="gallery-item">
      <img src="${item.image_url.startsWith('http') ? item.image_url : API_BASE + item.image_url}" alt="${item.caption || 'Guest House photo'}" loading="lazy" />
      ${item.caption ? `<div class="gallery-caption">${item.caption}</div>` : ''}
    </a>
  `).join('');
}

function updateTelegramLinks(link) {
  if (!link) return;
  document.querySelectorAll('a[href*="t.me"]').forEach(a => a.href = link);
  document.getElementById('telegram-book-btn')?.setAttribute('href', link);
}

function updateHeroImage(url) {
  if (!url) return;
  const img = document.querySelector('.hero-bg-img');
  if (img) {
    img.src = url.startsWith('http') ? url : API_BASE + url;
  }
}

function getTelegramLink() {
  const btn = document.getElementById('telegram-book-btn');
  return btn ? btn.getAttribute('href') : 'https://t.me/Jaredo_m';
}

function getBadgeClass(badge) {
  const map = { 'popular': 'popular', 'luxury': 'luxury', 'value': 'value', 'most popular': 'popular', 'luxury pick': 'luxury', 'great value': 'value', 'most affordable': '' };
  const lower = badge.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return '';
}

// ── Sticky Navbar ──────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  const sections = ['home', 'rooms', 'gallery', 'contact'];
  let activeSection = 'home';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) activeSection = id;
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === '#' + activeSection) link.classList.add('active');
  });
}, { passive: true });

// ── Mobile Hamburger ──────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-book-btn');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Smooth Scrolling ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ── Scroll Reveal ─────────────────────────
const revealElements = document.querySelectorAll(
  '.room-card, .feature-item, .testimonial-card, .contact-card, .section-header, .gallery-item'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const index = siblings.indexOf(entry.target);
      const delay = Math.min(index * 80, 300);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ── Telegram Button Pulse ─────────────────
const tgBtn = document.getElementById('telegram-book-btn');
if (tgBtn) {
  setInterval(() => {
    tgBtn.style.transform = 'translateY(-3px) scale(1.02)';
    setTimeout(() => {
      tgBtn.style.transform = '';
    }, 400);
  }, 3000);
}

// ── Room Card 3D Tilt Effect ─────────────
document.addEventListener('mouseover', (e) => {
  const card = e.target.closest('.room-card');
  if (!card) return;
  const handler = (ev) => {
    const rect = card.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  card.addEventListener('mousemove', handler);
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => card.style.transition = '', 400);
    card.removeEventListener('mousemove', handler);
  }, { once: true });
});

// ── Init ──────────────────────────────────
loadData();
console.log('%c Family Guest House website loaded successfully!', 'color: #2563eb; font-weight: bold; font-size: 14px;');
