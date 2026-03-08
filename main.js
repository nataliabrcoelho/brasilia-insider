/* ═══════════════════════════════════════════════════════
   BRASÍLIA INSIDER – Main JavaScript
   ═══════════════════════════════════════════════════════ */

/* ── Nav: mobile menu toggle ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── Nav: shrink on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(10, 22, 40, 0.98)';
  } else {
    navbar.style.background = 'rgba(10, 22, 40, 0.95)';
  }
});

/* ── Airbnb Experience Selector ── */
const expCards = document.querySelectorAll('.exp-card');
const expCounter = document.getElementById('expCounter');
let selectedExps = new Set();
const MAX_EXP = 5;

expCards.forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.exp;
    if (selectedExps.has(id)) {
      selectedExps.delete(id);
      card.classList.remove('selected');
    } else {
      if (selectedExps.size >= MAX_EXP) {
        card.style.animation = 'shake 0.35s ease';
        setTimeout(() => card.style.animation = '', 400);
        return;
      }
      selectedExps.add(id);
      card.classList.add('selected');
    }
    updateExpCounter();
  });
});

function updateExpCounter() {
  const n = selectedExps.size;
  expCounter.textContent = `${n} / ${MAX_EXP} selected`;
  expCounter.style.color = n === MAX_EXP ? '#2a7a2a' : 'var(--gold-dark)';
  expCounter.style.background = n === MAX_EXP ? 'rgba(42,122,42,0.08)' : 'rgba(201,168,76,0.08)';
}

// Shake animation for max exceeded
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
`;
document.head.appendChild(style);

/* ── Native Experience: Vibe Selector ── */
const vibeCards = document.querySelectorAll('.vibe-card');
vibeCards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
  });
});

/* ── Native Experience: Pace Buttons ── */
const paceBtns = document.querySelectorAll('.pace-btn');
paceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    // Deselect siblings in same group
    document.querySelectorAll(`.pace-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── Native Form Submit ── */
const nativeForm = document.getElementById('nativeForm');
nativeForm.addEventListener('submit', e => {
  e.preventDefault();

  const vibes = [...document.querySelectorAll('.vibe-card.selected')].map(c => c.dataset.vibe);
  const pace = document.querySelector('.pace-btn.active[data-group="pace"]')?.dataset.val;
  const timing = document.querySelector('.pace-btn.active[data-group="time"]')?.dataset.val;

  // Build WhatsApp message
  const name = document.getElementById('nName').value;
  const date = document.getElementById('nDate').value;
  const group = document.getElementById('nGroup').value;
  const notes = document.getElementById('nNotes').value;

  const msg = encodeURIComponent(
    `Hi Brasília Insider! I'd like to book a "Get to Know Brasília with a Native" experience.\n\n` +
    `Name: ${name}\nDate: ${date}\nGroup: ${group}\n` +
    `Vibes: ${vibes.length ? vibes.join(', ') : 'not selected'}\n` +
    `Pace: ${pace || 'not selected'}\nTiming: ${timing || 'not selected'}\n` +
    (notes ? `Notes: ${notes}` : '')
  );

  window.open(`https://wa.me/5561999999999?text=${msg}`, '_blank');
});

/* ── Concierge: Attraction Chips ── */
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('active');
  });
});

/* ── Concierge Form Submit ── */
const conciergeForm = document.getElementById('conciergeForm');
const conciergeConfirm = document.getElementById('conciergeConfirm');

conciergeForm.addEventListener('submit', e => {
  e.preventDefault();

  const selectedPlaces = [...document.querySelectorAll('.chip.active')].map(c => c.dataset.place);
  const name = document.getElementById('cName').value;
  const email = document.getElementById('cEmail').value;
  const date = document.getElementById('cDate').value;
  const group = document.getElementById('cGroup').value;
  const notes = document.getElementById('cNotes').value;

  // Send to WhatsApp
  const msg = encodeURIComponent(
    `Hi! I'd like to request a custom tour.\n\n` +
    `Name: ${name}\nEmail: ${email}\nDate: ${date}\nGroup: ${group}\n` +
    `Attractions: ${selectedPlaces.length ? selectedPlaces.join(', ') : 'not specified'}\n` +
    (notes ? `Notes: ${notes}` : '')
  );

  // Show confirmation
  conciergeForm.style.display = 'none';
  conciergeConfirm.style.display = 'block';
  conciergeConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Open WhatsApp after short delay
  setTimeout(() => {
    window.open(`https://wa.me/5561999999999?text=${msg}`, '_blank');
  }, 800);
});

/* ── Restaurant Category Tabs ── */
const cuisineTabs = document.querySelectorAll('.cuisine-tab');
const restaurantPanels = document.querySelectorAll('.restaurant-panel');

cuisineTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.cat;

    cuisineTabs.forEach(t => t.classList.remove('active'));
    restaurantPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.querySelector(`.restaurant-panel[data-panel="${cat}"]`).classList.add('active');
  });
});

/* ── Star Field (dark section) ── */
function createStars() {
  const container = document.getElementById('starsCanvas');
  if (!container) return;

  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 4}s;
      width: ${Math.random() < 0.8 ? 1 : 2}px;
      height: ${Math.random() < 0.8 ? 1 : 2}px;
      opacity: ${0.2 + Math.random() * 0.6};
    `;
    container.appendChild(star);
  }
}
createStars();

/* ── Scroll-reveal animation ── */
const revealElements = document.querySelectorAll(
  '.tour-card, .route-step, .vibe-card, .restaurant-card, .testimonial, .vp, .exp-card'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.07}s, transform 0.5s ease ${(i % 6) * 0.07}s`;
  observer.observe(el);
});

/* ── Smooth active nav link highlighting ── */
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--gold)'
      : 'rgba(255,255,255,0.8)';
  });
}, { passive: true });
