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

    /* Staggered list reveals: each direct child flies in one after
       another instead of the whole block fading in at once. */
    document.querySelectorAll("[data-reveal-stagger]").forEach(function (el) {
      gsap.fromTo(el.children,
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.18,
          scrollTrigger: { trigger: el, start: "top 85%" }
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

  /* ---------- Promo modal (WhatsApp reminder, ~45s after load) ---------- */
  (function () {
    var modal = document.getElementById("promo-modal");
    if (!modal) return;
    var STORAGE_KEY = "fmpb-promo-modal-seen";
    var already = null;
    try { already = sessionStorage.getItem(STORAGE_KEY); } catch (e) {}
    function closeModal() {
      modal.classList.remove("is-visible");
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
    }
    if (!already) {
      setTimeout(function () {
        try { already = sessionStorage.getItem(STORAGE_KEY); } catch (e) {}
        if (!already) modal.classList.add("is-visible");
      }, 45000);
    }
    var closeBtn = document.getElementById("promo-modal-close");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.querySelectorAll("[data-promo-dismiss]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    modal.querySelectorAll("a").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  })();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
