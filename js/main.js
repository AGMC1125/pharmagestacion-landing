/* =========================================================
   DESDE EL PRIMER LATIDO — Shared JavaScript v3.0
   Universidad Pablo Guardado Chávez · QFB · 2026
   GSAP ScrollTrigger | Cinematic Scroll | Aurora UI
   ========================================================= */

(function () {
  'use strict';

  const PAGES = [
    { href: 'index.html',         label: 'Inicio' },
    { href: 'introduccion.html',  label: 'Introducción' },
    { href: 'desarrollo.html',    label: 'Desarrollo' },
    { href: 'bebe.html',          label: 'El Bebé' },
    { href: 'medicamentos.html',  label: 'Medicamentos' },
    { href: 'plantas.html',       label: 'Plantas Medicinales' },
    { href: 'factores.html',      label: 'Factores y Tecnología' },
    { href: 'conclusiones.html',  label: 'Conclusiones' },
    { href: 'equipo.html',        label: 'Equipo' },
    { href: 'referencias.html',   label: 'Referencias' },
  ];

  const CURRENT = location.pathname.split('/').pop() || 'index.html';

  /* ─────────────────────────────────────────────────────────
     NAVIGATION
  ───────────────────────────────────────────────────────── */
  function buildNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    // Split pages into main links and dropdown links
    const mainPages = PAGES.slice(0, 5);
    const dropdownPages = PAGES.slice(5);

    // Desktop nav building
    const mainLinksHTML = mainPages.map(p => {
      const active = CURRENT === p.href ? ' active' : '';
      return `<a href="${p.href}" class="nav-link${active}">${p.label}</a>`;
    }).join('');

    const isDropdownActive = dropdownPages.some(p => CURRENT === p.href);
    const dropdownActive = isDropdownActive ? ' active' : '';

    const dropdownHTML = dropdownPages.map(p => {
      const activeStyle = CURRENT === p.href ? ' style="color: var(--clr-accent) !important; background: rgba(163, 21, 69, 0.15);"' : '';
      return `<a href="${p.href}" class="nav-dropdown-item"${activeStyle}>${p.label}</a>`;
    }).join('');

    const desktopHTML = `
      ${mainLinksHTML}
      <!-- "Más..." Dropdown -->
      <div class="nav-dropdown">
        <a class="nav-link nav-dropdown-toggle${dropdownActive}">Más <span style="font-size:0.6rem;">▼</span></a>
        <div class="nav-dropdown-menu">
          ${dropdownHTML}
        </div>
      </div>
    `;

    nav.innerHTML = desktopHTML;

    // Mobile nav building (render all 10 links sequentially as requested)
    const mob = document.getElementById('mobile-nav');
    if (mob) {
      mob.innerHTML = PAGES.map(p => {
        const active = CURRENT === p.href ? ' active' : '';
        return `<a href="${p.href}" class="nav-link${active}">${p.label}</a>`;
      }).join('');
    }
  }

  function initNavScroll() {
    const header = document.querySelector('.site-nav');
    if (!header) return;
    let lastY = 0;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 60);
      header.classList.toggle('hide', y > lastY + 10 && y > 200);
      header.classList.toggle('show', y < lastY - 10);
      lastY = y;
    }, { passive: true });
  }

  function initHamburger() {
    const toggle = document.getElementById('nav-toggle');
    const mob    = document.getElementById('mobile-nav-wrap');
    if (!toggle || !mob) return;

    function setMobileState(isOpen) {
      toggle.classList.toggle('open', isOpen);
      mob.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      mob.setAttribute('aria-hidden', String(!isOpen));
    }

    toggle.addEventListener('click', () => {
      setMobileState(!toggle.classList.contains('open'));
    });

    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setMobileState(false));
    });
  }

  /* ─────────────────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width  = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────────────────────
     GSAP ANIMATIONS
  ───────────────────────────────────────────────────────── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      initRevealFallback();
      initStaggerFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('gsap-ready');

    /* Helper: mark element as pre-reveal (hidden), then animate in */
    function revealIn(el, fromVars, toVars, stConfig) {
      el.classList.add('pre-reveal');
      gsap.fromTo(el, fromVars,
        Object.assign({}, toVars, {
          scrollTrigger: Object.assign({ trigger: el, start: 'top 88%', once: true }, stConfig),
          onComplete: () => { el.classList.remove('pre-reveal'); el.classList.add('animated'); }
        })
      );
    }

    /* ── Hero entrance (page load) ─────────────────────── */
    const heroTitle   = document.querySelector('.hero-title');
    const heroEyebrow = document.querySelector('.hero-eyebrow');
    const heroSubs    = document.querySelectorAll('.hero-subtitle');
    const heroCta     = document.querySelector('.hero-cta');
    const heroVisual  = document.querySelector('.hero-visual, .hero-fetus');
    const heroBadge   = document.querySelector('.hero-badge');

    if (heroTitle) {
      const heroTl = gsap.timeline({ delay: 0.15 });
      if (heroEyebrow) heroTl.fromTo(heroEyebrow,
        { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
      heroTl.fromTo(heroTitle,
        { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.3');
      heroSubs.forEach(el => heroTl.fromTo(el,
        { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5'));
      if (heroCta) heroTl.fromTo(heroCta,
        { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
      if (heroBadge) heroTl.fromTo(heroBadge,
        { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3');
      if (heroVisual) heroTl.fromTo(heroVisual,
        { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.7');
    }

    /* ── Hero parallax on scroll ───────────────────────── */
    /* Disabled container-level parallax to prevent white gap underneath on scroll.
       The floating orbs still parallax independently for a premium depth effect. */


    /* ── Section tags pop in ───────────────────────────── */
    gsap.utils.toArray('.section-tag').forEach(el => {
      gsap.fromTo(el,
        { scale: 0.75, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
      );
    });

    /* ── Section headings ──────────────────────────────── */
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.fromTo(el,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });
    gsap.utils.toArray('.section-subtitle').forEach(el => {
      gsap.fromTo(el,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });

    /* ── .reveal elements ──────────────────────────────── */
    gsap.utils.toArray('.reveal').forEach(el => {
      revealIn(el,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        { start: 'top 87%' }
      );
    });

    /* ── Stagger grids (.stagger-parent) ───────────────── */
    gsap.utils.toArray('.stagger-parent').forEach(parent => {
      const children = Array.from(parent.querySelectorAll('.stagger-child'));
      if (!children.length) return;
      children.forEach(c => c.classList.add('pre-reveal'));
      gsap.fromTo(children,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.09,
          scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
          onComplete: () => children.forEach(c => { c.classList.remove('pre-reveal'); c.classList.add('animated'); })
        }
      );
    });

    /* ── Cards hover tilt (3D) ──────────────────────────── */
    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.card, .qa-card, .flip-card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
          const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
          gsap.to(card, { rotationY: x, rotationX: y, transformPerspective: 900, duration: 0.3, ease: 'power1.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    /* ── Stat cards entrance ────────────────────────────── */
    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 55, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, delay: i * 0.08, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true } }
      );
    });

    /* ── Impact items slide in ──────────────────────────── */
    gsap.utils.toArray('.impact-item').forEach((el, i) => {
      gsap.fromTo(el,
        { x: i % 2 === 0 ? -55 : 55, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
      );
    });

    /* ── Quick-access cards (qa-grid) ───────────────────── */
    const qaCards = document.querySelectorAll('.qa-card');
    if (qaCards.length) {
      gsap.fromTo(qaCards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: '.qa-grid', start: 'top 87%', once: true } }
      );
    }

    /* ── Timeline items alternate slide ────────────────── */
    gsap.utils.toArray('.timeline-item').forEach((el, i) => {
      gsap.fromTo(el,
        { x: i % 2 === 0 ? -45 : 45, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });

    /* ── Table rows ─────────────────────────────────────── */
    gsap.utils.toArray('tbody tr').forEach((el, i) => {
      gsap.fromTo(el,
        { x: -18, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, delay: Math.min(i * 0.03, 0.5), ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 93%', once: true } }
      );
    });

    /* ── Orb parallax ──────────────────────────────────── */
    gsap.utils.toArray('.orb, .glow-orb').forEach((orb, i) => {
      gsap.to(orb, {
        yPercent: i % 2 === 0 ? -22 : 22,
        xPercent: i % 2 === 0 ? 8 : -8,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 + i * 0.3 }
      });
    });

    ScrollTrigger.refresh();
  }

  /* ─────────────────────────────────────────────────────────
     FALLBACK (no GSAP — simple IO reveals)
  ───────────────────────────────────────────────────────── */
  function initRevealFallback() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    /* Mark hidden before IO fires */
    els.forEach(el => el.classList.add('pre-reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('pre-reveal');
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  function initStaggerFallback() {
    document.querySelectorAll('.stagger-parent').forEach(parent => {
      const children = parent.querySelectorAll('.stagger-child');
      children.forEach(c => c.classList.add('pre-reveal'));
      const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.remove('pre-reveal');
            child.classList.add('visible');
          }, i * 100);
        });
        io.unobserve(parent);
      }, { threshold: 0.08 });
      io.observe(parent);
    });
  }

  /* ─────────────────────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el       = e.target;
        const target   = parseFloat(el.dataset.count);
        const suffix   = el.dataset.suffix || '';
        const prefix   = el.dataset.prefix || '';
        const duration = 2200;
        const decimals = String(target).includes('.') ? 1 : 0;
        let start = null;

        function step(ts) {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 4); // easeOutQuart
          const value    = target * ease;
          el.textContent = prefix + value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });

    counters.forEach(c => io.observe(c));
  }

  /* ─────────────────────────────────────────────────────────
     BACK TO TOP
  ───────────────────────────────────────────────────────── */
  function initBackTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─────────────────────────────────────────────────────────
     ACCORDION
  ───────────────────────────────────────────────────────── */
  function initAccordions() {
    document.querySelectorAll('.accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const isOpen  = btn.classList.contains('open');

        const group = btn.closest('.accordion');
        if (group) {
          group.querySelectorAll('.accordion-btn').forEach(b => {
            b.classList.remove('open');
            if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
          });
        }

        if (!isOpen) {
          btn.classList.add('open');
          content.classList.add('open');
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     FLIP CARDS
  ───────────────────────────────────────────────────────── */
  function initFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  }

  /* ─────────────────────────────────────────────────────────
     TRIMESTER TABS
  ───────────────────────────────────────────────────────── */
  function initTrimesterTabs() {
    document.querySelectorAll('.trim-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        const parent = tab.closest('.trimester-section');

        parent.querySelectorAll('.trim-tab').forEach(t => t.classList.remove('active'));
        parent.querySelectorAll('.trim-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panel = parent.querySelector(`#${target}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     HERO FETUS SVG
  ───────────────────────────────────────────────────────── */
  function initFetusSVG() {
    return;
    const canvas = document.getElementById('fetus-canvas');
    if (!canvas) return;

    const svg = `
<svg viewBox="0 0 460 520" xmlns="http://www.w3.org/2000/svg" width="460" height="520" role="img" aria-label="Ilustración holográfica de feto en gestación">
  <defs>
    <!-- ── Filters ── -->
    <filter id="holo-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0.4 0 0  0 0 0.8 0 0  0.6 0 1 0 0  0 0 0 1.2 0" result="tinted"/>
      <feMerge><feMergeNode in="tinted"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft-depth" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6"/>
    </filter>
    <filter id="inner-glow" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="sharp-glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- ── Gradients: Womb / Amniotic sac ── -->
    <radialGradient id="wombOuter" cx="50%" cy="45%" r="50%">
      <stop offset="0%"   stop-color="#3D0A5C" stop-opacity="0.0"/>
      <stop offset="55%"  stop-color="#6B3FA0" stop-opacity="0.08"/>
      <stop offset="85%"  stop-color="#A31545" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#7B0E33" stop-opacity="0.35"/>
    </radialGradient>
    <radialGradient id="wombInner" cx="48%" cy="42%" r="50%">
      <stop offset="0%"   stop-color="#1A0530" stop-opacity="0.6"/>
      <stop offset="60%"  stop-color="#2D0B5A" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#4A1080" stop-opacity="0.1"/>
    </radialGradient>

    <!-- ── Fetus skin — multi-stop 3D depth ── -->
    <radialGradient id="skinLight" cx="38%" cy="28%" r="58%">
      <stop offset="0%"   stop-color="#FFE8F2"/>
      <stop offset="25%"  stop-color="#F9C8DE"/>
      <stop offset="55%"  stop-color="#E8A0C0"/>
      <stop offset="80%"  stop-color="#C4688E"/>
      <stop offset="100%" stop-color="#8B3060"/>
    </radialGradient>
    <radialGradient id="skinHead" cx="40%" cy="30%" r="60%">
      <stop offset="0%"   stop-color="#FFE4EF"/>
      <stop offset="30%"  stop-color="#FBCCE0"/>
      <stop offset="60%"  stop-color="#E99ABB"/>
      <stop offset="100%" stop-color="#9B4070"/>
    </radialGradient>
    <radialGradient id="skinLimb" cx="35%" cy="25%" r="65%">
      <stop offset="0%"   stop-color="#FFCCE5"/>
      <stop offset="50%"  stop-color="#E88CB5"/>
      <stop offset="100%" stop-color="#A33D6A"/>
    </radialGradient>
    <radialGradient id="heartGrad" cx="50%" cy="40%" r="50%">
      <stop offset="0%"   stop-color="#FF8FC5"/>
      <stop offset="100%" stop-color="#A31545"/>
    </radialGradient>

    <!-- ── Specular highlight (3D illusion) ── -->
    <radialGradient id="specular" cx="35%" cy="28%" r="35%">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="60%"  stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <radialGradient id="specHead" cx="38%" cy="26%" r="32%">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.6)"/>
      <stop offset="70%"  stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>

    <!-- ── Holo scan lines gradient ── -->
    <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(107,63,160,0)" />
      <stop offset="45%"  stop-color="rgba(163,21,69,0.55)"/>
      <stop offset="55%"  stop-color="rgba(163,21,69,0.55)"/>
      <stop offset="100%" stop-color="rgba(107,63,160,0)"/>
    </linearGradient>

    <!-- ── Aurora glow ring gradient ── -->
    <radialGradient id="ringGrad1" cx="50%" cy="50%" r="50%">
      <stop offset="70%"  stop-color="rgba(163,21,69,0)"/>
      <stop offset="88%"  stop-color="rgba(163,21,69,0.55)"/>
      <stop offset="100%" stop-color="rgba(163,21,69,0)"/>
    </radialGradient>
    <radialGradient id="ringGrad2" cx="50%" cy="50%" r="50%">
      <stop offset="70%"  stop-color="rgba(107,63,160,0)"/>
      <stop offset="88%"  stop-color="rgba(107,63,160,0.45)"/>
      <stop offset="100%" stop-color="rgba(107,63,160,0)"/>
    </radialGradient>
    <radialGradient id="ringGrad3" cx="50%" cy="50%" r="50%">
      <stop offset="70%"  stop-color="rgba(240,98,146,0)"/>
      <stop offset="90%"  stop-color="rgba(240,98,146,0.3)"/>
      <stop offset="100%" stop-color="rgba(240,98,146,0)"/>
    </radialGradient>

    <!-- ── Clip path for scan line ── -->
    <clipPath id="wombClip">
      <ellipse cx="230" cy="260" rx="158" ry="185"/>
    </clipPath>
  </defs>

  <!-- ═══════════════════════════════════════════
       AMBIENT GLOW ORBS (background depth)
  ═══════════════════════════════════════════ -->
  <ellipse cx="230" cy="260" rx="220" ry="230" fill="rgba(74,20,140,0.12)" filter="url(#soft-depth)"/>
  <ellipse cx="200" cy="220" rx="160" ry="140" fill="rgba(163,21,69,0.1)"  filter="url(#soft-depth)"/>

  <!-- ═══════════════════════════════════════════
       PULSING SCAN RINGS (aurora)
  ═══════════════════════════════════════════ -->
  <!-- Ring 3 — outer -->
  <ellipse cx="230" cy="260" rx="205" ry="215" fill="url(#ringGrad3)" opacity="0.6">
    <animate attributeName="rx" values="200;212;200" dur="5s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="210;222;210" dur="5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.4;0.75;0.4" dur="5s" repeatCount="indefinite"/>
  </ellipse>
  <!-- Ring 2 -->
  <ellipse cx="230" cy="260" rx="185" ry="195" fill="url(#ringGrad2)" opacity="0.7">
    <animate attributeName="rx" values="180;192;180" dur="3.8s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="190;202;190" dur="3.8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.8s" repeatCount="indefinite"/>
  </ellipse>
  <!-- Ring 1 — inner -->
  <ellipse cx="230" cy="260" rx="165" ry="175" fill="url(#ringGrad1)" opacity="0.8">
    <animate attributeName="rx" values="162;172;162" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="172;182;172" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
  </ellipse>

  <!-- ═══════════════════════════════════════════
       AMNIOTIC SAC — volumetric glass sphere
  ═══════════════════════════════════════════ -->
  <!-- Outer volume shadow -->
  <ellipse cx="232" cy="268" rx="155" ry="182" fill="url(#wombInner)"/>
  <!-- Main sac body -->
  <ellipse cx="230" cy="260" rx="153" ry="180" fill="url(#wombOuter)">
    <animate attributeName="rx" values="151;156;151" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="178;184;178" dur="2.2s" repeatCount="indefinite"/>
  </ellipse>
  <!-- Sac border — dashed holo ring -->
  <ellipse cx="230" cy="260" rx="153" ry="180"
    fill="none"
    stroke="rgba(163,21,69,0.45)" stroke-width="1.5"
    stroke-dasharray="8 5">
    <animate attributeName="stroke-dashoffset" from="0" to="150" dur="10s" repeatCount="indefinite"/>
    <animate attributeName="rx" values="151;156;151" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="178;184;178" dur="2.2s" repeatCount="indefinite"/>
  </ellipse>
  <!-- Inner secondary ring -->
  <ellipse cx="230" cy="260" rx="140" ry="166"
    fill="none"
    stroke="rgba(107,63,160,0.3)" stroke-width="1"
    stroke-dasharray="4 8">
    <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="8s" repeatCount="indefinite"/>
  </ellipse>
  <!-- Glass specular on sac -->
  <ellipse cx="185" cy="175" rx="60" ry="45" fill="rgba(255,255,255,0.06)" filter="url(#soft-depth)"/>

  <!-- ═══════════════════════════════════════════
       FETAL BODY — curled position with 3D depth
  ═══════════════════════════════════════════ -->

  <!-- Shadow layer (depth) -->
  <ellipse cx="233" cy="278" rx="52" ry="65" fill="rgba(60,0,30,0.35)" filter="url(#soft-depth)"/>

  <!-- TORSO -->
  <ellipse cx="228" cy="268" rx="50" ry="64" fill="url(#skinLight)"/>
  <!-- Torso specular -->
  <ellipse cx="218" cy="245" rx="22" ry="18" fill="url(#specular)"/>

  <!-- Neck connection shadow -->
  <ellipse cx="234" cy="222" rx="15" ry="10" fill="rgba(130,40,70,0.4)" filter="url(#soft-depth)"/>

  <!-- HEAD — larger, with proper 3D shading -->
  <ellipse cx="236" cy="178" rx="54" ry="60" fill="url(#skinHead)"/>
  <!-- Head specular highlight -->
  <ellipse cx="218" cy="155" rx="24" ry="20" fill="url(#specHead)"/>
  <!-- Head rim light (back-light for 3D) -->
  <ellipse cx="270" cy="185" rx="18" ry="22" fill="rgba(240,98,146,0.18)" filter="url(#soft-depth)"/>

  <!-- Ear -->
  <ellipse cx="286" cy="182" rx="11" ry="15" fill="url(#skinLimb)" opacity="0.85"/>
  <ellipse cx="287" cy="182" rx="7" ry="11" fill="rgba(180,80,110,0.4)"/>

  <!-- ── FACE FEATURES — subtle, realistic ── -->
  <!-- Eye sockets (closed, in-utero) -->
  <ellipse cx="218" cy="173" rx="10" ry="7" fill="rgba(140,50,80,0.25)"/>
  <ellipse cx="248" cy="173" rx="10" ry="7" fill="rgba(140,50,80,0.25)"/>
  <!-- Eyelids (closed) -->
  <path d="M 210 172 Q 218 167 226 172" stroke="rgba(160,60,90,0.8)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 240 172 Q 248 167 256 172" stroke="rgba(160,60,90,0.8)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Subtle lashes -->
  <path d="M 211 170 Q 213 166 215 170" stroke="rgba(100,30,50,0.5)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M 241 170 Q 243 166 245 170" stroke="rgba(100,30,50,0.5)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <!-- Nose — subtle bridge + nostrils -->
  <path d="M 232 178 Q 230 185 226 190 M 232 178 Q 234 185 238 190" stroke="rgba(160,70,100,0.45)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="226" cy="191" rx="3.5" ry="2.5" fill="rgba(160,70,100,0.3)"/>
  <ellipse cx="238" cy="191" rx="3.5" ry="2.5" fill="rgba(160,70,100,0.3)"/>
  <!-- Lip crease — slight smile -->
  <path d="M 222 200 Q 232 208 242 200" stroke="rgba(180,80,110,0.6)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Philtrum -->
  <path d="M 229 193 L 229 199" stroke="rgba(160,70,100,0.3)" stroke-width="1.2" fill="none"/>
  <!-- Cheek flush -->
  <ellipse cx="212" cy="196" rx="11" ry="8" fill="rgba(240,130,160,0.2)"/>
  <ellipse cx="252" cy="196" rx="11" ry="8" fill="rgba(240,130,160,0.2)"/>

  <!-- NECK -->
  <path d="M 222 230 Q 232 222 242 230" stroke="url(#skinLight)" stroke-width="20" fill="none" stroke-linecap="round"/>

  <!-- ── ARMS — curled position ── -->
  <!-- Left arm shadow -->
  <path d="M 183 258 Q 160 275 166 302 Q 170 322 186 320"
    stroke="rgba(100,30,55,0.3)" stroke-width="22" fill="none" stroke-linecap="round" filter="url(#soft-depth)"/>
  <!-- Left arm -->
  <path d="M 183 255 Q 160 272 165 299 Q 169 319 185 318"
    stroke="url(#skinLimb)" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Left hand -->
  <circle cx="185" cy="318" r="14" fill="url(#skinLight)"/>
  <ellipse cx="175" cy="318" rx="7" ry="6" fill="url(#specular)"/>
  <!-- Fingers -->
  <path d="M 175 309 Q 168 301 172 296" stroke="url(#skinLimb)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 182 305 Q 176 296 181 291" stroke="url(#skinLimb)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 189 307 Q 186 298 192 294" stroke="url(#skinLimb)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 195 312 Q 194 303 200 301" stroke="url(#skinLimb)" stroke-width="4" fill="none" stroke-linecap="round"/>

  <!-- Right arm shadow -->
  <path d="M 270 256 Q 292 268 290 292 Q 288 312 272 318"
    stroke="rgba(100,30,55,0.3)" stroke-width="20" fill="none" stroke-linecap="round" filter="url(#soft-depth)"/>
  <!-- Right arm (thumb-sucking pose) -->
  <path d="M 268 253 Q 290 265 288 289 Q 286 309 270 315"
    stroke="url(#skinLimb)" stroke-width="18" fill="none" stroke-linecap="round"/>
  <!-- Right hand near mouth -->
  <circle cx="270" cy="315" r="12" fill="url(#skinLight)"/>
  <ellipse cx="262" cy="312" rx="6" ry="5" fill="url(#specular)"/>

  <!-- ── LEGS — curled up ── -->
  <!-- Left leg shadow -->
  <path d="M 195 330 Q 170 365 174 400 Q 177 418 196 425"
    stroke="rgba(100,30,55,0.35)" stroke-width="28" fill="none" stroke-linecap="round" filter="url(#soft-depth)"/>
  <!-- Left leg -->
  <path d="M 193 328 Q 168 362 172 397 Q 175 415 194 422"
    stroke="url(#skinLimb)" stroke-width="26" fill="none" stroke-linecap="round"/>
  <!-- Left foot -->
  <ellipse cx="202" cy="423" rx="22" ry="14" fill="url(#skinLight)"/>
  <ellipse cx="193" cy="419" rx="10" ry="8" fill="url(#specular)"/>
  <!-- Toes -->
  <circle cx="186" cy="418" r="5" fill="url(#skinLimb)"/>
  <circle cx="195" cy="413" r="5" fill="url(#skinLimb)"/>
  <circle cx="204" cy="411" r="5" fill="url(#skinLimb)"/>
  <circle cx="213" cy="415" r="4.5" fill="url(#skinLimb)"/>
  <circle cx="220" cy="420" r="4" fill="url(#skinLimb)"/>

  <!-- Right leg shadow -->
  <path d="M 258 328 Q 280 362 274 396 Q 270 414 254 420"
    stroke="rgba(100,30,55,0.35)" stroke-width="25" fill="none" stroke-linecap="round" filter="url(#soft-depth)"/>
  <!-- Right leg -->
  <path d="M 256 326 Q 278 360 272 394 Q 268 412 252 418"
    stroke="url(#skinLimb)" stroke-width="23" fill="none" stroke-linecap="round"/>
  <!-- Right foot -->
  <ellipse cx="244" cy="419" rx="20" ry="13" fill="url(#skinLight)"/>
  <ellipse cx="236" cy="416" rx="9" ry="7" fill="url(#specular)"/>
  <!-- Toes -->
  <circle cx="232" cy="418" r="4.5" fill="url(#skinLimb)"/>
  <circle cx="239" cy="413" r="4.5" fill="url(#skinLimb)"/>
  <circle cx="247" cy="411" r="4.5" fill="url(#skinLimb)"/>
  <circle cx="255" cy="414" r="4" fill="url(#skinLimb)"/>
  <circle cx="262" cy="419" r="3.5" fill="url(#skinLimb)"/>

  <!-- ── UMBILICAL CORD — organic curve ── -->
  <path d="M 230 252 Q 275 262 295 295 Q 308 322 285 346 Q 268 364 252 355"
    stroke="rgba(220,110,155,0.55)" stroke-width="6" fill="none"
    stroke-linecap="round" stroke-dasharray="10 5">
    <animate attributeName="stroke-dashoffset" from="0" to="-60" dur="4s" repeatCount="indefinite"/>
  </path>

  <!-- ── HEART (beating, with glow) ── -->
  <g transform="translate(213,258)" filter="url(#holo-glow)">
    <path d="M 15,7 C 15,3 12,0 8.5,0 C 5,0 2,3 2,6.5 C 2,3 -1,0 -4.5,0 C -8,0 -11,3 -11,7 C -11,11 -5,17 2,23 C 5.5,26 8.5,28 15,22 C 18.5,19 22,13 22,7 C 22,3 19,0 15.5,0 C 12,0 9,3 9,7"
      fill="url(#heartGrad)">
      <animateTransform attributeName="transform" type="scale"
        values="1;1.22;1;1.18;1" dur="1s" repeatCount="indefinite" additive="replace"
        calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"/>
    </path>
  </g>
  <!-- Heart pulse ring -->
  <circle cx="228" cy="268" r="18" fill="none" stroke="rgba(240,98,146,0.5)" stroke-width="1.5">
    <animate attributeName="r" values="16;28;16" dur="1s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.7;0;0.7" dur="1s" repeatCount="indefinite"/>
  </circle>

  <!-- ═══════════════════════════════════════════
       HOLOGRAPHIC SCAN EFFECT
  ═══════════════════════════════════════════ -->
  <rect x="75" y="0" width="310" height="40" fill="url(#scanGrad)" opacity="0.6" clip-path="url(#wombClip)">
    <animateTransform attributeName="transform" type="translate" values="0,80;0,420;0,80" dur="4s" repeatCount="indefinite" calcMode="linear"/>
  </rect>
  <!-- Scan line hairline -->
  <line x1="75" y1="20" x2="385" y2="20" stroke="rgba(163,21,69,0.7)" stroke-width="1" clip-path="url(#wombClip)">
    <animateTransform attributeName="transform" type="translate" values="0,80;0,420;0,80" dur="4s" repeatCount="indefinite"/>
  </line>

  <!-- ═══════════════════════════════════════════
       FLOATING MOLECULE PARTICLES
  ═══════════════════════════════════════════ -->
  <g filter="url(#sharp-glow)">
    <!-- mol 1 -->
    <circle cx="108" cy="180" r="4" fill="rgba(163,21,69,0.85)">
      <animate attributeName="cy" values="180;164;180" dur="3.1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.85;0.4;0.85" dur="3.1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="108" cy="180" r="7" fill="none" stroke="rgba(163,21,69,0.35)" stroke-width="1">
      <animate attributeName="cy" values="180;164;180" dur="3.1s" repeatCount="indefinite"/>
      <animate attributeName="r" values="7;11;7" dur="3.1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.35;0;0.35" dur="3.1s" repeatCount="indefinite"/>
    </circle>
    <!-- mol 2 -->
    <circle cx="352" cy="200" r="3.5" fill="rgba(107,63,160,0.9)">
      <animate attributeName="cy" values="200;216;200" dur="2.7s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.9;0.35;0.9" dur="2.7s" repeatCount="indefinite"/>
    </circle>
    <!-- mol 3 -->
    <circle cx="125" cy="360" r="3" fill="rgba(240,98,146,0.8)">
      <animate attributeName="cy" values="360;342;360" dur="3.8s" repeatCount="indefinite"/>
    </circle>
    <!-- mol 4 -->
    <circle cx="345" cy="340" r="4" fill="rgba(163,21,69,0.7)">
      <animate attributeName="cy" values="340;358;340" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <!-- mol 5 -->
    <circle cx="140" cy="110" r="2.5" fill="rgba(200,100,160,0.75)">
      <animate attributeName="cy" values="110;98;110" dur="4.2s" repeatCount="indefinite"/>
    </circle>
    <!-- mol 6 -->
    <circle cx="335" cy="130" r="3" fill="rgba(107,63,160,0.7)">
      <animate attributeName="cy" values="130;118;130" dur="3.5s" repeatCount="indefinite"/>
    </circle>
    <!-- bond lines -->
    <line x1="108" y1="180" x2="125" y2="360" stroke="rgba(163,21,69,0.12)" stroke-width="1">
      <animate attributeName="opacity" values="0.12;0.25;0.12" dur="4s" repeatCount="indefinite"/>
    </line>
    <line x1="352" y1="200" x2="345" y2="340" stroke="rgba(107,63,160,0.12)" stroke-width="1">
      <animate attributeName="opacity" values="0.12;0.22;0.12" dur="3s" repeatCount="indefinite"/>
    </line>
  </g>

  <!-- ═══════════════════════════════════════════
       ECG HEARTBEAT LINE (bottom)
  ═══════════════════════════════════════════ -->
  <g transform="translate(42, 490)" opacity="0.85">
    <line x1="0" y1="0" x2="376" y2="0" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <polyline
      points="0,0 38,0 52,-22 64,28 78,-36 94,32 110,-6 128,0 172,0 188,-18 200,22 214,-30 230,28 246,-5 262,0 376,0"
      fill="none" stroke="rgba(240,98,146,0.9)" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round"
      filter="url(#sharp-glow)">
      <animate attributeName="stroke-dashoffset" from="600" to="-600" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="stroke-dasharray" values="600 600" dur="3s" repeatCount="indefinite"/>
    </polyline>
    <!-- Running ECG dot -->
    <circle r="5" fill="#F06292" filter="url(#sharp-glow)">
      <animateMotion dur="3s" repeatCount="indefinite"
        path="M0,0 L38,0 L52,-22 L64,28 L78,-36 L94,32 L110,-6 L128,0 L172,0 L188,-18 L200,22 L214,-30 L230,28 L246,-5 L262,0 L376,0"/>
    </circle>
  </g>

  <!-- ═══════════════════════════════════════════
       DATA READOUT (holo HUD labels)
  ═══════════════════════════════════════════ -->
  <g opacity="0.5" font-family="Inter, monospace" font-size="9" fill="rgba(240,98,146,0.85)" letter-spacing="0.08em">
    <!-- Left labels -->
    <text x="52" y="175">FC: 140 bpm</text>
    <line x1="80" y1="173" x2="106" y2="178" stroke="rgba(240,98,146,0.4)" stroke-width="0.8"/>
    <text x="52" y="285">SEM: 28</text>
    <line x1="76" y1="283" x2="100" y2="290" stroke="rgba(240,98,146,0.4)" stroke-width="0.8"/>
    <!-- Right labels -->
    <text x="318" y="195" text-anchor="start">PLACENTA</text>
    <line x1="317" y1="193" x2="292" y2="202" stroke="rgba(240,98,146,0.4)" stroke-width="0.8"/>
    <text x="318" y="310" text-anchor="start">CORD</text>
    <line x1="317" y1="308" x2="294" y2="315" stroke="rgba(240,98,146,0.4)" stroke-width="0.8"/>
  </g>

  <!-- ── Click hint ── -->
  <g id="click-hint">
    <text x="230" y="476" text-anchor="middle" fill="rgba(255,255,255,0.35)"
      font-family="Inter, sans-serif" font-size="11" letter-spacing="0.1em">
      ▶ HAZ CLIC PARA EXPLORAR
    </text>
  </g>
</svg>`;

    canvas.innerHTML = svg;

    /* Click interaction — delegated to index.html inline script */
    canvas.style.cursor = 'pointer';
  }

  /* ─────────────────────────────────────────────────────────
     SMOOTH PAGE TRANSITIONS
  ───────────────────────────────────────────────────────── */
  function initPageLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

      link.addEventListener('click', e => {
        e.preventDefault();
        const target = href;

        if (typeof gsap !== 'undefined') {
          gsap.to(document.body, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => { window.location = target; }
          });
        } else {
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.25s ease';
          setTimeout(() => { window.location = target; }, 260);
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     TOOLTIPS
  ───────────────────────────────────────────────────────── */
  function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      const tip = document.createElement('div');
      tip.className = 'tooltip';
      tip.textContent = el.dataset.tooltip;
      tip.style.cssText = `
        position:absolute;background:#1C1B29;color:white;padding:0.4rem 0.75rem;
        border-radius:8px;font-size:0.75rem;pointer-events:none;
        z-index:9999;opacity:0;transition:opacity 0.2s ease;max-width:220px;
        white-space:normal;border:1px solid rgba(255,255,255,0.1);
        box-shadow:0 8px 24px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(tip);

      el.addEventListener('mouseenter', () => {
        const r = el.getBoundingClientRect();
        tip.style.top  = (window.scrollY + r.bottom + 6) + 'px';
        tip.style.left = (window.scrollX + r.left) + 'px';
        tip.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    });
  }

  /* ─────────────────────────────────────────────────────────
     CURSOR GLOW (desktop only)
  ───────────────────────────────────────────────────────── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle, rgba(163,21,69,0.08) 0%, transparent 70%);
      transform:translate(-50%,-50%);z-index:0;transition:opacity 0.3s ease;
      mix-blend-mode:screen;
    `;
    document.body.appendChild(glow);

    let curX = 0, curY = 0, glowX = 0, glowY = 0;

    window.addEventListener('mousemove', e => {
      curX = e.clientX;
      curY = e.clientY;
    }, { passive: true });

    (function animate() {
      glowX += (curX - glowX) * 0.08;
      glowY += (curY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top  = glowY + 'px';
      requestAnimationFrame(animate);
    })();

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

  /* ─────────────────────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    /* Page fade-in */
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.4s ease';
      document.body.style.opacity    = '1';
    });

    buildNav();
    initNavScroll();
    initHamburger();
    initScrollProgress();
    initCounters();
    initBackTop();
    initAccordions();
    initFlipCards();
    initTrimesterTabs();
    initFetusSVG();
    initPageLinks();
    initTooltips();
    initCursorGlow();

    /* GSAP needs scripts to fully load — wait for load event */
    if (typeof gsap !== 'undefined') {
      initGSAP();
    } else {
      window.addEventListener('load', () => {
        if (typeof gsap !== 'undefined') {
          initGSAP();
        } else {
          initRevealFallback();
          initStaggerFallback();
        }
      });
    }

    /* Init Lucide icons after dynamic nav is built */
    if (window.lucide) lucide.createIcons();
  });

  /* ─────────────────────────────────────────────────────────
     BFCACHE FIX — When the browser restores this page from its
     Back/Forward cache, GSAP elements are frozen at opacity:0.
     The fix: force a full reload so animations replay correctly.
     This is the standard approach used by GitHub, YouTube, etc.
  ───────────────────────────────────────────────────────── */
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  /* Re-init Lucide after load (covers deferred icons) */
  window.addEventListener('load', () => {
    if (window.lucide) lucide.createIcons();
  });

})();
