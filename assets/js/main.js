/* ==========================================================================
   YOUR NAME — Portfolio · main.js
   Vanilla JS. No dependencies, no build step.
   ========================================================================== */

/* ───────────────────────────────────────────────────────────────────────────
   ▸ EDIT ME · CONTACT FORM DELIVERY
   Pick ONE provider and fill in its value. Until you do, the form runs in
   'demo' mode: it validates and confirms on screen, but sends nothing.

   'formspree' → sign up at https://formspree.io, create a form, copy the ID
                 out of the endpoint URL (https://formspree.io/f/XXXXXXXX).
   'web3forms' → get a free access key at https://web3forms.com (no account).
   'mailto'    → opens the visitor's mail app with the message pre-filled.
   'demo'      → no delivery; useful while you are still building.
   ─────────────────────────────────────────────────────────────────────────── */
const CONTACT_CONFIG = {
  provider: 'demo',                 // 'formspree' | 'web3forms' | 'mailto' | 'demo'
  formspreeId: '',                  // e.g. 'xbjnqkla'
  web3formsKey: '',                 // e.g. '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
  email: 'you@yourdomain.com',      // used by 'mailto' and shown on errors
  subjectPrefix: '[Portfolio] '     // prepended to the email subject line
};

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1 · THEME ───────────────────────────────────────────────────────── */

  const THEME_KEY = 'portfolio-theme';
  const themeToggle = $('#themeToggle');

  const readStoredTheme = () => {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  };
  const storeTheme = (value) => {
    try { localStorage.setItem(THEME_KEY, value); } catch (e) { /* private mode */ }
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      const goingTo = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', 'Switch to ' + goingTo + ' theme');
      themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    }
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#05070E' : '#F4F7FC');
  };

  // Dark is the house style; light is opt-in. Swap the fallback to
  // matchMedia('(prefers-color-scheme: light)') if you'd rather follow the OS.
  const stored = readStoredTheme();
  applyTheme(stored === 'light' || stored === 'dark' ? stored : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* ── 2 · HEADER, SCROLL PROGRESS, BACK-TO-TOP ────────────────────────── */

  const header  = $('#siteHeader');
  const bar     = $('#scrollBar');
  const toTop   = $('#toTop');

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 12);
    if (toTop)  toTop.classList.toggle('is-on', y > 600);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    highlightSection(y);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ── 3 · MOBILE NAVIGATION ───────────────────────────────────────────── */

  const burger   = $('#burger');
  const navLinks = $('#navLinks');
  const scrim    = $('#navScrim');

  const setMenu = (open) => {
    if (!burger || !navLinks) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (scrim) scrim.hidden = !open;
  };

  if (burger) {
    burger.addEventListener('click', () => {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (scrim) scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  $$('.nav__link').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMenu(false);
    movePill($('.nav__link.is-active'));
  });

  /* ── 4 · SCROLLSPY + SLIDING NAV PILL ────────────────────────────────── */

  const pill     = $('#navPill');
  const navItems = $$('.nav__link');
  const sections = navItems
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  function movePill(activeLink) {
    if (!pill || !activeLink || window.innerWidth <= 860) {
      if (pill) pill.classList.remove('is-on');
      return;
    }
    pill.style.width = activeLink.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + activeLink.offsetLeft + 'px)';
    pill.classList.add('is-on');
  }

  function highlightSection(y) {
    if (!sections.length) return;
    const probe = y + (window.innerHeight * 0.28);
    let current = sections[0];
    sections.forEach((sec) => { if (sec.offsetTop <= probe) current = sec; });

    // Bottom of the page always lights the last entry.
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    navItems.forEach((a) => {
      const on = a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('is-active', on);
      if (on) movePill(a);
    });
  }

  /* ── 5 · REVEAL ON SCROLL ────────────────────────────────────────────── */

  const revealables = $$('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach((el) => io.observe(el));
  }

  /* ── 6 · COUNTERS & SKILL BARS ───────────────────────────────────────── */

  function runCounter(el) {
    const decimalValue = el.dataset.decimalValue ? parseFloat(el.dataset.decimalValue) : null;
    const target = decimalValue !== null ? decimalValue : parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }

    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(step);
  }

  function fillBar(el) {
    el.style.width = (parseInt(el.dataset.level || '0', 10)) + '%';
  }

  const animatables = [
    { nodes: $$('.count'), run: runCounter },
    { nodes: $$('.bar i'), run: fillBar }
  ];

  if (!('IntersectionObserver' in window)) {
    animatables.forEach((g) => g.nodes.forEach(g.run));
  } else {
    animatables.forEach((group) => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          group.run(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      group.nodes.forEach((n) => obs.observe(n));
    });
  }

  /* ── 7 · PROJECT FILTERS ─────────────────────────────────────────────── */

  const filters  = $$('.filter');
  const projects = $$('.project');
  const empty    = $('#projectsEmpty');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;

      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });

      let shown = 0;
      projects.forEach((card) => {
        const cats = (card.dataset.cat || '').split(/\s+/);
        const match = cat === 'all' || cats.indexOf(cat) !== -1;
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (empty) empty.hidden = shown !== 0;
    });
  });

  /* ── 8 · CONTACT FORM ────────────────────────────────────────────────── */

  const form    = $('#contactForm');
  const status  = $('#formStatus');
  const submit  = $('#cf-submit');
  const counter = $('#cf-count');
  const message = $('#cf-message');

  if (counter && message) {
    const sync = () => { counter.textContent = String(message.value.trim().length); };
    message.addEventListener('input', sync);
    sync();
  }

  const RULES = {
    'cf-name':    (v) => v.trim().length >= 2 || 'Please enter your name (at least 2 characters).',
    'cf-email':   (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) || 'Please enter a valid email address.',
    'cf-subject': (v) => v.trim().length >= 3 || 'Give your message a short subject.',
    'cf-message': (v) => v.trim().length >= 20 || 'Please write at least 20 characters so I can help properly.'
  };

  function setFieldError(input, msg) {
    const wrap = input.closest('.field');
    const slot = wrap ? wrap.querySelector('.field__error') : null;
    if (wrap) wrap.classList.toggle('has-error', Boolean(msg));
    if (slot) slot.textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validateField(input) {
    if (input.type === 'checkbox') {
      const ok = input.checked;
      setFieldError(input, ok ? '' : 'Please confirm before sending.');
      return ok;
    }
    const rule = RULES[input.id];
    if (!rule) return true;
    const result = rule(input.value);
    const msg = result === true ? '' : result;
    setFieldError(input, msg);
    return msg === '';
  }

  if (form) {
    $$('input, textarea, select', form).forEach((input) => {
      input.addEventListener('blur', () => { if (input.value || input.required) validateField(input); });
      input.addEventListener('input', () => {
        const wrap = input.closest('.field');
        if (wrap && wrap.classList.contains('has-error')) validateField(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fields = [$('#cf-name'), $('#cf-email'), $('#cf-subject'), $('#cf-message'), $('#cf-consent')];
      let firstBad = null;
      fields.forEach((f) => { if (f && !validateField(f) && !firstBad) firstBad = f; });

      if (firstBad) {
        showStatus('err', 'Please fix the highlighted fields and try again.');
        firstBad.focus();
        return;
      }

      // Honeypot — a bot filled the hidden field.
      const trap = $('#cf-website');
      if (trap && trap.value) { showStatus('ok', 'Thanks — your message has been sent.'); form.reset(); return; }

      const data = {
        name:    $('#cf-name').value.trim(),
        email:   $('#cf-email').value.trim(),
        company: $('#cf-company').value.trim(),
        budget:  $('#cf-budget').value,
        subject: CONTACT_CONFIG.subjectPrefix + $('#cf-subject').value.trim(),
        message: $('#cf-message').value.trim()
      };

      setSending(true);
      try {
        await deliver(data);
        if (CONTACT_CONFIG.provider === 'mailto') {
          showStatus('info', 'Your email app should be opening with the message ready to send.');
        } else if (CONTACT_CONFIG.provider === 'demo') {
          showStatus('info', 'Demo mode — nothing was sent. Set CONTACT_CONFIG.provider in assets/js/main.js to deliver real messages.');
        } else {
          showStatus('ok', 'Thanks, ' + data.name.split(' ')[0] + ' — your message is on its way. I usually reply within two business days.');
          form.reset();
          if (counter) counter.textContent = '0';
        }
      } catch (err) {
        showStatus('err', 'That did not go through. Please email ' + CONTACT_CONFIG.email + ' directly.');
      } finally {
        setSending(false);
      }
    });
  }

  function setSending(on) {
    if (!submit) return;
    submit.classList.toggle('is-sending', on);
    submit.disabled = on;
    const label = submit.querySelector('.btn__label');
    if (label) label.textContent = on ? 'Sending…' : 'Send message';
  }

  function showStatus(kind, text) {
    if (!status) return;
    status.className = 'form__status is-' + kind;
    status.textContent = text;
  }

  async function deliver(data) {
    const p = CONTACT_CONFIG.provider;

    if (p === 'formspree') {
      if (!CONTACT_CONFIG.formspreeId) throw new Error('Missing Formspree ID');
      const res = await fetch('https://formspree.io/f/' + CONTACT_CONFIG.formspreeId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Formspree responded ' + res.status);
      return;
    }

    if (p === 'web3forms') {
      if (!CONTACT_CONFIG.web3formsKey) throw new Error('Missing Web3Forms key');
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ access_key: CONTACT_CONFIG.web3formsKey }, data))
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Web3Forms rejected the submission');
      return;
    }

    if (p === 'mailto') {
      const body = [
        'Name: ' + data.name,
        'Email: ' + data.email,
        'Company: ' + (data.company || '—'),
        'Budget: ' + (data.budget || '—'),
        '',
        data.message
      ].join('\n');
      window.location.href = 'mailto:' + CONTACT_CONFIG.email +
        '?subject=' + encodeURIComponent(data.subject) +
        '&body=' + encodeURIComponent(body);
      return;
    }

    // demo
    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  /* ── 9 · MISC ────────────────────────────────────────────────────────── */

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Smooth anchor scrolling that respects the fixed header.
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight + 14 : 0);
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  // First paint.
  onScroll();
  window.addEventListener('load', () => movePill($('.nav__link.is-active')));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => movePill($('.nav__link.is-active')));
  }
})();
