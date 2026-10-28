/* ==========================================================================
   TEVO — Personal Portfolio — script.js
   Vanilla JS. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavbarScroll();
    initMobileNav();
    initActiveNavLink();
    initScrollReveal();
    initHeroParallax();
    initFaqAccordion();
    initContactForm();
    initCopyButtons();
    initSkillBars();
    initCategoryFilter();
    initYear();
  });

  /* ---- Loading experience ------------------------------------------------ */
  function initLoader() {
    var loader = document.querySelector('[data-loader]');
    if (!loader) return;
    var finish = function () {
      loader.classList.add('is-hidden');
    };
    if (document.readyState === 'complete') {
      setTimeout(finish, 250);
    } else {
      window.addEventListener('load', function () {
        setTimeout(finish, 250);
      });
      // Safety net: never block the page for more than ~1.8s
      setTimeout(finish, 1800);
    }
  }

  /* ---- Navbar background on scroll --------------------------------------- */
  function initNavbarScroll() {
    var nav = document.querySelector('[data-navbar]');
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile hamburger nav ------------------------------------------------ */
  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-mobile-nav]');
    if (!toggle || !panel) return;

    var close = function () {
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };
    var open = function () {
      toggle.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
      document.body.classList.add('nav-open');
    };

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---- Highlight current page in nav -------------------------------------- */
  function initActiveNavLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav-link]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      if (linkFile === path || (path === '' && linkFile === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  /* ---- Scroll reveal via IntersectionObserver ----------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Subtle hero parallax / cursor-follow glow -------------------------- */
  function initHeroParallax() {
    if (prefersReducedMotion || isTouch) return;
    var wrap = document.querySelector('[data-hero-parallax]');
    if (!wrap) return;

    var bounds = null;
    var raf = null;
    var targetX = 0, targetY = 0, curX = 0, curY = 0;

    var updateBounds = function () { bounds = wrap.getBoundingClientRect(); };
    updateBounds();
    window.addEventListener('resize', updateBounds);

    var loop = function () {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      wrap.style.transform = 'translate3d(' + curX + 'px,' + curY + 'px,0)';
      raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', function (e) {
      if (!bounds) updateBounds();
      var relX = (e.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
      var relY = (e.clientY - (bounds.top + bounds.height / 2)) / bounds.height;
      targetX = Math.max(-1, Math.min(1, relX)) * 14;
      targetY = Math.max(-1, Math.min(1, relY)) * 14;
    });

    raf = requestAnimationFrame(loop);
  }

  /* ---- FAQ accordion -------------------------------------------------------*/
  function initFaqAccordion() {
    var items = document.querySelectorAll('[data-faq-trigger]');
    if (!items.length) return;

    items.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';

        // Close siblings within the same list for a clean single-open accordion
        var list = btn.closest('[data-faq-list]');
        if (list) {
          list.querySelectorAll('[data-faq-trigger]').forEach(function (other) {
            if (other !== btn) {
              other.setAttribute('aria-expanded', 'false');
              var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
              if (otherPanel) otherPanel.style.maxHeight = null;
            }
          });
        }

        btn.setAttribute('aria-expanded', String(!expanded));
        if (panel) {
          panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
        }
      });
    });
  }



