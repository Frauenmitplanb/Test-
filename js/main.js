/* ==========================================================
   Frauen mit Plan B — Interaction layer
   Preloader, smooth scroll, scroll reveals, text reveals,
   magnetic buttons, custom cursor. Respects prefers-reduced-motion.
   ========================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    if (window.gsap) {
      gsap.to(preloader.querySelector(".preloader__word"), {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out"
      });
      gsap.to(preloader, {
        opacity: 0, duration: 0.6, delay: 0.5, ease: "power2.inOut",
        onComplete: function () { preloader.style.display = "none"; }
      });
    } else {
      preloader.style.display = "none";
    }
  }
  window.addEventListener("load", function () {
    setTimeout(hidePreloader, reduceMotion ? 0 : 300);
  });

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

  /* ---------- Custom cursor + magnetic buttons ---------- */
  var cursor = document.getElementById("cursor");
  if (cursor && !isTouch) {
    var mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(tick);
    })();

    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-active");
        if (hasGSAP) gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
      if (hasGSAP && !reduceMotion) {
        el.addEventListener("mousemove", function (e) {
          var rect = el.getBoundingClientRect();
          var relX = e.clientX - rect.left - rect.width / 2;
          var relY = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, { x: relX * 0.3, y: relY * 0.3, duration: 0.3, ease: "power2.out" });
        });
      }
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
