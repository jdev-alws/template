import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window { __glowReady?: boolean; __lenis?: Lenis | null }
}

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s));

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------- */
/*  Entry                                                                      */
/* -------------------------------------------------------------------------- */
export function initSite() {
  window.__glowReady = true;

  imageFallbacks();
  const lenis = initLenis();
  window.__lenis = lenis;

  initNav();
  initAnchors(lenis);
  initMobileMenu(lenis);
  initReels();
  initTestimonials();

  // Initialize Hero immediately so cards start rotating and are fully interactive
  initHero();

  // Safe initialization of all modules
  const safeRun = (fn: () => void, name: string) => {
    try { fn(); } catch (e) { console.warn(`[Glowence] Error in ${name}:`, e); }
  };

  safeRun(initSplitText, 'initSplitText');
  safeRun(initReveals, 'initReveals');
  safeRun(initScrubText, 'initScrubText');
  safeRun(initAbout, 'initAbout');
  safeRun(() => initCounters(false), 'initCounters');
  safeRun(() => initGauge(false), 'initGauge');
  safeRun(initPortraitCarousel, 'initPortraitCarousel');
  safeRun(initServiceStack, 'initServiceStack');
  safeRun(initProcess, 'initProcess');
  safeRun(initCardModal, 'initCardModal');
  safeRun(initMisc, 'initMisc');

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* -------------------------------------------------------------------------- */
/*  Smooth scroll                                                              */
/* -------------------------------------------------------------------------- */
function initLenis() {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initAnchors(lenis: Lenis | null) {
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      if (id === '#') { e.preventDefault(); return; }
      const target = id === '#top' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: id === '#top' ? 0 : -80, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'auto' });
      history.replaceState(null, '', id);
    });
  });
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */
function initNav() {
  const nav = $('[data-nav]');
  if (!nav) return;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initMobileMenu(lenis: Lenis | null) {
  const btn = $<HTMLButtonElement>('[data-menu-btn]');
  const menu = $('[data-menu]');
  const close = $<HTMLButtonElement>('[data-menu-close]');
  if (!btn || !menu || !close) return;

  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      lenis?.stop();
      close.focus();
      if (!prefersReduced()) gsap.from($$('li', menu), { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' });
    } else {
      lenis?.start();
      btn.focus();
    }
  };
  btn.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  $$('[data-menu-link]', menu).forEach((l) => l.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setOpen(false); });
}

/* -------------------------------------------------------------------------- */
/*  Text splitting (word-level, preserves inline markup)                       */
/* -------------------------------------------------------------------------- */
function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.splitDone) return $$('.split-word > span', el);
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
          words.push(inner);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    });
  };
  // Keep the full sentence available to assistive tech.
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent?.trim().replace(/\s+/g, ' ') ?? '');
  walk(el);
  $$('.split-word', el).forEach((w) => w.setAttribute('aria-hidden', 'true'));
  el.dataset.splitDone = '1';
  return words;
}

function initSplitText() {
  $$('[data-split]').forEach((el) => {
    if (el.closest('#top') || el.closest('[data-hero]')) return; // hero handled by its own timeline
    const words = splitWords(el);
    gsap.set(words, { yPercent: 110, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.045 }),
    });
  });
}

function initScrubText() {
  $$('[data-split-scrub]').forEach((el) => {
    const words = $$('.split-word', el).length ? $$('.split-word', el) : splitWords(el).map((w) => w.parentElement!);
    gsap.fromTo(
      words,
      { opacity: 0.18, y: 12 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: 0.8 },
      },
    );
  });
}

