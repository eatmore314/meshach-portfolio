/* ============================================================
   MESHACH JACOBS PORTFOLIO — MAIN JS
   Three.js scene + GSAP animations + interactions
   ============================================================ */

'use strict';

/* ─── GSAP plugin registration ───────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─── GLOBALS ─────────────────────────────────────────────── */
let lenis;
const isMobile = () => window.innerWidth <= 768;

/* ─── BOOT SEQUENCE ──────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initPreloader();
});

/* ============================================================
   PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const counter  = document.getElementById('preloaderCounter');
  const bar      = document.getElementById('preloaderBar');

  const obj = { val: 0 };

  gsap.to(obj, {
    val: 100,
    duration: 2.0,
    ease: 'power2.inOut',
    onUpdate() {
      const n = Math.round(obj.val);
      counter.textContent = n.toString().padStart(3, '0');
      bar.style.width = n + '%';
    },
    onComplete() {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.25,
        onComplete() {
          preloader.style.display = 'none';
          bootApp();
        }
      });
    }
  });
}

/* ============================================================
   BOOT (runs after preloader exits)
   ============================================================ */
function bootApp() {
  initLenis();
  initCursor();
  initNav();
  initHeroAnimations();
  initMarquee();
  initScrollReveal();
  initSkillBars();
  initStatCounters();
  initProjectDrag();
  initMagnetic();
  initProjectTilt();
  initProjectCardLinks();
  initContactForm();
}

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
function initLenis() {
  lenis = new Lenis({
    duration:    1.2,
    easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* Back to top */
  document.getElementById('backToTop')?.addEventListener('click', e => {
    e.preventDefault();
    lenis.scrollTo(0, { duration: 1.6, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  if (isMobile()) return;

  const dot      = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mX = window.innerWidth  / 2;
  let mY = window.innerHeight / 2;
  let fX = mX, fY = mY;

  document.addEventListener('mousemove', e => {
    mX = e.clientX;
    mY = e.clientY;
    gsap.set(dot, { x: mX, y: mY });
  });

  /* Follower RAF loop */
  (function loopFollower() {
    fX += (mX - fX) * 0.11;
    fY += (mY - fY) * 0.11;
    gsap.set(follower, { x: fX, y: fY });
    requestAnimationFrame(loopFollower);
  })();

  /* Hover states */
  const targets = 'a, button, .project-card, input, textarea, select, .magnetic, .nav-cta';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hovering');
      follower.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hovering');
      follower.classList.remove('is-hovering');
    });
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav         = document.getElementById('nav');
  const hamburger   = document.getElementById('navHamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu?.querySelectorAll('.mobile-nav-link') ?? [];

  /* Scroll class */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* Active link (IntersectionObserver) */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));

  /* Mobile menu toggle */
  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      hamburger?.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   HERO ANIMATIONS
   ============================================================ */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  /* Title lines slide up */
  tl.to('.word-wrap', {
    y: '0%',
    duration: 1.2,
    stagger: 0.12,
  }, 0)

  /* Eyebrow fade in */
  .to('.hero-eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.9,
  }, 0.2)

  /* Hero bottom (includes badge + subtitle + buttons) */
  .to('.hero-bottom', {
    opacity: 1,
    y: 0,
    duration: 0.9,
  }, 0.5);
}

/* ============================================================
   MARQUEE
   ============================================================ */
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  const set = track.querySelector('.marquee-set');
  if (!set) return;

  /* Duplicate set for seamless loop */
  const clone = set.cloneNode(true);
  track.appendChild(clone);

  const totalW = set.scrollWidth;

  gsap.to(track, {
    x: -totalW,
    duration: 26,
    ease: 'none',
    repeat: -1,
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      }
    });
  });

  /* Section labels */
  document.querySelectorAll('.section-label').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      x: -14,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      }
    });
  });

  /* Work & contact headings split-line reveal */
  document.querySelectorAll('[data-split]').forEach(el => {
    const lines = el.innerHTML.split('<br>');
    el.innerHTML = lines
      .map(line => `<span class="clip-line"><span class="inner-line">${line}</span></span>`)
      .join('');

    gsap.from(el.querySelectorAll('.inner-line'), {
      y: '105%',
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: 'top 84%',
        once: true,
      }
    });
  });

  /* Stack columns stagger */
  gsap.from('.stack-col', {
    opacity: 0,
    y: 28,
    duration: 0.75,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.stack-grid',
      start: 'top 84%',
      once: true,
    }
  });

  /* Process strip */
  gsap.from('.process-step, .process-arrow', {
    opacity: 0,
    x: -16,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.process-strip',
      start: 'top 88%',
      once: true,
    }
  });
}

