/* =========================================================
   CONFIG — edit bagian ini saja untuk personalisasi halaman.
   Tidak perlu menyentuh HTML atau CSS.
   ========================================================= */
const CONFIG = {
  pin: "12345",              // kode akses — bisa berapa digit aja, angka atau bisa dicampur (tetap disarankan pakai angka)

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
  ],

  music: {
    url: "her.mp3",                      // link file audio langsung (.mp3/.wav/.ogg) — kosongkan untuk sembunyikan tombol musik
    title: "HER — JVKE"    // ditampilkan di sebelah tombol saat lagu diputar
  }
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
   GERBANG PIN — keypad
   ========================================================= */
function initPinGate() {
  const screen = document.getElementById('pinScreen');
  const dotsWrap = document.getElementById('pinDots');
  const keypad = document.getElementById('keypad');
  const error = document.getElementById('pinError');
  const content = document.getElementById('siteContent');

  let buffer = '';

  function renderDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < CONFIG.pin.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'pin-dot' + (i < buffer.length ? ' is-filled' : '');
      dotsWrap.appendChild(dot);
    }
  }

  function showError() {
    error.classList.add('show');
    dotsWrap.classList.add('is-shaking');
    setTimeout(() => dotsWrap.classList.remove('is-shaking'), 400);
    buffer = '';
    renderDots();
  }

  function unlock() {
    screen.classList.add('is-hidden');
    content.classList.add('is-unlocked');
    setTimeout(() => screen.remove(), 700);
  }

  function checkPin() {
    if (buffer.length === 0) return;
    if (buffer === CONFIG.pin) {
      unlock();
    } else {
      showError();
    }
  }

  function pressKey(key) {
    error.classList.remove('show');

    if (key === 'clear') {
      buffer = '';
      renderDots();
      return;
    }
    if (key === 'enter') {
      checkPin();
      return;
    }
    if (buffer.length >= CONFIG.pin.length) return;
    buffer += key;
    renderDots();
  }

  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('.key');
    if (!btn) return;
    pressKey(btn.dataset.key);
  });

  // dukungan keyboard fisik juga
  document.addEventListener('keydown', (e) => {
    if (screen.classList.contains('is-hidden')) return;
    if (/^[0-9]$/.test(e.key)) pressKey(e.key);
    else if (e.key === 'Enter') pressKey('enter');
    else if (e.key === 'Backspace') { buffer = buffer.slice(0, -1); renderDots(); }
    else if (e.key === 'Escape') { buffer = ''; renderDots(); }
  });

  renderDots();
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
    ctx.fillStyle = '#F6A6C1';
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
  const candles = document.querySelectorAll('.candle');
  const hint = document.getElementById('hint');
  const hero = document.querySelector('.hero');
  const gallery = document.getElementById('gallerySection');
  let blownCount = 0;
  let done = false;

  function blowOne(candle) {
    if (done || candle.classList.contains('blown')) return;
    candle.classList.add('blown');
    burstMotes(candle);
    blownCount++;

    if (blownCount < candles.length) {
      const sisa = candles.length - blownCount;
      hint.textContent = sisa === 1 ? 'satu lagi!' : `${sisa} lilin lagi...`;
    } else {
      done = true;
      hint.textContent = 'harapanmu sudah dikirim ke semesta';

      const cakeRect = document.querySelector('.cake').getBoundingClientRect();
      fireFlowerBurst(cakeRect.left + cakeRect.width / 2, cakeRect.top);

      setTimeout(() => {
        document.querySelectorAll('.locked').forEach((el) => el.classList.remove('locked'));
        hero.classList.add('is-unlocked');
        gallery.classList.add('is-visible');
        gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1100);
    }
  }

  candles.forEach((candle) => {
    candle.addEventListener('click', () => blowOne(candle));
    candle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blowOne(candle); }
    });
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
   LEDAKAN BUNGA & KILAU — kejutan pas semua lilin selesai ditiup
   ========================================================= */
function fireFlowerBurst(originX, originY) {
  const pieces = ['🌸', '🌼', '🌷', '💐', '✨', '🎉'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'flower-burst';
    el.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 260;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 80;
    const rotate = Math.random() * 360 - 180;
    const duration = 1300 + Math.random() * 900;
    const size = 16 + Math.random() * 16;

    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.fontSize = `${size}px`;

    const anim = el.animate(
      [
        { transform: 'translate(0,0) rotate(0deg) scale(0.5)', opacity: 1 },
        { transform: `translate(${dx * 0.55}px, ${dy * 0.55}px) rotate(${rotate * 0.5}deg) scale(1.05)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy + 320}px) rotate(${rotate}deg) scale(0.85)`, opacity: 0 }
      ],
      { duration, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }
    );
    anim.onfinish = () => el.remove();
  }
}

/* =========================================================
   PEMUTAR MUSIK
   ========================================================= */
function initMusic() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  const label = document.getElementById('musicLabel');

  if (!CONFIG.music || !CONFIG.music.url) {
    btn.style.display = 'none';
    return;
  }

  audio.src = CONFIG.music.url;
  label.textContent = CONFIG.music.title || 'putar lagu';
  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        label.textContent = 'gagal memutar lagu';
      });
    }
    playing = !playing;
    btn.classList.toggle('is-playing', playing);
  });
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
  const palette = ['#FFD9E4', '#D9F2E6', '#E6DDFB', '#FFEFC2'];
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
  initPinGate();
  initMotes();
  initCandle();
  initMusic();
  initLifeNumbers();
  initTypewriter();
  buildGallery();
  initLightbox();
  initQuotes();
  initScrollReveal();
});