/* -------------------------------------------------------------------------- */
/*  Hero: orchestrated intro + continuous rotating arch + ScrollTrigger        */
/* -------------------------------------------------------------------------- */
function initHero() {
  const hero = $('[data-hero]');
  if (!hero) return;
  const heroSection = $('#top') || hero;
  const title = $('[data-split]', hero);
  const words = title ? splitWords(title) : [];
  const cards = $$('[data-hero-card]', hero);
  const intro = $$('[data-hero-intro]');
  const wheel = $<HTMLElement>('[data-hero-wheel]', hero);

  // Reveal timeline
  gsap.set(words, { yPercent: 115 });
  if (title) gsap.set(title, { visibility: 'visible' });
  gsap.set(cards, { scale: 0.8, autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
  tl.fromTo('[data-hero-bg]', { scale: 1.25, autoAlpha: 0 }, { scale: 1.1, autoAlpha: 0.35, duration: 2, ease: 'power2.out' }, 0)
    .to(cards, { scale: 1, autoAlpha: 1, duration: 1.3, stagger: { each: 0.03, from: 'center' } }, 0.15)
    .to(words, { yPercent: 0, duration: 1.2, stagger: 0.07 }, 0.45)
    .fromTo(intro, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.7);

  // Background subtle parallax on scroll
  gsap.to('[data-hero-bg]', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: true },
  });

  // Continuous smooth auto-rotation + Dragging + Scroll scrubbing
  if (wheel) {
    let currentAngle = 0;
    let targetAngle = 0;
    let isHovered = false;
    let isDragging = false;
    let startX = 0;
    let dragAngleStart = 0;
    let scrollRotationOffset = 0;

    // Continuous smooth auto-rotation speed (~10 degrees per second)
    const baseSpeed = 0.012; // deg per millisecond

    // Gentle slow-down on card hover so user can inspect any card easily
    cards.forEach((c) => {
      c.addEventListener('mouseenter', () => { isHovered = true; });
      c.addEventListener('mouseleave', () => { isHovered = false; });
      c.addEventListener('focus', () => { isHovered = true; });
      c.addEventListener('blur', () => { isHovered = false; });
    });

    // Interactive pointer drag / touch support
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return;
      isDragging = true;
      startX = e.clientX;
      dragAngleStart = targetAngle;
      hero.style.cursor = 'grabbing';
      try { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      targetAngle = dragAngleStart + dx * 0.22;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      hero.style.cursor = '';
      try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
    };

    hero.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // ScrollTrigger: scrubs rotation dynamically with page scroll
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        scrollRotationOffset = self.progress * 120;
      },
    });

    // 60/120fps RAF loop: directly writes CSS transform with zero GSAP conflict
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      if (!isDragging) {
        // Continuous auto-rotation (slows down to 25% on hover)
        const speed = isHovered ? baseSpeed * 0.25 : baseSpeed;
        targetAngle += speed * dt;
      }

      // Smooth damping
      currentAngle += (targetAngle + scrollRotationOffset - currentAngle) * 0.12;

      // Direct transform setting ensures 100% reliable motion at all times
      wheel.style.transform = `rotate(${currentAngle % 360}deg)`;

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}

