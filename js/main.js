/* ==========================================================
   Frauen mit Plan B — Interaction layer
   Preloader, smooth scroll, scroll reveals, text reveals,
   magnetic buttons, custom cursor. Respects prefers-reduced-motion.
   ========================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- Preloader ----------
     Never lets a slow/blocked CDN hold the page hostage: pointer-events
     is off from the start (see CSS), and a hard timeout guarantees the
     overlay disappears even if the "load" event never fires. */
  var preloader = document.getElementById("preloader");
  var preloaderHidden = false;
  function hidePreloader() {
    if (preloaderHidden) return;
    preloaderHidden = true;
    document.body.classList.add("is-loaded");
    document.dispatchEvent(new Event("fmpb:loaded"));
    if (!preloader) return;
    if (window.gsap) {
      gsap.to(preloader.querySelector(".preloader__word"), {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out"
      });
      gsap.to(preloader, {
        opacity: 0, duration: 0.6, delay: 0.3, ease: "power2.inOut",
        onComplete: function () { preloader.style.display = "none"; }
      });
    } else {
      preloader.style.display = "none";
    }
  }
  window.addEventListener("load", function () {
    setTimeout(hidePreloader, reduceMotion ? 0 : 300);
  });
  setTimeout(hidePreloader, 2000);

  /* ---------- Hero image intro ----------
     Our photos cycle full-bleed over the hero, then the last one
     shrinks away into the top-left corner before the headline shows.
     Only ever starts once the preloader has actually lifted (via the
     fmpb:loaded event), so it always plays out where visitors can see
     it instead of finishing underneath the overlay. */
  var heroSection = document.querySelector(".hero");
  var heroIntroWrap = document.querySelector(".hero__intro");
  var heroIntroImgs = heroIntroWrap ? heroIntroWrap.querySelectorAll(".hero__intro-img") : [];
  var heroContent = document.querySelector(".hero__content");
  if (heroSection && heroIntroWrap && heroIntroImgs.length && heroContent) {
    if (reduceMotion) {
      heroIntroWrap.remove();
    } else {
      heroSection.classList.add("js-intro");
      var startHeroIntro = function () {
        var stepMs = 850;
        var lastIndex = heroIntroImgs.length - 1;
        heroIntroImgs[0].classList.add("is-active");
        for (var i = 1; i <= lastIndex; i++) {
          (function (i) {
            setTimeout(function () {
              heroIntroImgs[i - 1].classList.remove("is-active");
              heroIntroImgs[i].classList.add("is-active");
            }, stepMs * i);
          })(i);
        }
        /* the last image gets a beat on screen, then collapses into the
           corner while the headline fades in behind it */
        setTimeout(function () {
          heroIntroImgs[lastIndex].classList.add("is-collapsing");
          heroContent.classList.add("is-revealed");
        }, stepMs * (lastIndex + 1));
        setTimeout(function () {
          heroIntroWrap.remove();
        }, stepMs * (lastIndex + 1) + 900);
      };
      if (document.body.classList.contains("is-loaded")) {
        startHeroIntro();
      } else {
        document.addEventListener("fmpb:loaded", startHeroIntro, { once: true });
      }
    }
  }

  /* ---------- Hero image intro v2 (heroA, index.html) ----------
     Cross-fades full-bleed photos behind the hero copy, then the whole
     background shrinks away into the logo before the header takes over. */
  (function () {
    var bg = document.querySelector(".heroA__bg");
    var box = document.querySelector(".heroA__in");
    if (!bg || !box) return;
    var imgs = [].slice.call(bg.querySelectorAll(".heroA__img"));
    var seen = null;
    try { seen = sessionStorage.getItem("fmpb-hero-intro"); } catch (e) {}

    if (reduceMotion || seen || !imgs.length) { bg.classList.add("is-off"); return; }

    box.classList.add("is-pending");

    var STEP = 600;
    var FADE = 200;
    var started = false;

    function decoded(im) {
      if (im.decode) { return im.decode().catch(function () {}); }
      if (im.complete) { return Promise.resolve(); }
      return new Promise(function (r) { im.onload = im.onerror = r; });
    }

    function aimAtLogo() {
      var logo = document.querySelector(".logo");
      if (!logo) return;
      var a = logo.getBoundingClientRect(), b = bg.getBoundingClientRect();
      if (!a.width || !b.width) return;
      bg.style.transformOrigin =
        (a.left + a.width / 2 - b.left) + "px " + (a.top + a.height / 2 - b.top) + "px";
    }

    function finish() {
      aimAtLogo();
      bg.classList.add("is-done");
      box.classList.remove("is-pending");
      box.classList.add("is-in");
      try { sessionStorage.setItem("fmpb-hero-intro", "1"); } catch (e) {}
      setTimeout(function () { bg.classList.add("is-off"); }, 1400);
    }

    function run() {
      if (started) return;
      started = true;
      imgs[0].classList.add("is-on");
      for (var i = 1; i < imgs.length; i++) {
        (function (i) {
          setTimeout(function () {
            imgs[i].classList.add("is-on");
            setTimeout(function () { imgs[i - 1].classList.remove("is-on"); }, FADE + 60);
          }, STEP * i);
        })(i);
      }
      setTimeout(finish, STEP * imgs.length);
    }

    function begin() {
      Promise.race([
        decoded(imgs[0]),
        new Promise(function (r) { setTimeout(r, 1200); })
      ]).then(function () { setTimeout(run, 520); });
    }
    if (document.body.classList.contains("is-loaded")) { begin(); }
    else { document.addEventListener("fmpb:loaded", begin, { once: true }); }

    setTimeout(function () { if (!started) { run(); } }, 4000);
    setTimeout(function () {
      bg.classList.add("is-off");
      box.classList.remove("is-pending");
      box.classList.add("is-in");
    }, 11000);
  })();

  /* ---------- GSAP setup ---------- */
  var hasGSAP = !!window.gsap;
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length > 1) {
          var target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -20 });
          }
        }
      });
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]:not([data-reveal-onload])");
  var revealTextEls = document.querySelectorAll("[data-reveal-text]:not([data-reveal-onload])");

  /* Elements marked data-reveal-onload sit below the fold in the layout
     (e.g. behind a tall hero image) but should still animate in with the
     page load instead of waiting for the visitor to scroll to them. */
  var loadRevealEls = document.querySelectorAll("[data-reveal][data-reveal-onload]");
  var loadRevealTextEls = document.querySelectorAll("[data-reveal-text][data-reveal-onload]");
  if ((loadRevealEls.length || loadRevealTextEls.length)) {
    if (hasGSAP && !reduceMotion) {
      var playLoadReveals = function () {
        loadRevealEls.forEach(function (el) {
          gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
        });
        loadRevealTextEls.forEach(function (el) {
          gsap.fromTo(el, { opacity: 0, y: "100%" }, { opacity: 1, y: "0%", duration: 1, ease: "power3.out" });
        });
      };
      if (document.body.classList.contains("is-loaded")) {
        playLoadReveals();
      } else {
        document.addEventListener("fmpb:loaded", playLoadReveals, { once: true });
      }
    } else {
      loadRevealEls.forEach(function (el) { el.style.opacity = 1; });
      loadRevealTextEls.forEach(function (el) { el.style.opacity = 1; });
    }
  }

  /* ---------- Reveal-Stile: jede Section kann eine eigene Bewegung bekommen ---------- */
  var FX = {
    rise:    [{ opacity: 0, y: 30 },                          { y: 0 },                       0.9],
    drop:    [{ opacity: 0, y: -18 },                         { y: 0 },                       0.7],
    fade:    [{ opacity: 0 },                                 {},                             1.1],
    calm:    [{ opacity: 0, y: 8 },                           { y: 0 },                       1.35],
    pop:     [{ opacity: 0, y: 16, scale: 0.94 },             { y: 0, scale: 1 },             0.8],
    inleft:  [{ opacity: 0, x: -44 },                         { x: 0 },                       0.9],
    inright: [{ opacity: 0, x: 44 },                          { x: 0 },                       0.9],
    wipe:    [{ opacity: 1, clipPath: "inset(0 0 105% 0)" },  { clipPath: "inset(0 0 0% 0)" }, 1.0],
    grow:    [{ opacity: 0, scale: 0.9 },                     { scale: 1 },                   1.0]
  };
  function setFx(sel, name, stagger) {
    var list = document.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) {
      list[i].setAttribute("data-fx", name);
      if (stagger) list[i].setAttribute("data-fx-delay", (i * stagger).toFixed(2));
    }
  }
  setFx("#jetzt .eyebrow", "drop");
  setFx("#jetzt h2", "wipe");
  setFx(".jetzt__lead", "fade");
  setFx(".jetzt__name", "calm");
  setFx("#jetzt .media-frame", "grow");
  setFx("#warum .eyebrow", "drop");
  setFx("#warum h2", "wipe");
  setFx(".warum__lead", "fade");
  setFx(".warum__ask", "calm");
  setFx(".warum__door", "calm");
  setFx(".warum__claim", "pop");
  setFx("#rechne .eyebrow", "drop");
  setFx("#rechne h2", "wipe");
  setFx(".rk__lead, .rk__fine, .rk__close", "fade");
  setFx(".rk__chips, .rk__meter", "pop");
  setFx("#haltung .eyebrow", "drop");
  setFx(".manifesto__statement", "fade");
  setFx(".manifesto__text", "fade");
  setFx(".manifesto__mission", "calm");
  setFx(".compare .eyebrow", "drop");
  setFx(".compare h2", "wipe");
  setFx(".compare__card:not(.compare__card--accent)", "inleft");
  setFx(".compare__card--accent", "inright");
  setFx(".compare__arrow", "pop");
  setFx(".compare__aug, .compare__footnote", "fade");
  setFx("#weg .eyebrow", "drop");
  setFx("#weg h2", "wipe");
  setFx(".philo", "fade");
  setFx(".philo__not", "calm");
  setFx(".pillar", "pop", 0.12);
  setFx(".fit .fit__grid > div:first-child", "inleft");
  setFx(".fit .fit__grid > div:last-child", "inright");
  setFx(".realitycheck__statement", "calm");
  setFx(".realitycheck__text", "fade");
  setFx("#cta .eyebrow", "drop");
  setFx(".cta__headline", "wipe");
  setFx(".cta__self", "calm");
  setFx(".club-box", "pop");
  /* Die Idee */
  setFx(".idee-hero h1, .idee-hero__text", "fade");
  setFx(".idee-hero__img", "grow");
  setFx(".timeline h2, .weg-story h2, .arbeit h2, .glaube h2", "wipe");
  setFx(".tl", "inleft", 0.10);
  setFx(".weg-story__inner > p", "rise");
  setFx(".weg-story__inner > p:nth-of-type(even)", "inleft");
  setFx(".big-quote", "wipe");
  setFx(".weg-story__brand", "pop");
  setFx(".weg-story__lead", "pop");
  setFx(".weg-story__media", "inleft");
  setFx(".arbeit__text p", "rise");
  setFx(".arbeit__quote", "pop");
  setFx(".glaube .pillar", "pop", 0.14);
  /* Julia & Stephie */
  setFx(".team-hero h1", "wipe");
  setFx(".team-hero__sub", "fade");
  setFx(".team__grid > .team-card:first-child", "inleft");
  setFx(".team__grid > .team-card:last-child", "inright");
  setFx(".team-card__quote", "calm");
  setFx(".team-together__inner > *", "fade");
  setFx(".plan-a h2, .team-together h2", "wipe");
  setFx(".team-card__portrait", "grow");
  setFx(".plan-a__text > p", "calm");
  setFx(".duo > div", "pop", 0.12);
  setFx(".duo-lines p", "calm");
  setFx(".team-together__closing", "pop");
  /* Plan B Post */
  setFx(".pbcard", "grow");
  setFx("form, .nl-form", "pop");
  setFx(".nl-hero__lead", "fade");
  setFx(".nl-from", "calm");
  setFx(".nl-list li", "inleft", 0.10);
  setFx(".club-mini__grid > div:first-child", "inleft");
  setFx(".club-mini__card", "inright");

  function playFx(el, fallback, startAt) {
    var name = el.getAttribute("data-fx") || fallback;
    var f = FX[name] || FX[fallback];
    var to = {};
    for (var k in f[1]) to[k] = f[1][k];
    to.opacity = 1;
    to.duration = f[2];
    to.ease = "power3.out";
    to.delay = parseFloat(el.getAttribute("data-fx-delay")) || 0;
    to.scrollTrigger = { trigger: el, start: "top " + startAt };
    if (name === "wipe") to.clearProps = "clipPath";
    gsap.fromTo(el, f[0], to);
  }

  if (hasGSAP && window.ScrollTrigger && !reduceMotion) {
    revealEls.forEach(function (el) { playFx(el, "rise", "85%"); });
    revealTextEls.forEach(function (el) { playFx(el, "rise", "88%"); });

    /* Staggered list reveals: each direct child flies in one after
       another instead of the whole block fading in at once. */
    document.querySelectorAll("[data-reveal-stagger]").forEach(function (el) {
      var from = el.classList.contains("pain-list")
        ? { opacity: 0, x: -28, filter: "blur(4px)" }
        : { opacity: 0, y: 18 };
      var to = el.classList.contains("pain-list")
        ? { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out", stagger: 0.14, clearProps: "filter" }
        : { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.18 };
      to.scrollTrigger = { trigger: el, start: "top 85%" };
      gsap.fromTo(el.children, from, to);
    });

    /* Parallax layers */
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var strength = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      gsap.to(el, {
        yPercent: strength * 100,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  } else {
    // No animation library or reduced motion: show everything immediately.
    revealEls.forEach(function (el) { el.classList.add("is-visible"); el.style.opacity = 1; });
    revealTextEls.forEach(function (el) { el.classList.add("is-visible"); el.style.opacity = 1; });
  }

  /* ---------- Custom cursor (letter B) ---------- */
  var cursorB = document.getElementById("cursor-b");
  if (cursorB && !isTouch) {
    var bx = 0, by = 0, bcx = 0, bcy = 0;
    window.addEventListener("mousemove", function (e) { bx = e.clientX; by = e.clientY; });
    (function tick() {
      bcx += (bx - bcx) * 0.22;
      bcy += (by - bcy) * 0.22;
      var scale = cursorB.classList.contains("is-active") ? 1.3 : 1;
      cursorB.style.transform = "translate(" + bcx + "px," + bcy + "px) translate(-50%,-55%) scale(" + scale + ")";
      requestAnimationFrame(tick);
    })();
    document.querySelectorAll("a, button, [data-magnetic]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursorB.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { cursorB.classList.remove("is-active"); });
    });
  } else if (cursorB) {
    cursorB.style.display = "none";
  }

  /* ---------- Magnetic buttons (subtle hover pull) ---------- */
  if (!isTouch && hasGSAP && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mouseleave", function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var relX = e.clientX - rect.left - rect.width / 2;
        var relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: relX * 0.25, y: relY * 0.25, duration: 0.3, ease: "power2.out" });
      });
    });
  }

  /* ---------- Newsletter form: Alfima embed (loads only after consent) ---------- */
  (function () {
    var wrap = document.getElementById("alfima-embed");
    if (!wrap) return;
    var CONSENT_KEY = "fmpb-cookie-consent";
    var src = wrap.getAttribute("data-embed-src");
    var loaded = false;

    function injectEmbed() {
      if (loaded) return;
      loaded = true;
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.style.width = "100%";
      iframe.style.border = "none";
      iframe.style.minHeight = "400px";
      iframe.title = "Lead Form";
      wrap.innerHTML = "";
      wrap.appendChild(iframe);

      var allowedOrigin = new URL(src).origin;
      window.addEventListener("message", function (e) {
        if (e.origin !== allowedOrigin) return;
        if (!e.data || typeof e.data.type !== "string") return;
        if (e.data.type === "alfima-embed-resize") {
          iframe.style.height = e.data.height + "px";
        } else if (e.data.type === "alfima-embed-redirect") {
          var url = e.data.url;
          if (typeof url === "string" && /^https?:\/\//.test(url)) {
            window.top.location.href = url;
          }
        }
      });
    }

    var consent = null;
    try { consent = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (consent === "all") {
      injectEmbed();
    } else {
      var loadBtn = document.getElementById("alfima-embed-load");
      if (loadBtn) {
        loadBtn.addEventListener("click", function () {
          try { localStorage.setItem(CONSENT_KEY, "all"); } catch (e) {}
          var banner = document.getElementById("cookie-banner");
          if (banner) banner.classList.remove("is-visible");
          injectEmbed();
        });
      }
    }
  })();

  /* ---------- Sticky header state ---------- */
  (function () {
    var h = document.querySelector(".site-header");
    if (!h) return;
    function upd() { h.classList.toggle("is-stuck", window.scrollY > 40); }
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    var nav = h.querySelector(".nav");
    if (nav && "MutationObserver" in window) {
      new MutationObserver(function () {
        h.classList.toggle("nav-open", nav.classList.contains("is-open"));
      }).observe(nav, { attributes: true, attributeFilter: ["class"] });
    }
  })();

  /* ---------- Zahlen-Karten: hochzählende Werte (Startseite) ---------- */
  (function () {
    var nums = document.querySelectorAll(".proof__num[data-count]");
    if (!nums.length) return;
    function run(el) {
      var target = +el.dataset.count, suffix = el.dataset.suffix || "", start = null, dur = 1100;
      if (reduceMotion) { el.textContent = target + suffix; return; }
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- Fakten-Karten: Münzen/Figuren erst bei Sichtbarkeit animieren ---------- */
  (function () {
    var cards = document.querySelectorAll("[data-fact]");
    if (!cards.length) return;
    if (!("IntersectionObserver" in window)) { cards.forEach(function (c) { c.classList.add("is-on"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-on"); io.unobserve(e.target); } });
    }, { threshold: 0.35 });
    cards.forEach(function (c) { io.observe(c); });
  })();

  /* ---------- Zwischenbänder: Text schärft sich beim Scrollen ein ---------- */
  (function () {
    var els = [].slice.call(document.querySelectorAll("[data-devo]"));
    if (!els.length) return;
    if (reduceMotion) { els.forEach(function (e) { e.style.setProperty("--p", 1); }); return; }
    var running = false;
    function tick() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var start = vh * 0.92, end = vh * 0.28;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = (start - r.top) / (start - end);
        p = p < 0 ? 0 : (p > 1 ? 1 : p);
        el.style.setProperty("--p", p.toFixed(3));
      });
      running = false;
    }
    function req() { if (!running) { running = true; requestAnimationFrame(tick); } }
    els.forEach(function (e) { e.style.setProperty("--p", 0); });
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    req();
  })();

  /* ---------- Rechne mal nach: Stundenrechner ---------- */
  (function () {
    var wrap = document.getElementById("rkChips");
    if (!wrap) return;
    var chips = [].slice.call(wrap.querySelectorAll(".rk__chip"));
    var eH = document.getElementById("rkH"), eD = document.getElementById("rkD"), eM = document.getElementById("rkM");
    var punch = document.getElementById("rkPunch");
    var pD = document.getElementById("rkPunchD");
    var pW = document.getElementById("rkPunchW");
    function count(el, to) {
      if (reduceMotion) { el.textContent = to; return; }
      var from = parseFloat(el.textContent) || 0, t0 = null, dur = 420;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur); p = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * p);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function calc() {
      var h = 0;
      chips.forEach(function (c) { if (c.getAttribute("aria-pressed") === "true") h += parseFloat(c.dataset.h); });
      count(eH, h);
      /* Gerechnet in Arbeitstagen: 8 Stunden = 1 Arbeitstag,
         21,7 Arbeitstage = 1 Arbeitsmonat (Vollzeit). */
      var jahr = h * 52;
      var tage = Math.round(jahr / 8);
      count(eD, tage);
      count(eM, Math.round(jahr * 10 / 8 / 21.7));
      if (pD) { count(pD, tage); }
      if (pW) { pW.textContent = (tage === 1 ? "unbezahlter Arbeitstag" : "unbezahlte Arbeitstage"); }
      punch.classList.toggle("is-on", h > 0);
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true");
        calc();
      });
    });
    var resetBtn = document.getElementById("rkReset");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      calc();
    });
  })();

  /* ---------- Plan B Club: Popup vor dem WhatsApp-Absprung ---------- */
  (function () {
    var m = document.getElementById("club-modal");
    if (!m) return;
    function open() {
      var promo = document.getElementById("promo-modal");
      if (promo) promo.classList.remove("is-visible");
      m.classList.add("is-visible");
    }
    function close() { m.classList.remove("is-visible"); }
    document.addEventListener("click", function (e) {
      if (!e.target || !e.target.closest) return;
      var t = e.target.closest("[data-club-open]");
      if (t) { e.preventDefault(); open(); return; }
      var a = e.target.closest('a[href*="chat.whatsapp.com"]');
      if (a && !a.closest(".promo-modal")) { e.preventDefault(); open(); }
    }, true);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (!e.target || !e.target.closest) return;
      if (e.target.closest("[data-club-open]")) { e.preventDefault(); open(); }
    });
    var cb = document.getElementById("club-modal-close");
    if (cb) cb.addEventListener("click", close);
    m.querySelectorAll("[data-club-dismiss]").forEach(function (el) { el.addEventListener("click", close); });
    m.querySelectorAll("a").forEach(function (el) { el.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  })();

  /* ---------- Newsletter-Demoformular (Plan B Post, Platzhalter ohne Alfima-Iframe) ---------- */
  (function () {
    var f = document.getElementById("nlForm");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = document.getElementById("nlError");
      if (!f.vorname.value.trim()) { err.textContent = "Bitte gib deinen Vornamen ein."; f.vorname.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())) { err.textContent = "Bitte gib eine gültige E-Mail-Adresse ein."; f.email.focus(); return; }
      if (!f.consent.checked) { err.textContent = "Bitte bestätige, dass du die Plan B Post erhalten möchtest."; return; }
      err.textContent = "";
      f.hidden = true;
      document.getElementById("nlSuccess").hidden = false;
    });
  })();

  /* ---------- Mobile nav toggle ---------- */
  document.querySelectorAll(".nav-toggle").forEach(function (btn) {
    var nav = btn.parentElement.querySelector(".nav");
    if (!nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "✕" : "☰";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "☰";
      });
    });
  });

  /* ---------- Cookie banner ---------- */
  (function () {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    var STORAGE_KEY = "fmpb-cookie-consent";
    var already = null;
    try { already = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!already) {
      setTimeout(function () { banner.classList.add("is-visible"); }, 1200);
    }
    function setConsent(value) {
      try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
      banner.classList.remove("is-visible");
    }
    var btnNecessary = document.getElementById("cookie-necessary");
    var btnAll = document.getElementById("cookie-all");
    if (btnNecessary) btnNecessary.addEventListener("click", function () { setConsent("necessary"); });
    if (btnAll) btnAll.addEventListener("click", function () { setConsent("all"); });
  })();

  /* ---------- Promo modal (WhatsApp reminder) ----------
     Homepage: nach 1:10 Minuten. Unterseiten: nach 1:15 Minuten.
     Wer wirklich beigetreten ist, sieht es nie wieder (auf keiner Seite).
     Wer nur wegklickt, sieht es maximal 3x pro Browser-Sitzung. */
  (function () {
    var modal = document.getElementById("promo-modal");
    if (!modal) return;
    var JOINED = "fmpb-club-joined";
    var COUNT = "fmpb-promo-count";
    var MAX = 3;
    var DELAY = document.querySelector(".hero") ? 70000 : 75000;

    function joined() {
      try { return localStorage.getItem(JOINED) === "1"; } catch (e) { return false; }
    }
    function markJoined() {
      try { localStorage.setItem(JOINED, "1"); } catch (e) {}
    }
    function hide() { modal.classList.remove("is-visible"); }

    document.addEventListener("click", function (e) {
      if (!e.target || !e.target.closest) return;
      var a = e.target.closest('a[href*="chat.whatsapp.com"]');
      if (!a) return;
      if (!a.closest(".promo-modal") && !a.closest(".club-modal")) return;
      markJoined();
      hide();
    }, true);

    var shown = 0;
    try { shown = parseInt(sessionStorage.getItem(COUNT) || "0", 10) || 0; } catch (e) {}

    if (!joined() && shown < MAX) {
      setTimeout(function () {
        if (joined()) return;
        modal.classList.add("is-visible");
        try { sessionStorage.setItem(COUNT, String(shown + 1)); } catch (e) {}
      }, DELAY);
    }

    var closeBtn = document.getElementById("promo-modal-close");
    if (closeBtn) closeBtn.addEventListener("click", hide);
    modal.querySelectorAll("[data-promo-dismiss]").forEach(function (el) {
      el.addEventListener("click", hide);
    });
    modal.querySelectorAll("a").forEach(function (el) {
      el.addEventListener("click", hide);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });
  })();

  /* ---------- Zeitstrahl (Die Idee): Linie füllt sich beim Scrollen ---------- */
  (function () {
    var tl = document.querySelector(".tl");
    if (!tl) return;
    var items = [].slice.call(tl.children);
    if (!items.length) return;

    if (reduceMotion) {
      tl.style.setProperty("--tlp", 1);
      items.forEach(function (li) { li.classList.add("is-done"); });
      return;
    }

    var stops = [];
    function measure() {
      var vertical = items.length > 1 && items[1].offsetTop > items[0].offsetTop + 5;
      stops = items.map(function (li) {
        var t;
        if (vertical) {
          t = (li.offsetTop + 13) / Math.max(1, tl.offsetHeight);
        } else {
          var center = (li.offsetLeft + li.offsetWidth / 2) / Math.max(1, tl.offsetWidth);
          t = (center - 0.08) / 0.84;
        }
        return Math.max(0, Math.min(1, t));
      });
      /* Ab dem letzten Punkt laeuft die Linie in Gold weiter. */
      tl.style.setProperty("--tlend", (stops[stops.length - 1] * 100).toFixed(2) + "%");
    }

    var running = false;
    function tick() {
      running = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var r = tl.getBoundingClientRect();
      var span = Math.max(r.height, vh * 0.7);
      var p = (vh * 0.78 - r.top) / span;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      tl.style.setProperty("--tlp", Math.min(p, stops[stops.length - 1]).toFixed(3));
      for (var i = 0; i < items.length; i++) {
        items[i].classList.toggle("is-done", p >= stops[i] - 0.015);
      }
    }
    function onScroll() {
      if (running) return;
      running = true;
      requestAnimationFrame(tick);
    }

    measure();
    tl.style.setProperty("--tlp", 0);
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { measure(); onScroll(); });
  })();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
