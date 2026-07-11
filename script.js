/* ═══════════════════════════════════════════════════════
   NILADRI CHATTERJEE — Main JavaScript
   Cursor · Loader · Smooth Scroll · Animations · Nav
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ─────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  const loaderNum = document.getElementById('loader-num');
  const loaderBar = document.querySelector('.loader-bar');
  let progress = 0;

  const loaderInterval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      setTimeout(hideLoader, 350);
    }
    loaderNum.textContent = Math.round(progress);
    loaderBar.style.width = progress + '%';
  }, 80);

  function hideLoader() {
    loader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    loader.style.opacity = '0';
    loader.style.transform = 'translateY(-4%)';
    setTimeout(() => {
      loader.style.display = 'none';
      initAnimations();
    }, 800);
  }

  /* ── LENIS SMOOTH SCROLL ────────────────────────────── */
  let lenis;
  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      touchMultiplier: 2,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger to Lenis
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* ── CUSTOM CURSOR ───────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (cursor && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follows with lerp
    (function animRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animRing);
    })();

    // Project card hover
    document.querySelectorAll('.cursor-project').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-project'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-project'));
    });

    // Magnetic buttons
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }


  /* ── NAVIGATION ─────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      mobileMenu.setAttribute('aria-hidden', !open);
      navToggle.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(4px, 4px)' : '';
      navToggle.querySelectorAll('span')[1].style.transform = open ? 'rotate(-45deg) translate(4px, -4px)' : '';
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        navToggle.querySelectorAll('span').forEach(s => s.style.transform = '');
      });
    });
  }

  /* ── BACK TO TOP ─────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.5 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── HERO PARALLAX ───────────────────────────────────── */
  const heroRight = document.getElementById('heroRight');
  if (heroRight && window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      const nx = (e.clientX / W - 0.5) * 24;
      const ny = (e.clientY / H - 0.5) * 16;
      heroRight.style.transform = `translate(${nx}px, ${ny}px)`;
    });
  }

  /* ── VANILLA TILT for skill cards ───────────────────── */
  function initTilt() {
    if (window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 8, speed: 400, glare: true, 'max-glare': 0.08,
      });
    }
  }

  /* ── TESTIMONIALS SLIDER ────────────────────────────── */
  function initTestimonials() {
    const track = document.getElementById("testimonialsTrack");
    const prevBtn = document.getElementById("tPrev");
    const nextBtn = document.getElementById("tNext");
    const dotsWrapper = document.getElementById("tDots");
    const progressFill = document.getElementById("tProgress");
    const wrapper = document.getElementById("tWrapper");

    if (!track || !prevBtn || !nextBtn || !dotsWrapper) return;

    const cards = [...track.querySelectorAll(".testimonial-card")];
    const total = cards.length;
    const AUTO_DELAY = 3000;

    let current = 0;
    let autoTimer = null;
    let progressTimer = null;

    // Build dots
    dotsWrapper.innerHTML = "";
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        goTo(i);
        restartAuto();
      });
      dotsWrapper.appendChild(dot);
    });

    const dots = [...dotsWrapper.querySelectorAll(".dot")];

    function render() {
      track.style.transform = `translate3d(-${current * 100}%, 0, 0)`;
      cards.forEach((card, i) => card.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    }

    function goTo(i) {
      current = (i + total) % total;
      render();
    }

    function nextSlide() { goTo(current + 1); }
    function prevSlide() { goTo(current - 1); }

    function startProgress() {
      if (!progressFill) return;
      clearInterval(progressTimer);
      progressFill.style.transition = "none";
      progressFill.style.width = "0%";
      void progressFill.offsetWidth; // force reflow
      progressFill.style.transition = `width ${AUTO_DELAY}ms linear`;
      progressFill.style.width = "100%";
    }

    function startAuto() {
      stopAuto();
      startProgress();
      autoTimer = setInterval(() => {
        nextSlide();
        startProgress();
      }, AUTO_DELAY);
    }

    function stopAuto() {
      clearInterval(autoTimer);
      clearInterval(progressTimer);
    }

    function restartAuto() {
      stopAuto();
      startAuto();
    }

    prevBtn.addEventListener("click", () => { prevSlide(); restartAuto(); });
    nextBtn.addEventListener("click", () => { nextSlide(); restartAuto(); });

    // Keyboard navigation
    wrapper.setAttribute("tabindex", "0");
    wrapper.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { nextSlide(); restartAuto(); }
      if (e.key === "ArrowLeft") { prevSlide(); restartAuto(); }
    });

    // Touch swipe
    let startX = 0;
    let dragging = false;

    wrapper.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
      dragging = true;
      stopAuto();
    }, { passive: true });

    wrapper.addEventListener("touchend", e => {
      if (!dragging) return;
      dragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (diff > 50) nextSlide();
      else if (diff < -50) prevSlide();
      restartAuto();
    });

    // Pause on hover and on keyboard focus
    wrapper.addEventListener("mouseenter", stopAuto);
    wrapper.addEventListener("mouseleave", startAuto);
    wrapper.addEventListener("focusin", stopAuto);
    wrapper.addEventListener("focusout", startAuto);

    // Pause when tab is hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    render();
    startAuto();
  }

  document.addEventListener("DOMContentLoaded", initTestimonials);






  /* ── TIMELINE LINE ANIMATION ─────────────────────────── */
  function initTimeline() {
    const line = document.getElementById('timelineLine');
    if (!line) return;
    const timeline = line.parentElement;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const h = timeline.scrollHeight;
          line.style.height = h + 'px';
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });
    obs.observe(timeline);
  }

  /* ── SCROLL REVEAL ───────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal-fade, .reveal-up');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('revealed'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(el => obs.observe(el));
  }

  /* ── HERO HEADLINE STAGGER ───────────────────────────── */
  function initHeroText() {
    const lines = document.querySelectorAll('.hero-headline .split-line');
    lines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(40px)';
      line.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s`;
      setTimeout(() => { line.style.opacity = '1'; line.style.transform = 'translateY(0)'; }, 50);
    });
  }

  /* ── MOCKUP FLOAT ANIMATION ──────────────────────────── */
  function initMockupFloat() {
    const cards = document.querySelectorAll('.mockup-card');
    cards.forEach((card, i) => {
      const amp = 8 + i * 3;
      const speed = 3000 + i * 700;
      const delay = i * 400;
      card.style.transition = `transform ${speed}ms ease-in-out`;

      setInterval(() => {
        const y = (Math.sin(Date.now() / speed) * amp);
        card.style.transform = `translateY(${y}px) rotate(${(i % 2 === 0 ? 1 : -1) * (i + 1)}deg)`;
      }, 16);

      // Set initial rotation
      setTimeout(() => {
        card.style.transform = `rotate(${(i % 2 === 0 ? 1 : -1) * (i + 1)}deg)`;
      }, delay);
    });
  }

  /* ── CONTACT FORM ────────────────────────────────────── */
  function initForm() {
    const btn = document.getElementById('formSubmit');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();
      if (!name || !email || !message) {
        btn.textContent = 'Please fill all fields';
        btn.style.background = '#ff4444';
        setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 2500);
        return;
      }
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#00C16A';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = 'Send Another'; btn.style.background = ''; btn.disabled = false; }, 3500);
    });
  }

  /* ── SMOOTH ANCHOR SCROLL ────────────────────────────── */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') { e.preventDefault(); if (lenis) lenis.scrollTo(0); return; }
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -80, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── INIT ALL ────────────────────────────────────────── */
  function initAnimations() {
    if (window.Lenis) initLenis();
    initReveal();
    initHeroText();
    initMockupFloat();
    initTestimonials();
    initTimeline();
    initTilt();
    initForm();
    initAnchorScroll();
  }

  /* ── GSAP (if available) ─────────────────────────────── */
  window.addEventListener('load', () => {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      // Stat counter animation
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.textContent);
        if (isNaN(target)) return;
        const accent = el.querySelector('.accent')?.outerHTML || '';
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: target, duration: 1.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate() { el.innerHTML = Math.round(+el.textContent) + accent; }
        });
      });
    }
  });

});





document.addEventListener('DOMContentLoaded', () => {

  // ... all your existing code ...

  function initMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;

    const items = ['Brand Identity', 'Packaging Design', 'Visual Systems', 'Web Design', 'Motion Graphics', 'Social Media'];
    const html = items.map(i => `<span>${i}</span><span class="marquee-dot">✦</span>`).join('');
    track.innerHTML = html + html + html;

    let x = 0;
    const speed = 0.5; // Adjust speed as needed
    const singleWidth = track.scrollWidth / 3;

    function tick() {
      x -= speed;
      if (Math.abs(x) >= singleWidth) x = 0;
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  initMarquee(); // <-- right here, not inside initAnimations

});




/* ══════════════════════════════════════════════════════════
   PROJECT SHOWCASE — gallery lightbox
   ──────────────────────────────────────────────────────────
   • Click/tap the image OR the "View Project" button → opens
     a single shared lightbox with that project's images.
   • Navigate with: swipe (touch), click-drag (mouse), the
     prev/next arrows, the dots, or the ← → arrow keys.
   • Esc, the ✕ button, or clicking outside the panel closes it.
   • Nothing here changes the page/URL — it's all one page.
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', initProjectShowcase);

function initProjectShowcase() {

  /* ----------------------------------------------------------
     1. DATA
     One entry per real project image, using your actual
     /images/... paths. Add more objects to any `images` array
     later if you shoot additional angles for that project —
     the gallery, dots, and counter already support it.
  ---------------------------------------------------------- */
  const PROJECTS = {
    'shaan-bazaar': {
      title: 'Shaan Bazaar',
      year: '2024',
      tags: ['Brand Identity', 'Retail'],
      description:
        'Shaan Bazaar is a modern retail brand identity developed to blend traditional values with contemporary shopping experiences. The project includes logo design, store branding, shopping bags, price tags, employee uniforms, and promotional materials, creating a consistent and memorable customer experience across both physical and digital platforms.',

      images: [
        { src: '/shaanbazzar/LOGO IMG.webp', alt: 'Shaan Bazaar logo', title: 'Primary Logo', description: 'The primary logo combines modern retail aesthetics with traditional Indian typography to create a memorable and trustworthy brand identity.' },
        { src: '/shaanbazzar/STORE FONT.webp', alt: 'Shaan Bazaar STORE FONT', title: 'Store Font', description: 'The store font is designed to be highly readable and visually appealing in a retail environment.' },
        { src: '/shaanbazzar/CASH COUNTER.webp', alt: 'Shaan Bazaar CASH COUNTER', title: 'Cash Counter', description: 'The cash counter design emphasizes functionality and security while maintaining a modern look.' },
        { src: '/shaanbazzar/BAG MOCKUP.webp', alt: 'Shaan Bazaar BAG MOCKUP', title: 'Bag Mockup', description: 'The bag mockup showcases the packaging design in a real-world application.' },
        { src: '/shaanbazzar/PRICE TAG.webp', alt: 'Shaan Bazaar PRICE TAG', title: 'Price Tag', description: 'The price tag design is clean and informative, ensuring customers can easily identify product prices.' },
        { src: '/shaanbazzar/WORKER IMAGE.webp', alt: 'Shaan Bazaar WORKER IMAGE', title: 'Worker Image', description: 'The worker image highlights the human element of the brand, emphasizing customer service and quality.' }
      ]
    },
    'theeka': {
      title: 'Theeka',
      year: '2024',
      tags: ['Packaging', 'FMCG'],

      description:
        'Theekha is a premium spice and FMCG packaging project inspired by authentic Kerala flavors. The work includes logo design, packaging systems, label layouts, and marketing assets focused on preserving heritage while ensuring modern shelf appeal and clear product information.',


      images: [
        { src: '/theekha/mainlogo.webp', alt: 'Theeka packaging design' },
        { src: '/theekha/thekkalogo.webp', alt: 'Theeka packaging design' },
        { src: '/theekha/thekkapakeging.webp', alt: 'Theeka packaging design' }
      ]
    },



    'fit-fushion': {
      title: 'FIT FUSHION',
      year: '2024',
      tags: ['Brand Identity', 'Fitness'],

      description:
        'FIT FUSHION is a dynamic brand identity project tailored for the fitness and wellness sector. The work includes logo design, marketing collateral, packaging concepts, and digital assets focused on conveying energy, strength, and modern lifestyle appeal.',



      images: [
        { src: '/fitfushion/logo.webp', alt: 'FIT FUSHION brand identity' },
        { src: '/fitfushion/brandmockup.webp', alt: 'FIT FUSHION brand identity' },
        { src: '/fitfushion/men mockup.webp', alt: 'FIT FUSHION brand identity' },
        { src: '/fitfushion/water bottle.webp', alt: 'FIT FUSHION brand identity' },
        { src: '/fitfushion/weight.webp', alt: 'FIT FUSHION brand identity' },
        { src: '/fitfushion/app logo.webp', alt: 'FIT FUSHION brand identity' }
      ]
    },





    'greensip': {
      title: 'Greensip',
      year: '2023',
      tags: ['Packaging', 'FMCG'],

      description:
        'Greensip is a fresh, eco-friendly beverage packaging design project for a plant-based juice brand. The work includes label design, packaging structure, and brand visuals aimed at conveying health, nature, and premium sustainability.',

      images: [
        { src: '/greensip/logo.webp', alt: 'Greensip Logo' },
        { src: '/greensip/packeging.webp', alt: 'Greensip packaging' },
        { src: '/greensip/sticker.webp', alt: 'Greensip packaging' },
        { src: '/greensip/bag.webp', alt: 'Greensip packaging' },
      ]
    },



    'nolimits': {
      title: 'NO LIMITS',
      year: '2026',
      tags: ['Brand Identity', 'Sports Footwear'],

      description:
        'NO LIMITS is a bold sports footwear brand identity project focusing on performance, movement, and modern athletic culture. The work includes logo design, marketing visuals, product packaging concepts, and digital assets aimed at conveying speed, strength, and confidence.',


      images: [
        {
          src: '/nolimits/logo.webp',
          alt: 'NO LIMITS sports footwear branding'
        },
        {
          src: '/nolimits/instagram.webp',
          alt: 'NO LIMITS social media campaign'
        },
        {
          src: '/nolimits/hoading.webp',
          alt: 'NO LIMITS product features'
        },
      ]
    },

    'utsav-electronics': {
      title: 'Utsav Electronics',
      year: '2022',
      tags: ['Brand Identity', 'Retail'],
      description:
        'Utsav Electronics is a comprehensive brand identity project for a consumer electronics retail chain. The work includes logo design, store branding, packaging, promotional materials, and digital assets aimed at creating a cohesive and modern retail experience.',

      images: [
        { src: '/utsav/logo.webp', alt: 'Utsav Electronics brand identity' },
        { src: '/utsav/Citylight Mockup.webp', alt: 'Utsav Electronics store branding' },
        { src: '/utsav/ROAD SIDE BANNER.webp', alt: 'Utsav Electronics promotional materials' },
        { src: '/utsav/MOBILE MOCKUP.webp', alt: 'Utsav Electronics digital assets' },
        { src: '/utsav/3.webp', alt: 'Utsav Electronics retail experience' }
      ]
    }
  };

  /* ----------------------------------------------------------
     2. DOM REFERENCES
 
  /* ----------------------------------------------------------
     2. DOM REFERENCES
  ---------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // this page doesn't have the gallery markup

  const trackEl = document.getElementById('lightboxTrack');
  const viewport = document.getElementById('lightboxViewport');
  const titleEl = document.getElementById('lightboxTitle');
  const yearEl = document.getElementById('lightboxYear');
  const tagsEl = document.getElementById('lightboxTags');
  const dotsEl = document.getElementById('lightboxDots');
  const countEl = document.getElementById('lightboxCount');
  const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
  const nextBtn = lightbox.querySelector('[data-lightbox-next]');
  const descriptionEl = document.getElementById('lightboxProjectDescription');

  let currentImages = [];
  let currentIndex = 0;
  let lastFocused = null;

  /* ----------------------------------------------------------
     3. RENDER + NAVIGATE
  ---------------------------------------------------------- */
  function buildSlides(images) {
    trackEl.innerHTML = images.map(img => `
      <div class="lightbox-slide">
        <img class="lightbox-slide-bg" src="${img.src}" alt="" draggable="false" aria-hidden="true">
        <img class="lightbox-slide-img" src="${img.src}" alt="${img.alt || ''}" draggable="false">
      </div>
    `).join('');

    dotsEl.innerHTML = images.map((_, i) =>
      `<button type="button" class="lightbox-dot" data-dot-index="${i}" aria-label="Go to image ${i + 1}"></button>`
    ).join('');
  }

  function goTo(index) {
    const count = currentImages.length;
    currentIndex = (index + count) % count;
    trackEl.style.transform = `translateX(-${currentIndex * 100}%)`;

    dotsEl.querySelectorAll('.lightbox-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });

    countEl.textContent = `${currentIndex + 1} / ${count}`;


    const multi = count > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
    dotsEl.hidden = !multi;
  }

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  /* ----------------------------------------------------------
     4. OPEN / CLOSE
  ---------------------------------------------------------- */
  function openLightbox(id, triggerEl) {
    const project = PROJECTS[id];
    if (!project) return;

    lastFocused = triggerEl || document.activeElement;
    currentImages = project.images;

    titleEl.textContent = project.title;
    yearEl.textContent = project.year;

    descriptionEl.textContent = project.description;

    tagsEl.innerHTML = project.tags
      .map(tag => `<span class="sw-tag">${tag}</span>`)
      .join('');

    buildSlides(currentImages);
    goTo(0);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  /* ----------------------------------------------------------
     5. WIRE UP TRIGGERS (button + clicking/tapping the image)
  ---------------------------------------------------------- */
  document.querySelectorAll('[data-open-project]').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.openProject, el));
  });

  document.querySelectorAll('.sw-card-media').forEach(el => {
    const id = el.dataset.projectId;

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Open project gallery');

    el.addEventListener('click', () => openLightbox(id, el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(id, el);
      }
    });

    // Hover preview: if a project has more than one image, cycle
    // through them right on the card while the pointer is over it.
    const project = PROJECTS[id];
    if (!project || project.images.length < 2) return;

    const img = el.querySelector('.sw-card-media-img');
    const hintLabel = el.querySelector('.sw-card-hint-label');
    if (hintLabel) hintLabel.textContent = 'Swipe gallery';

    const originalSrc = img.src;
    let hoverIndex = 0;
    let hoverTimer = null;

    el.addEventListener('mouseenter', () => {
      hoverTimer = setInterval(() => {
        hoverIndex = (hoverIndex + 1) % project.images.length;
        img.src = project.images[hoverIndex].src;
      }, 900);
    });

    el.addEventListener('mouseleave', () => {
      clearInterval(hoverTimer);
      hoverIndex = 0;
      img.src = originalSrc;
    });
  });

  /* ----------------------------------------------------------
     6. CLOSE TRIGGERS
  ---------------------------------------------------------- */
  lightbox.querySelectorAll('[data-lightbox-dismiss]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  dotsEl.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-dot-index]');
    if (dot) goTo(Number(dot.dataset.dotIndex));
  });

  /* ----------------------------------------------------------
     7. SWIPE / DRAG — Pointer Events cover touch, mouse & pen
        in one code path.
  ---------------------------------------------------------- */
  let pointerDown = false;
  let startX = 0;
  let deltaX = 0;

  viewport.addEventListener('pointerdown', (e) => {
    pointerDown = true;
    startX = e.clientX;
    deltaX = 0;
    trackEl.style.transition = 'none';
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!pointerDown) return;
    deltaX = e.clientX - startX;
    const base = -currentIndex * viewport.offsetWidth;
    trackEl.style.transform = `translateX(${base + deltaX}px)`;
  });

  function endDrag() {
    if (!pointerDown) return;
    pointerDown = false;
    trackEl.style.transition = '';

    const threshold = viewport.offsetWidth * 0.18;
    if (deltaX > threshold) prev();
    else if (deltaX < -threshold) next();
    else goTo(currentIndex); // snap back
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', () => { if (pointerDown) endDrag(); });
}