/* -------------------------------------------------------------------------- */
/*  Universal Scroll Reveal System (Applied to cards & content in all sections) */
/* -------------------------------------------------------------------------- */
function initReveals() {
  if (prefersReduced()) {
    $$('[data-reveal], [data-scroll-reveal]').forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  // 1. Hero strip: revealed on load with a slight delay
  const strip = $$('#top [data-reveal]');
  if (strip.length) {
    gsap.fromTo(
      strip,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.8, ease: 'power3.out' }
    );
  }

  // 2. Universal IntersectionObserver for all [data-reveal] & cards across all sections (excluding Hero)
  // Guarantees consistent on-scroll appearance for Pricing cards and every section's content
  const revealElements = $$('[data-reveal]:not(#top *), [data-scroll-reveal]:not(#top *)');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.classList.add('is-revealed');
          observer.unobserve(target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/*  Universal Card Modal Pop-up (Click any card across entire website)          */
/* -------------------------------------------------------------------------- */
function initCardModal() {
  const modal = $('#universal-card-modal');
  const box = $('#card-modal-box');
  const closeBtn = $('#card-modal-close');
  const ctaBtn = $('#card-modal-cta');
  const mediaWrap = $('#card-modal-media-wrap');
  const imgEl = $<HTMLImageElement>('#card-modal-img');
  const imgTag = $('#card-modal-img-tag');
  const iconWrap = $('#card-modal-icon-wrap');
  const iconTag = $('#card-modal-icon-tag');
  const badgeEl = $('#card-modal-badge');
  const metaEl = $('#card-modal-meta');
  const titleEl = $('#card-modal-title');
  const subEl = $('#card-modal-sub');
  const descEl = $('#card-modal-desc');
  const featuresWrap = $('#card-modal-features-wrap');
  const featuresList = $('#card-modal-features-list');

  if (!modal || !box) return;

  const openModal = (data: {
    title: string;
    badge?: string;
    meta?: string;
    sub?: string;
    desc?: string;
    img?: string;
    features?: string[];
  }) => {
    if (titleEl) titleEl.textContent = data.title || 'Ritual Experience';
    if (badgeEl) badgeEl.textContent = data.badge || '★ Featured Ritual';
    if (metaEl) metaEl.textContent = data.meta || '';

    if (subEl) {
      if (data.sub) {
        subEl.textContent = data.sub;
        subEl.classList.remove('hidden');
      } else {
        subEl.classList.add('hidden');
      }
    }

    if (descEl) descEl.textContent = data.desc || 'Experience our bespoke luxury treatment crafted to enhance your natural beauty.';

    if (featuresWrap && featuresList) {
      if (data.features && data.features.length) {
        featuresList.innerHTML = data.features
          .map(
            (f) => `
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-accent shrink-0"></span>
            <span>${f}</span>
          </li>
        `
          )
          .join('');
        featuresWrap.classList.remove('hidden');
      } else {
        featuresWrap.classList.add('hidden');
      }
    }

    if (data.img && imgEl && mediaWrap) {
      imgEl.src = data.img;
      imgEl.alt = data.title;
      if (imgTag) imgTag.textContent = data.badge || 'Signature Treatment';
      mediaWrap.classList.remove('hidden');
      if (iconWrap) iconWrap.classList.add('hidden');
    } else {
      if (mediaWrap) mediaWrap.classList.add('hidden');
      if (iconWrap) {
        iconWrap.classList.remove('hidden');
        if (iconTag) iconTag.textContent = data.badge || 'Glowence Feature';
      }
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    box.classList.remove('scale-90');
    box.classList.add('scale-100');

    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
  };

  const closeModal = () => {
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    box.classList.remove('scale-100');
    box.classList.add('scale-90');

    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
  };

  closeBtn?.addEventListener('click', closeModal);
  ctaBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('pointer-events-none')) closeModal();
  });

  // Attach click listener to every card on the entire website
  const cardSelectors = [
    '#features .card',
    '#features [data-feature]',
    '#features .grid-cols-3 > div',
    '[data-step]',
    '[data-stack-card]',
    '#pricing article.card',
    '#team li',
    '#journal li',
    '#academy li',
    '#skin-title + figure',
    '[data-testi-panel]',
    '[data-orbit] .card',
  ];

  const allCards = $$(cardSelectors.join(', '));

  allCards.forEach((card) => {
    // Exclude reel cards (handled by their dedicated video lightbox modal), top hero cards, and avatar carousel toggle
    if (
      card.closest('[data-reels-container]') ||
      card.closest('#top') ||
      card.hasAttribute('data-carousel-frame') ||
      card.hasAttribute('data-carousel-toggle')
    ) {
      return;
    }

    card.classList.add('cursor-pointer');

    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      // Do not open if user clicked directly on external/nav links or carousel controls
      if (
        target.closest('a[href^="http"], a[href^="tel:"], a[href^="mailto:"], [data-carousel-toggle], [data-carousel-prev], [data-carousel-next]')
      ) {
        return;
      }
      if (target.closest('button:not([type="button"].card)') && !target.closest('.btn')) {
        return;
      }

      e.preventDefault();

      // Extract card information
      const title =
        card.querySelector('h2, h3, h4, span.font-serif')?.textContent?.trim() ||
        card.querySelector('.font-semibold.text-ink')?.textContent?.trim() ||
        'Ritual Experience';

      const img = (card.querySelector('img:not([src*="w=96"])') as HTMLImageElement)?.src || '';

      const badge =
        card.querySelector('[data-step]')?.textContent?.trim() ||
        card.querySelector('.tag, .chip, span.rounded-full.bg-white')?.textContent?.trim() ||
        card.querySelector('span[class*="text-accent"]')?.textContent?.trim() ||
        '★ Signature Glow';

      const meta = card.querySelector('.chip, span.font-mono, time, [aria-label*="stars"]')?.textContent?.trim() || '';

      const sub = card.querySelector('p.text-xs.text-muted, p.text-muted, span.text-xs')?.textContent?.trim() || '';

      const desc =
        card.querySelector('.lede, p.text-sm, p.text-xs, blockquote')?.textContent?.trim() ||
        'A personalized sanctuary ritual designed to nourish, restore balance, and enhance your radiant glow.';

      const featureEls = Array.from(card.querySelectorAll('ul li, ol li')).slice(0, 5);
      const features = featureEls.map((el) => el.textContent?.trim() || '').filter((t) => t.length > 0 && t.length < 80);

      openModal({
        title,
        badge,
        meta,
        sub,
        desc,
        img,
        features: features.length > 0 ? features : undefined,
      });
    });
  });
}

