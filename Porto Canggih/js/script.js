/* ==========================================================================
   PORTFOLIO — script.js
   Fitur dipisah per fungsi supaya gampang dicari & diedit.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavOnScroll();
  initTypewriter();
  initScrollReveal();
  initCopyButtons();
  initFooterYear();
});

/* --------------------------------------------------------------------------
   1) MENU MOBILE — buka/tutup navbar di layar sempit
   -------------------------------------------------------------------------- */
function initMobileMenu(){
  const toggle = document.getElementById('navbarToggle');
  const menu = document.getElementById('navbarMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // tutup menu otomatis setelah klik salah satu link
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('is-open'));
  });
}

/* --------------------------------------------------------------------------
   2) NAV AKTIF SESUAI SCROLL — highlight menu sesuai section yang terlihat
   -------------------------------------------------------------------------- */
function initActiveNavOnScroll(){
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   3) EFEK MENGETIK — subjudul di hero
   Ganti array `roles` untuk mengubah teks yang berjalan.
   -------------------------------------------------------------------------- */
function initTypewriter(){
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Mahasiswa Informatika',
    'Video & Motion Editor',
    'Kolaboratif & Disiplin'
  ];

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced){
    el.textContent = roles.join(' · ');
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick(){
    const current = roles[roleIndex];

    if (!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 35 : 65);
  }

  tick();
}

/* --------------------------------------------------------------------------
   4) SCROLL REVEAL — elemen muncul dengan fade saat masuk layar
   -------------------------------------------------------------------------- */
function initScrollReveal(){
  const targets = document.querySelectorAll(
    '.highlight-card, .timeline-item, .skill-card, .contact-card'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const langFills = document.querySelectorAll('.lang-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));

  // animasi bar bahasa dipicu terpisah agar tetap jalan walau elemen induk kecil
  const langObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        langObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  langFills.forEach(el => langObserver.observe(el));
}

/* --------------------------------------------------------------------------
   5) SALIN KE CLIPBOARD — tombol "Salin" di kartu kontak
   -------------------------------------------------------------------------- */
function initCopyButtons(){
  const buttons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      try{
        await navigator.clipboard.writeText(value);
        showToast(`Disalin: ${value}`);
      } catch (err){
        const temp = document.createElement('textarea');
        temp.value = value;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`Disalin: ${value}`);
      }
    });
  });

  function showToast(message){
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
  }
}

/* --------------------------------------------------------------------------
   6) TAHUN DI FOOTER — otomatis, tidak perlu diedit manual tiap tahun
   -------------------------------------------------------------------------- */
function initFooterYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
