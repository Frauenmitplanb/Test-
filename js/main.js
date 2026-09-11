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
    if (!preloader || preloaderHidden) return;
    preloaderHidden = true;
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
  var revealEls = document.querySelectorAll("[data-reveal]");
  var revealTextEls = document.querySelectorAll("[data-reveal-text]");

  if (hasGSAP && window.ScrollTrigger && !reduceMotion) {
    revealEls.forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });

    revealTextEls.forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: "100%" },
        {
          opacity: 1, y: "0%", duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" }
        }
      );
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

  /* ---------- Newsletter form (demo — no backend wired up yet) ---------- */
  var form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      if (status) {
        status.textContent = "Demo-Formular: Es ist noch kein echtes Postfach angebunden. Bitte nutze aktuell die WhatsApp-Community.";
      }
    });
  }

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

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
