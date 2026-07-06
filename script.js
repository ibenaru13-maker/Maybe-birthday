/* =========================================================
   CONFIG — edit bagian ini saja untuk personalisasi halaman.
   Tidak perlu menyentuh HTML atau CSS.
   ========================================================= */
const CONFIG = {
  name: "Nama Kamu",
  age: 20,
  birthDate: "2006-08-17",       // tanggal lahir lengkap, format YYYY-MM-DD — dipakai untuk angka kehidupan & hitung mundur

  message: "Semoga tahun ini membawa lebih banyak hal yang membuatmu tersenyum tanpa alasan, lebih banyak keberanian untuk hal-hal yang selama ini kamu ragukan, dan lebih banyak waktu untuk dirimu sendiri. Selamat merayakan satu putaran lagi mengelilingi matahari.",
  from: "Orang yang menyayangimu",

  photos: [
    { url: "", caption: "kenangan pertama" },
    { url: "", caption: "momen bahagia" },
    { url: "", caption: "hari spesial" },
    { url: "", caption: "bersama-sama" }
  ],

  quotes: [
    "Usia hanyalah angka; yang berarti adalah cerita yang kamu tulis di dalamnya.",
    "Setiap tahun adalah bab baru — semoga bab ini penuh keberanian.",
    "Rayakan dirimu hari ini, bukan hanya karena bertambah tua, tapi karena terus bertumbuh.",
    "Semoga kamu selalu punya alasan untuk tersenyum, bahkan di hari-hari biasa."
  ]
};

/* =========================================================
   ISI KONTEN DARI CONFIG
   ========================================================= */
function applyConfig() {
  document.querySelectorAll('[data-field]').forEach((el) => {
    const key = el.dataset.field.replace(/2$/, '');
    if (key === 'message') return; // ditangani terpisah oleh typewriter
    if (CONFIG[key] !== undefined) {
      el.textContent = CONFIG[key];
    }
  });
}

/* =========================================================
   PARTIKEL EMAS AMBIEN (canvas)
   ========================================================= */
function initMotes() {
  const canvas = document.getElementById('motes');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles() {
    const count = Math.min(50, Math.floor((w * h) / 28000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.6,
      speed: 0.08 + Math.random() * 0.18,
      drift: (Math.random() - 0.5) * 0.15,
      alpha: 0.15 + Math.random() * 0.35
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#C9A662';
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tick();
  }
}

/* =========================================================
   LILIN — tiup untuk membuat harapan
   ========================================================= */
function initCandle() {
  const btn = document.getElementById('candleBtn');
  const hint = document.getElementById('hint');
  const hero = document.querySelector('.hero');
  const gallery = document.getElementById('gallerySection');
  let blown = false;

  function blow() {
    if (blown) return;
    blown = true;
    btn.classList.add('blown');
    hint.textContent = 'harapanmu sudah dikirim ke semesta';
    hint.style.opacity = '0.85';
    burstMotes(btn);

    setTimeout(() => {
      // buka semua bagian yang tadinya belum "ada"
      document.querySelectorAll('.locked').forEach((el) => el.classList.remove('locked'));
      hero.classList.add('is-unlocked');

      gallery.classList.add('is-visible');
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 900);
  }

  btn.addEventListener('click', blow);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); }
  });
}

function burstMotes(originEl) {
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top;
  for (let i = 0; i < 16; i++) {
    const mote = document.createElement('span');
    mote.className = 'mote-burst';
    document.body.appendChild(mote);
    const angle = (Math.random() * 140 - 70) * (Math.PI / 180);
    const distance = 60 + Math.random() * 90;
    const dx = Math.sin(angle) * distance;
    const dy = -Math.cos(angle) * distance - 40;
    const size = 3 + Math.random() * 4;
    const duration = 900 + Math.random() * 700;
    mote.style.left = `${originX}px`;
    mote.style.top = `${originY}px`;
    mote.style.width = `${size}px`;
    mote.style.height = `${size}px`;
    const anim = mote.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 0.9 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0 }
      ],
      { duration, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }
    );
    anim.onfinish = () => mote.remove();
  }
}

