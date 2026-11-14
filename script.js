const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const filterButtons = document.querySelectorAll('.filter-btn');
const revealItems = document.querySelectorAll('.reveal');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-content img');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxMeta = document.getElementById('lightboxMeta');
const lightboxDescription = document.getElementById('lightboxDescription');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
const contactForm = document.getElementById('projectForm');

const artApiUrl = '/.netlify/functions/get-artwork';

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    const artworkCards = document.querySelectorAll('.art-card');

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    artworkCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

const normalizeCategory = (value) => {
  if (!value) return 'abstract';
  const normalized = String(value).trim().toLowerCase();
  return normalized.replace(/\s+/g, '-');
};

const bindLightboxTriggers = () => {
  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });
};

const openLightbox = (button) => {
  const { title, year, medium, description, image } = button.dataset;
  if (!lightboxImage || !lightboxTitle || !lightboxMeta || !lightboxDescription || !lightbox) return;

  lightboxImage.src = image;
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  lightboxMeta.textContent = `${year} — ${medium}`;
  lightboxDescription.textContent = description;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const renderAirtableCards = (records) => {
  const grid = document.querySelector('.art-grid');
  if (!grid) return;

  grid.innerHTML = '';

  records.forEach((record) => {
    const item = record.fields ? record.fields : record;
    const title = item.Title || record.title || 'Untitled';
    const year = item['Release Date'] ? new Date(item['Release Date']).getFullYear() : (record.year || '2026');
    const description = item.Description || record.description || 'No description provided yet.';
    const medium = item.Medium || item.Status || record.medium || 'Mixed Media';
    const category = normalizeCategory(item.Category || item['Content Type'] || item.Type || record.category || 'abstract');
    const image = item['Cover Art']?.[0]?.url || item['Image URL'] || record.image || 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80';

    const card = document.createElement('article');
    card.className = 'art-card';
    card.dataset.category = category;
    card.innerHTML = `
      <img src="${image}" alt="${title}" />
      <div class="art-overlay">
        <div>
          <p class="art-tag">${category}</p>
          <h4>${title}</h4>
        </div>
        <span>${year}</span>
      </div>
      <button
        class="lightbox-trigger"
        data-title="${title}"
        data-year="${year}"
        data-medium="${medium}"
        data-description="${description}"
        data-image="${image}"
      >
        View Artwork
      </button>
    `;

    grid.appendChild(card);
  });

  bindLightboxTriggers();
};

const loadAirtableContent = async () => {
  try {
    const response = await fetch(artApiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Artwork API request failed: ${response.status}`);
    }

    const data = await response.json();
    const records = Array.isArray(data.records) ? data.records : [];
    renderAirtableCards(records);
  } catch (error) {
    console.error('Airtable fetch error:', error);
  }
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
};

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxBackdrop) {
  lightboxBackdrop.addEventListener('click', closeLightbox);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

loadAirtableContent();

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    if (!button) return;

    button.textContent = 'Inquiry Sent';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = 'Send Project Inquiry';
      button.disabled = false;
      contactForm.reset();
    }, 2200);
  });
}