function initAbout() {
  const section = $('#about');
  if (!section) return;
  const media = $('[data-about-media]', section);
  const tag = $('.tag', section);
  const badge = $('[data-reveal]', media);
  const buttonWrap = $('[data-reveal]', $('h2', section)?.parentElement || section);
  const [a, b] = media ? [$('[data-about-img="1"]', media), $('[data-about-img="2"]', media)] : [null, null];

  if (tag) {
    gsap.set(tag, { autoAlpha: 0, y: 25, scale: 0.88 });
    ScrollTrigger.create({
      trigger: tag,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(tag, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }),
    });
  }

  if (a && b) {
    // Both images pop up with scale and elevation
    gsap.set(a, { autoAlpha: 0, y: 60, scale: 0.86 });
    gsap.set(b, { autoAlpha: 0, y: 70, scale: 0.84 });
    if (badge) gsap.set(badge, { autoAlpha: 0, scale: 0.6, y: 35 });

    ScrollTrigger.create({
      trigger: media,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Image 1 pops up with smooth luxury spring
        gsap.to(a, { autoAlpha: 1, y: 0, scale: 1, duration: 1.15, ease: 'back.out(1.2)' });
        // Image 2 pops up with slight delay and spring
        gsap.to(b, { autoAlpha: 1, y: 0, scale: 1, duration: 1.25, delay: 0.18, ease: 'back.out(1.25)' });
        // 12+ badge pops up with playful bounce!
        if (badge) {
          gsap.to(badge, { autoAlpha: 1, scale: 1, y: 0, duration: 0.95, delay: 0.38, ease: 'back.out(1.6)' });
        }
      },
    });

    // Subtle parallax on scroll
    gsap.to(b, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  if (buttonWrap) {
    gsap.set(buttonWrap, { autoAlpha: 0, y: 30, scale: 0.92 });
    ScrollTrigger.create({
      trigger: buttonWrap,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(buttonWrap, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.3)' }),
    });
  }
}

/* -------------------------------------------------------------------------- */
/*  Numbers                                                                    */
/* -------------------------------------------------------------------------- */
function initCounters(immediate: boolean) {
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const fmt = (v: number) => v.toFixed(decimals);
    if (immediate) { el.textContent = fmt(end); return; }
    el.textContent = fmt(0);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(obj, { v: end, duration: 2, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(obj.v); } }),
    });
  });
}

function initGauge(immediate?: boolean) {
  // Handled cleanly and directly by Features.astro dedicated component controller
}

/* -------------------------------------------------------------------------- */
/*  Features: Portrait Carousel (2 photos + single dot toggle)                */
/* -------------------------------------------------------------------------- */
function initPortraitCarousel() {
  $$('[data-portrait-carousel]').forEach((carousel) => {
    if (carousel.hasAttribute('data-initialized')) return;
    carousel.setAttribute('data-initialized', 'true');
    const slides = $$('[data-carousel-slide]', carousel);
    const toggleBtn = $('[data-carousel-toggle]', carousel);
    const prevBtn = $('[data-carousel-prev]', carousel);
    const nextBtn = $('[data-carousel-next]', carousel);
    if (!slides.length) return;

    let current = 0;
    let timer: number | null = null;
    const delay = 3500;

    const goTo = (index: number) => {
      const next = (index + slides.length) % slides.length;
      if (next === current) return;

      slides.forEach((slide, i) => {
        if (i === next) {
          slide.classList.remove('opacity-0', 'scale-95', 'pointer-events-none', 'z-0');
          slide.classList.add('opacity-100', 'scale-100', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'scale-100', 'z-10');
          slide.classList.add('opacity-0', 'scale-95', 'pointer-events-none', 'z-0');
        }
      });

      // Subtle pulse on the single dot indicator to show transition
      if (toggleBtn) {
        gsap.fromTo(toggleBtn, { scale: 0.6 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
      }

      current = next;
    };

    const startAutoplay = () => {
      stopAutoplay();
      timer = window.setInterval(() => goTo(current + 1), delay);
    };

    const stopAutoplay = () => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };

    const toggle = (e?: Event) => {
      if (e) e.preventDefault();
      goTo(current + 1);
      startAutoplay();
    };

    toggleBtn?.addEventListener('click', toggle);
    prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(current - 1);
      startAutoplay();
    });
    nextBtn?.addEventListener('click', toggle);

    // Clicking the circular frame directly also toggles between the 2 photos
    const imgWrapper = $('[data-carousel-frame]', carousel) || carousel.firstElementChild;
    imgWrapper?.addEventListener('click', toggle);

    carousel.addEventListener('pointerenter', stopAutoplay);
    carousel.addEventListener('pointerleave', startAutoplay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = (e as TouchEvent).touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const diffX = (e as TouchEvent).changedTouches[0].clientX - touchStartX;
      if (Math.abs(diffX) > 30) {
        goTo(current + 1);
      }
      startAutoplay();
    }, { passive: true });

    startAutoplay();
  });
}

