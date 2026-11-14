/* Pruneyard Cabinets — interactions & scroll animations (v2)
   Works without GSAP/Lenis (falls back to IntersectionObserver). */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger) && !reduce;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  /* ---------- Header: solid on scroll, hide on scroll down, progress ---------- */
  var header = $('.site-header');
  var light = document.body.classList.contains('page--light');
  var bar = $('.nav__progress i');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) {
      if (!light) header.classList.toggle('is-solid', y > 80);
      header.classList.toggle('is-hidden', y > 500 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    lastY = y;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var mnav = $('.mobile-nav');
  function setMenu(open) {
    if (!mnav) return;
    mnav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
    $$('[data-menu-open]').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  }
  $$('[data-menu-open]').forEach(function (b) { b.addEventListener('click', function () { setMenu(true); }); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Service tabs ---------- */
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (d) { e.preventDefault(); var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n); }
      });
    });
  });

  /* ---------- Sticky step switchers (values + process) ---------- */
  $$('[data-steps]').forEach(function (root) {
    var items = $$('[data-step]', root);
    var imgs = $$('[data-step-img]', root);
    var bars = $$('[data-step-bar]', root);
    var num = $('[data-step-num]', root);
    var title = $('[data-step-title]', root);
    function activate(i) {
      items.forEach(function (it, k) { it.classList.toggle('is-active', k === i); });
      imgs.forEach(function (im, k) { im.classList.toggle('is-active', k === i); });
      bars.forEach(function (b, k) { b.classList.toggle('is-done', k <= i); });
      if (num) num.textContent = ('0' + (i + 1)).slice(-2);
      if (title && items[i]) title.textContent = items[i].getAttribute('data-step');
    }
    activate(0);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) activate(items.indexOf(en.target)); });
      }, { rootMargin: '-45% 0px -45% 0px' });
      items.forEach(function (it) { io.observe(it); });
    }
  });

  /* ---------- Split words helper ---------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return $$('.w > span', el);
    el.dataset.splitDone = '1';
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var s = document.createElement('span'); s.textContent = part;
            w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
      });
    };
    walk(el);
    return $$('.w > span', el);
  }

  /* ---------- Fallback reveal (no GSAP) ---------- */
  function fallbackReveal() {
    var els = $$('.reveal, [data-clip]');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  if (!hasGSAP) { fallbackReveal(); }
  else {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('has-gsap');

    // Generic reveals
    $$('.reveal').forEach(function (el) {
      gsap.fromTo(el, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onStart: function () { el.classList.add('is-in'); } });
    });
    // Clip-path image reveals
    $$('[data-clip]').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(14% 8% 14% 8% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onComplete: function () { el.classList.add('is-in'); el.style.clipPath = ''; } });
    });
    // Split headings: words rise
    $$('[data-split]').forEach(function (el) {
      var words = splitWords(el);
      var isHero = el.closest('.hero, .page-hero');
      gsap.from(words, { yPercent: 110, rotate: 4, duration: 1.1, ease: 'power4.out', stagger: .045,
        delay: isHero ? .25 : 0,
        scrollTrigger: isHero ? null : { trigger: el, start: 'top 85%', once: true } });
    });
    // Scroll-scrubbed text fill
    $$('[data-fill]').forEach(function (el) {
      var words = splitWords(el);
      gsap.fromTo(words, { opacity: .28 }, { opacity: 1, stagger: .08, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });
    // Parallax images
    $$('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax')) || 8;
      gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // Hero intro
    var heroImg = $('.hero__media img, .page-hero__media img');
    if (heroImg) gsap.from(heroImg, { scale: 1.18, duration: 2.4, ease: 'power3.out' });
    $$('.hero .hero__card, .hero__meta, .page-hero .lead, .page-hero .crumbs').forEach(function (el, i) {
      gsap.from(el, { autoAlpha: 0, y: 30, duration: 1.1, delay: .6 + i * .12, ease: 'power3.out' });
    });
    $$('.corner').forEach(function (c, i) { gsap.from(c, { scale: 0, autoAlpha: 0, duration: .9, delay: .9 + i * .08, ease: 'back.out(2)' }); });
    // Process line fill
    $$('.steps').forEach(function (s) {
      var f = $('.steps__fill', s);
      if (f) gsap.to(f, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top 55%', end: 'bottom 55%', scrub: true } });
    });
    // Project cards fan out
    var cards = $$('[data-fan] > *');
    if (cards.length && window.innerWidth > 900) {
      gsap.from(cards, { xPercent: function (i) { return i === 0 ? 40 : -40; }, rotate: function (i) { return i === 0 ? -8 : 8; }, scale: .86, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-fan]', start: 'top 95%', end: 'top 35%', scrub: 1 } });
    }
    // Swatches stagger
    var sw = $$('.swatch');
    if (sw.length) gsap.from(sw, { y: 40, autoAlpha: 0, stagger: .1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.swatches', start: 'top 90%', once: true } });
    // Magnetic buttons
    if (window.matchMedia('(hover: hover)').matches) {
      $$('.btn').forEach(function (b) {
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4, ease: 'power3.out' });
        });
        b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.5)' }); });
      });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---------- Enquiry form (front-end only — wire to Duda/CRM before launch) ---------- */
  var form = $('[data-enquiry]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      $('.form-success', form).style.display = 'block';
      $('button[type=submit]', form).disabled = true;
    });
  }
  var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