/* =========================================================
   ANGKA KEHIDUPAN + HITUNG MUNDUR ULANG TAHUN BERIKUTNYA
   ========================================================= */
function initLifeNumbers() {
  const birth = new Date(`${CONFIG.birthDate}T00:00:00`);
  const dEl = document.getElementById('numDays');
  const hEl = document.getElementById('numHours');
  const mEl = document.getElementById('numMonths');

  function updateNumbers() {
    const now = new Date();
    const diffMs = now - birth;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const months = Math.floor(days / 30.44);

    dEl.textContent = days.toLocaleString('id-ID');
    hEl.textContent = hours.toLocaleString('id-ID');
    mEl.textContent = months.toLocaleString('id-ID');
  }

  updateNumbers();
  setInterval(updateNumbers, 60000);

  // countdown ke ulang tahun berikutnya, berbasis bulan/tanggal lahir
  const dBox = document.getElementById('cd-days');
  const hBox = document.getElementById('cd-hours');
  const mBox = document.getElementById('cd-mins');
  const sBox = document.getElementById('cd-secs');

  function nextBirthday() {
    const now = new Date();
    let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (next <= now) next = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    return next;
  }

  function tick() {
    const now = new Date();
    const diff = nextBirthday() - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dBox.textContent = String(days).padStart(2, '0');
    hBox.textContent = String(hours).padStart(2, '0');
    mBox.textContent = String(mins).padStart(2, '0');
    sBox.textContent = String(secs).padStart(2, '0');

    setTimeout(tick, 1000);
  }
  tick();
}

/* =========================================================
   PESAN DENGAN EFEK TYPEWRITER (dipicu saat masuk viewport)
   ========================================================= */
function initTypewriter() {
  const el = document.getElementById('messageText');
  const text = CONFIG.message;
  let started = false;

  function typeIt() {
    if (started) return;
    started = true;
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    let i = 0;

    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i += 2;
        setTimeout(step, 18);
      } else {
        cursor.remove();
      }
    }
    step();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeIt();
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(document.getElementById('messageSection'));
}

/* =========================================================
   GALERI + LIGHTBOX
   ========================================================= */
function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  const palette = ['#2A2438', '#332C44', '#3B3350', '#241F30'];
  grid.innerHTML = '';

  CONFIG.photos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    if (photo.url) {
      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.caption || '';
      item.appendChild(img);
    } else {
      item.style.background = palette[i % palette.length];
    }
    const label = document.createElement('span');
    label.textContent = photo.caption || '';
    item.appendChild(label);

    item.addEventListener('click', () => openLightbox(photo));
    grid.appendChild(item);
  });
}

function openLightbox(photo) {
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');

  image.style.backgroundImage = photo.url ? `url(${photo.url})` : 'none';
  caption.textContent = photo.caption || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
}

function initLightbox() {
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* =========================================================
   KUTIPAN BERGILIR
   ========================================================= */
function initQuotes() {
  const stage = document.getElementById('quoteText');
  const dotsWrap = document.getElementById('quoteDots');
  const quotes = CONFIG.quotes;
  let index = 0;
  let timer = null;

  quotes.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'quote-dot';
    dot.setAttribute('aria-label', `Kutipan ${i + 1}`);
    dot.addEventListener('click', () => show(i, true));
    dotsWrap.appendChild(dot);
  });

  function show(i, manual) {
    index = i;
    stage.classList.remove('is-active');
    setTimeout(() => {
      stage.textContent = `“${quotes[index]}”`;
      stage.classList.add('is-active');
      [...dotsWrap.children].forEach((d, di) => d.classList.toggle('is-active', di === index));
    }, 300);

    if (manual) restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => show((index + 1) % quotes.length), 5000);
  }

  show(0);
  restart();
}

/* =========================================================
   REVEAL ON SCROLL
   ========================================================= */
function initScrollReveal() {
  const targets = document.querySelectorAll('.numbers, .message, .gallery, .quotes');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach((el) => observer.observe(el));
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initMotes();
  initCandle();
  initLifeNumbers();
  initTypewriter();
  buildGallery();
  initLightbox();
  initQuotes();
  initScrollReveal();
});
