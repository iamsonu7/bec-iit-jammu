/* ==========================================================================
   BEC — Budding Entrepreneurs' Club, IIT Jammu
   Site behaviour: navigation, link wiring, reveals, counters, filters,
   accordion, forms, back-to-top.
   No dependencies. Safe to load with `defer`.
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = window.BEC_CONFIG || { links: {}, handbooks: {}, contact: {}, socials: {} };
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ======================================================================
     1. Mobile navigation drawer
     ====================================================================== */
  function initNav() {
    var toggle = $(".nav__toggle");
    var menu   = $(".nav__menu");
    var scrim  = $(".nav__scrim");
    var header = $(".site-header");
    if (!toggle || !menu) return;

    var lastFocused = null;

    function isOpen() { return toggle.getAttribute("aria-expanded") === "true"; }

    function open() {
      lastFocused = document.activeElement;
      toggle.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      if (scrim) scrim.classList.add("is-open");
      document.body.classList.add("nav-open");
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    }

    function close(returnFocus) {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      if (scrim) scrim.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      if (returnFocus !== false) {
        (lastFocused && document.contains(lastFocused) ? lastFocused : toggle).focus();
      }
    }

    toggle.addEventListener("click", function () { isOpen() ? close() : open(); });
    if (scrim) scrim.addEventListener("click", function () { close(); });

    // Close after tapping a link in the drawer
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && isOpen()) close(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) close();
      if (e.key !== "Tab" || !isOpen()) return;

      // Trap focus inside the drawer while it is open
      var items = $$("a, button", menu).concat([toggle]).filter(function (el) {
        return el.offsetParent !== null || el === toggle;
      });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Reset when resizing back up to desktop
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 900 && isOpen()) close(false);
      }, 140);
    });

    // Sticky-header shadow
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ======================================================================
     2. Active nav link for the current page
     ====================================================================== */
  function initActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    $$(".nav__link").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop().split("#")[0];
      if (!href) return;
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ======================================================================
     3. Link wiring — reads every URL from config.js
        Markup:  <a data-bec-link="joinBec">        (CONFIG.links)
                 <a data-bec-handbook="starterKit"> (CONFIG.handbooks)
                 <a data-bec-social="instagram">    (CONFIG.socials)
     ====================================================================== */
  function resolve(el) {
    var k;
    if ((k = el.getAttribute("data-bec-link")))     return (CONFIG.links || {})[k];
    if ((k = el.getAttribute("data-bec-handbook"))) return (CONFIG.handbooks || {})[k];
    if ((k = el.getAttribute("data-bec-social")))   return (CONFIG.socials || {})[k];
    return undefined;
  }

  function initLinks() {
    var nodes = $$("[data-bec-link], [data-bec-handbook], [data-bec-social]");

    nodes.forEach(function (el) {
      var url = resolve(el);
      var live = typeof url === "string" && url.trim() !== "" && url.trim() !== "#";

      if (live) {
        el.setAttribute("href", url.trim());
        el.removeAttribute("data-placeholder");
        if (/^https?:\/\//i.test(url.trim())) {
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener noreferrer");
        }
      } else {
        el.setAttribute("href", "#");
        el.setAttribute("data-placeholder", "true");
      }

      // Update the status label inside this card only (never a global lookup)
      var scope = el.closest(".flagship, .handbook, .card");
      var state = scope ? scope.querySelector(".link-state") : null;
      if (state && (el.hasAttribute("data-bec-link") || el.hasAttribute("data-bec-handbook"))) {
        state.setAttribute("data-state", live ? "live" : "pending");
        state.textContent = live ? "Link is live" : "Link coming soon";
      }
    });

    // Intercept clicks on links that have no URL yet
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[data-placeholder="true"]');
      if (!a) return;
      e.preventDefault();
      showToast(CONFIG.placeholderMessage || "This link isn’t live yet — check back soon.");
    });
  }

  /* ======================================================================
     4. Contact details from config
     ====================================================================== */
  function initContactDetails() {
    var email = (CONFIG.contact || {}).email;
    if (email) {
      $$("[data-bec-email]").forEach(function (el) {
        el.textContent = email;
        if (el.tagName === "A") el.setAttribute("href", "mailto:" + email);
      });
      $$("[data-bec-mailto]").forEach(function (el) {
        el.setAttribute("href", "mailto:" + email);
      });
    }
    var address = (CONFIG.contact || {}).address;
    if (address) {
      $$("[data-bec-address]").forEach(function (el) {
        el.textContent = address;
        el.style.whiteSpace = "pre-line";
      });
    }
  }

  /* ======================================================================
     5. Toast
     ====================================================================== */
  var toastTimer;
  function showToast(message) {
    var toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/>' +
        '<path d="M12 16v-4M12 8h.01"/></svg><span></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector("span").textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 4600);
  }

  /* ======================================================================
     6. Scroll reveal
     ====================================================================== */
  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;

    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { el.classList.add("is-in"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     7. Animated counters
     ====================================================================== */
  function initCounters() {
    var nums = $$("[data-count]");
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var prefix = el.getAttribute("data-prefix") || "";
      if (isNaN(target)) return;

      if (REDUCED) { el.textContent = prefix + target + suffix; return; }

      var duration = 1500, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     8. Filters (events, team)
     ====================================================================== */
  function initFilters() {
    $$("[data-filter-group]").forEach(function (group) {
      var name    = group.getAttribute("data-filter-group");
      var buttons = $$(".filter-btn", group);
      var items   = $$('[data-filter-target="' + name + '"] > *');
      var empty   = $('[data-filter-empty="' + name + '"]');

      function apply(value) {
        var shown = 0;
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(/\s+/);
          var match = value === "all" || cats.indexOf(value) !== -1;
          item.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });
        if (empty) empty.classList.toggle("is-hidden", shown > 0);
      }

      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
          btn.setAttribute("aria-pressed", "true");
          apply(btn.getAttribute("data-filter") || "all");
        });
      });
    });
  }

  /* ======================================================================
     9. Live search (handbooks)
     ====================================================================== */
  function initSearch() {
    $$("[data-search-for]").forEach(function (input) {
      var name  = input.getAttribute("data-search-for");
      var items = $$('[data-search-target="' + name + '"] > *');
      var empty = $('[data-search-empty="' + name + '"]');

      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        var shown = 0;
        items.forEach(function (item) {
          var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });
        if (empty) empty.classList.toggle("is-hidden", shown > 0);
      });
    });
  }

  /* ======================================================================
     10. Accordion
     ====================================================================== */
  function initAccordion() {
    $$(".acc__btn").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.setAttribute("data-open", String(!open));
      });
    });
  }

  /* ======================================================================
     11. Contact form — validates, then hands off to the user's mail client
         (static hosting, so there is no server to post to)
     ====================================================================== */
  function initForm() {
    var form = $("[data-bec-form]");
    if (!form) return;

    function setError(field, message) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("has-error", Boolean(message));
      var slot = wrap.querySelector(".field__error");
      if (slot) slot.textContent = message || "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate(field) {
      var value = (field.value || "").trim();
      if (field.hasAttribute("required") && !value) {
        setError(field, "This field is required.");
        return false;
      }
      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(field, "Enter a valid email address.");
        return false;
      }
      if (field.name === "message" && value && value.length < 10) {
        setError(field, "Please add a little more detail (10+ characters).");
        return false;
      }
      setError(field, "");
      return true;
    }

    var fields = $$("input, select, textarea", form).filter(function (f) { return f.type !== "hidden"; });
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { validate(f); });
      f.addEventListener("input", function () {
        if (f.closest(".field") && f.closest(".field").classList.contains("has-error")) validate(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      fields.forEach(function (f) {
        if (!validate(f)) { ok = false; if (!firstBad) firstBad = f; }
      });
      if (!ok) {
        if (firstBad) firstBad.focus();
        showToast("Please fix the highlighted fields and try again.");
        return;
      }

      var data = new FormData(form);
      var email = (CONFIG.contact || {}).email || "bec@iitjammu.ac.in";
      var subject = "[BEC Website] " + (data.get("topic") || "Enquiry") + " — " + (data.get("name") || "");
      var body =
        "Name: "   + (data.get("name") || "")  + "\n" +
        "Email: "  + (data.get("email") || "") + "\n" +
        "Institute / Organisation: " + (data.get("org") || "—") + "\n" +
        "Topic: "  + (data.get("topic") || "") + "\n\n" +
        (data.get("message") || "");

      window.location.href = "mailto:" + email +
        "?subject=" + encodeURIComponent(subject) +
        "&body="    + encodeURIComponent(body);

      showToast("Opening your email app with the message ready to send.");
    });
  }

  /* ======================================================================
     12. Copy to clipboard
     ====================================================================== */
  function initCopy() {
    $$("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-copy");
        var text = key === "email" ? ((CONFIG.contact || {}).email || "") : key;
        if (!text) return;
        var done = function () {
          var original = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = original; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () { showToast(text); });
        } else {
          showToast(text);
        }
      });
    });
  }

  /* ======================================================================
     13. Back to top
     ====================================================================== */
  function initToTop() {
    var btn = $(".to-top");
    if (!btn) return;
    var onScroll = function () { btn.classList.toggle("is-visible", window.scrollY > 520); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    });
  }

  /* ======================================================================
     14. Current year in the footer
     ====================================================================== */
  function initYear() {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ====================================================================== */
  function init() {
    initNav();
    initActiveNav();
    initLinks();
    initContactDetails();
    initReveal();
    initCounters();
    initFilters();
    initSearch();
    initAccordion();
    initForm();
    initCopy();
    initToTop();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