/* ============================================================
   SKILL BARS
   ============================================================ */
function initSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const target = bar.dataset.width;
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(bar, {
          width: target + '%',
          duration: 1.6,
          ease: 'power3.out',
        });
      }
    });
  });
}

/* ============================================================
   STAT COUNTERS
   ============================================================ */
function initStatCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(obj, {
          val: target,
          duration: 2.4,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(obj.val) + suffix;
          }
        });
      }
    });
  });
}

/* ============================================================
   PROJECT DRAG (horizontal scroll)
   ============================================================ */
function initProjectDrag() {
  const wrap  = document.getElementById('workScrollWrap');
  const inner = document.getElementById('workScrollInner');
  const hint  = document.getElementById('workDragHint');
  if (!wrap || !inner) return;

  let isDragging = false;
  let startX     = 0;
  let scrollLeft = 0;

  /* Mouse drag on the wrap (scrollable container) */
  wrap.addEventListener('mousedown', e => {
    isDragging = true;
    wrap.style.userSelect = 'none';
    startX     = e.pageX;
    scrollLeft = wrap.scrollLeft;
    wrap.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrap.style.userSelect = '';
    wrap.style.cursor = '';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    wrap.scrollLeft = scrollLeft - dx * 1.3;
  });

  /* Fade hint on first interaction */
  const fadeHint = () => {
    if (!hint) return;
    gsap.to(hint, { opacity: 0, duration: 0.5, onComplete: () => hint?.remove() });
    wrap.removeEventListener('mousedown', fadeHint);
    wrap.removeEventListener('touchstart', fadeHint);
    wrap.removeEventListener('scroll', fadeHint);
  };

  wrap.addEventListener('mousedown', fadeHint, { once: true });
  wrap.addEventListener('touchstart', fadeHint, { once: true });
  wrap.addEventListener('scroll', fadeHint,     { once: true, passive: true });

  /* Touch support — native scroll handles it; no extra logic needed */
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagnetic() {
  if (isMobile()) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;

      gsap.to(el, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/* ============================================================
   PROJECT CARD 3D TILT
   ============================================================ */
function initProjectTilt() {
  if (isMobile()) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 10,
        rotateX: -y * 10,
        transformPerspective: 900,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.75,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

/* ============================================================
   PROJECT CARD LINKS
   ============================================================ */
function initProjectCardLinks() {
  document.querySelectorAll('.project-card').forEach(card => {
    const link = card.querySelector('.project-link');
    if (!link || !link.href || link.href === window.location.href + '#') return;

    card.style.cursor = 'pointer';

    card.addEventListener('click', e => {
      if (e.target.closest('.project-link')) return;
      window.open(link.href, '_blank', 'noopener');
    });
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      name:    form.querySelector('#name').value.trim(),
      email:   form.querySelector('#email').value.trim(),
      project: form.querySelector('#project').value,
      budget:  form.querySelector('#budget').value,
      message: form.querySelector('#message').value.trim(),
    };

    if (!data.name || !data.email || !data.message) return;

    submitBtn.disabled = true;
    const textEl = submitBtn.querySelector('.btn-submit-text');
    textEl.textContent = 'Sending…';

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        textEl.textContent = 'Message Sent ✓';
        form.reset();
        setTimeout(() => {
          textEl.textContent = 'Send Message';
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      textEl.textContent = 'Failed — Try Again';
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   THREE.JS SCENE
   ============================================================ */
function initThreeScene() {
  const canvas = document.getElementById('canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Setup ─────────────────────────────────────────────── */
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, innerW() / innerH(), 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(innerW(), innerH());
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ── Mouse ─────────────────────────────────────────────── */
  const mouse  = { x: 0, y: 0 };
  const camTgt = { x: 0, y: 0 };

  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / innerW() - 0.5) * 2;
    mouse.y = -(e.clientY / innerH() - 0.5) * 2;
  });

  /* ── Particle field ─────────────────────────────────────── */
  const COUNT   = isMobile() ? 600 : 2200;
  const posArr  = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    posArr[i * 3]     = (Math.random() - 0.5) * 28;
    posArr[i * 3 + 1] = (Math.random() - 0.5) * 28;
    posArr[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

  const particleMat = new THREE.PointsMaterial({
    color:       0xf0ede8,
    size:        0.018,
    transparent: true,
    opacity:     0.28,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── Wireframe objects ──────────────────────────────────── */
  function wireMat(opacity = 0.09) {
    return new THREE.MeshBasicMaterial({
      color:       0xf0ede8,
      wireframe:   true,
      transparent: true,
      opacity,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
  }

  const objs = [];

  function addObj(geo, x, y, z, rx, ry, rz, rotSpeeds, floatAmp, floatSpeed) {
    const mesh = new THREE.Mesh(geo, wireMat());
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    scene.add(mesh);
    objs.push({
      mesh,
      baseY:      y,
      rotSpeeds,    /* [rx, ry, rz] per frame */
      floatAmp,
      floatSpeed,
      phase:      Math.random() * Math.PI * 2,
    });
  }

  if (!isMobile()) {
    addObj(new THREE.TorusKnotGeometry(1.5, 0.38, 128, 16), -4.5,  0.5, -2.5, 0.5, 0.2, 0,
           [0.0018, 0.0028, 0.001],  0.30, 0.65);

    addObj(new THREE.IcosahedronGeometry(2.0, 1),              4.2, -0.8, -3.0, 0.1, 0.0, 0.3,
           [0.001,  0.0022, 0.0012], 0.22, 1.00);

    addObj(new THREE.OctahedronGeometry(1.5, 0),               0.2,  3.2, -4.5, 0.0, 0.5, 0.0,
           [0.003,  0.001,  0.002],  0.38, 0.50);

    addObj(new THREE.TorusGeometry(1.3, 0.28, 16, 100),        5.5,  2.2, -3.0, 0.785, 0, 0,
           [0.001,  0.003,  0.0],    0.24, 0.80);

    addObj(new THREE.TetrahedronGeometry(1.6, 0),             -5.5, -2.0, -2.0, 0.3, 0.7, 0.0,
           [0.002,  0.001,  0.003],  0.20, 1.20);

    addObj(new THREE.DodecahedronGeometry(1.3, 0),             2.0, -3.5, -3.5, 0.1, 0.2, 0.1,
           [0.0015, 0.002,  0.001],  0.26, 0.90);
  } else {
    /* Simpler scene on mobile */
    addObj(new THREE.IcosahedronGeometry(1.8, 1),              0,    1.0, -3.0, 0.1, 0.0, 0.0,
           [0.001, 0.002, 0],        0.25, 0.80);
    addObj(new THREE.TorusKnotGeometry(1.2, 0.32, 64, 8),     -3.0, -1.5, -3.5, 0.5, 0.2, 0,
           [0.002, 0.003, 0.001],    0.20, 0.60);
  }

  /* ── Clock ──────────────────────────────────────────────── */
  const clock = new THREE.Clock();

  /* ── Render loop ────────────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    /* Lerp camera to follow mouse */
    camTgt.x += (mouse.x * 0.45 - camTgt.x) * 0.022;
    camTgt.y += (mouse.y * 0.28 - camTgt.y) * 0.022;
    camera.position.x = camTgt.x;
    camera.position.y = camTgt.y;
    camera.lookAt(scene.position);

    /* Animate wireframe objects */
    objs.forEach(o => {
      o.mesh.rotation.x += o.rotSpeeds[0];
      o.mesh.rotation.y += o.rotSpeeds[1];
      o.mesh.rotation.z += o.rotSpeeds[2];
      o.mesh.position.y = o.baseY + Math.sin(t * o.floatSpeed + o.phase) * o.floatAmp;
    });

    /* Drift particles */
    particles.rotation.x += 0.00007;
    particles.rotation.y += 0.00011;

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ─────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = innerW() / innerH();
    camera.updateProjectionMatrix();
    renderer.setSize(innerW(), innerH());
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  });
}

/* ─── Helpers ────────────────────────────────────────────── */
function innerW() { return window.innerWidth; }
function innerH() { return window.innerHeight; }