/* -------------------------------------------------------------------------- */
/*  Services: sticky stack, earlier cards recede                               */
/* -------------------------------------------------------------------------- */
function initServiceStack() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const cards = $$('[data-stack-card]');
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to($('[data-stack-inner]', card), {
        scale: 0.93 + i * 0.02,
        opacity: 0.55,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom-=10%', end: 'top 20%', scrub: true },
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/*  Working process: pinned staircase assembly                                 */
/* -------------------------------------------------------------------------- */
function initProcess() {
  // Handled cleanly and directly by Process.astro dedicated Astro component script
}

/* -------------------------------------------------------------------------- */
/*  Small extras                                                               */
/* -------------------------------------------------------------------------- */
function initMisc() {
  // Skin analysis image eases in.
  $$('[data-scale-in]').forEach((el) =>
    gsap.fromTo(el, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } }),
  );
  // Floating tags bob gently.
  $$('[data-floaty]').forEach((el) => gsap.to(el, { y: -6, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  // Footer wordmark rises in.
  const mark = $('[data-wordmark]');
  if (mark) {
    gsap.from(mark, { yPercent: 60, autoAlpha: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: mark, start: 'top bottom', once: true } });
  }
}

/* -------------------------------------------------------------------------- */
/*  Reels carousel                                                             */
/* -------------------------------------------------------------------------- */
function initReels() {
  const root = $('[data-reels-container]') || $('[data-reels]');
  if (!root) return;
  const track = $('[data-reels-track]', root) || $('[data-reel-track]', root);
  if (!track) return;
  const step = () => (track.querySelector('div, li')?.getBoundingClientRect().width ?? 220) + 16;
  $('[data-reel-prev]', root)?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('[data-reel-next]', root)?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
}

/* -------------------------------------------------------------------------- */
/*  Testimonials (accessible tabs)                                             */
/* -------------------------------------------------------------------------- */
function initTestimonials() {
  const root = $('[data-testimonials]');
  if (!root) return;
  const tabs = $$<HTMLButtonElement>('[data-testi-tab]', root);
  const panels = $$('[data-testi-panel]', root);
  let current = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');

  const select = (i: number, focus = false) => {
    if (i === current) return;
    const prev = panels[current];
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    panels[i].hidden = false;
    if (!prefersReduced()) {
      gsap.fromTo(panels[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      gsap.to(prev, { autoAlpha: 0, duration: 0.3, onComplete: () => { prev.hidden = true; gsap.set(prev, { clearProps: 'all' }); } });
    } else prev.hidden = true;
    current = i;
    if (focus) tabs[i].focus();
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); select((current + 1) % tabs.length, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); select((current - 1 + tabs.length) % tabs.length, true); }
    });
  });
}

/* -------------------------------------------------------------------------- */
function imageFallbacks() {
  $$<HTMLImageElement>('img').forEach((img) => {
    const fail = () => img.classList.add('img-fallback');
    if (img.complete && img.naturalWidth === 0 && img.src) fail();
    else img.addEventListener('error', fail, { once: true });
  });
}