/* ---- Contact form with EmailJS ------------------------------------- */
function initContactForm() {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var status = form.querySelector('[data-form-status]');
  var submitBtn = form.querySelector('[type="submit"]');

  // Replace these two values with your actual EmailJS credentials.
  var EMAILJS_SERVICE_ID = 'service_b2471kj';
  var EMAILJS_TEMPLATE_ID = 'template_uqywjrk';
  var EMAILJS_PUBLIC_KEY = '2j29OAb54G4nCz-a-';

  if (typeof emailjs === 'undefined') {
    console.error('EmailJS SDK is not loaded.');
    if (status) {
      status.textContent = 'Email service is unavailable. Please try again later.';
      status.className = 'form-status is-error';
    }
    return;
  }

  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });

  function showError(field, message) {
    var wrap = field.closest('.field');
    if (!wrap) return;

    wrap.classList.add('has-error');

    var error = wrap.querySelector('.field-error');
    if (error) error.textContent = message;
  }

  function clearError(field) {
    var wrap = field.closest('.field');
    if (!wrap) return;

    wrap.classList.remove('has-error');

    var error = wrap.querySelector('.field-error');
    if (error) error.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;
    var fields = form.querySelectorAll('[required]');

    fields.forEach(function (field) {
      clearError(field);

      var value = field.value.trim();

      if (!value) {
        showError(field, 'This field is required.');
        valid = false;
        return;
      }

      if (field.type === 'email') {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
          showError(field, 'Enter a valid email address.');
          valid = false;
        }
      }
    });

    if (!valid) {
      if (status) {
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status is-error';
      }
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    if (status) {
      status.textContent = 'Sending your message...';
      status.className = 'form-status';
    }

    // Add the timestamp used by the EmailJS Contact Us template.
    var timeField = form.querySelector('[name="time"]');

    if (!timeField) {
      timeField = document.createElement('input');
      timeField.type = 'hidden';
      timeField.name = 'time';
      form.appendChild(timeField);
    }

    timeField.value = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      form
    )
    .then(function () {
      if (status) {
        status.textContent =
          'Message sent successfully! Thank you for reaching out.';
        status.className = 'form-status is-success';
      }

      form.reset();

      form.querySelectorAll('.field').forEach(function (wrap) {
        wrap.classList.remove('has-error');
      });
    })
    .catch(function (error) {
      console.error('EmailJS contact form error:', error);

      if (status) {
        status.textContent =
          'Unable to send your message right now. Please try again or email me directly.';
        status.className = 'form-status is-error';
      }
    })
    .finally(function () {
      if (submitBtn) submitBtn.disabled = false;
    });
  });
}

    
  /* ---- Copy-to-clipboard buttons (email etc.) ------------------------------*/
  function initCopyButtons() {
    var buttons = document.querySelectorAll('[data-copy]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-copy');
        var restore = btn.textContent;
        var done = function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = restore; }, 1600);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done).catch(function () {
            fallbackCopy(value);
            done();
          });
        } else {
          fallbackCopy(value);
          done();
        }
      });
    });

    function fallbackCopy(value) {
      var tmp = document.createElement('textarea');
      tmp.value = value;
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand('copy'); } catch (err) { /* no-op */ }
      document.body.removeChild(tmp);
    }
  }

  /* ---- Animate skill bars into view (About page) ---------------------------*/
  function initSkillBars() {
    var bars = document.querySelectorAll('[data-skill-fill]');
    if (!bars.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      bars.forEach(function (bar) { bar.style.width = bar.getAttribute('data-skill-fill') + '%'; });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          bar.style.width = bar.getAttribute('data-skill-fill') + '%';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  /* ---- Projects page category filter ---------------------------------------*/
  function initCategoryFilter() {
    var buttons = document.querySelectorAll('[data-filter]');
    var groups = document.querySelectorAll('[data-category]');
    if (!buttons.length || !groups.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var filter = btn.getAttribute('data-filter');

        groups.forEach(function (group) {
          var match = filter === 'all' || group.getAttribute('data-category') === filter;
          group.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---- Footer year ---------------------------------------------------------*/
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }
})();

document.querySelectorAll(".case-section-video").forEach((wrapper) => {
  const video = wrapper.querySelector("video");
  const playButton = wrapper.querySelector(".case-video-play");

  if (!video || !playButton) return;

  playButton.addEventListener("click", () => {
    if (video.paused) {
      video.controls = true;
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => {
    playButton.classList.add("is-hidden");
    video.controls = true;
  });

  video.addEventListener("pause", () => {
    playButton.classList.remove("is-hidden");
    video.controls = false;
  });

  video.addEventListener("ended", () => {
    playButton.classList.remove("is-hidden");
    video.controls = false;
  });
})();


/* ========================================
   TEVO — Interactive Word Highlight
======================================== */

document.querySelectorAll(".tevo-philosophy").forEach((section) => {
  
  const words = [...section.querySelectorAll(".tevo-word")];

  if (!words.length) return;

  const setActiveWord = (activeWord) => {
    words.forEach((word) => {
      const isActive = word === activeWord;

      word.classList.toggle("is-active", isActive);
      word.setAttribute("aria-pressed", String(isActive));
    });
  };

  words.forEach((word) => {
    // Follow the pointer inside each word.
    word.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const rect = word.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      word.style.setProperty("--pointer-x", `${x}%`);
      word.style.setProperty("--pointer-y", `${y}%`);
    });

    // Highlight while hovering.
    word.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;

      setActiveWord(word);
    });

    word.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;

      setActiveWord(null);
    });

    // Support touch, click and keyboard activation.
    word.addEventListener("click", () => {
      const isAlreadyActive = word.classList.contains("is-active");

      setActiveWord(isAlreadyActive ? null : word);
    });

    word.addEventListener("focus", () => {
      setActiveWord(word);
    });

    word.addEventListener("blur", () => {
      setActiveWord(null);
    });
  });
  
});