/**
 * AuraVilla main application script:
 * - Property catalog filtering, sorting, and localized rendering
 * - Hero quick-search sync
 * - Accessible property detail modal with focus trap
 * - Mobile drawer, sticky header, scroll-to-top, and reveal animations
 * - Contact/viewing inquiry validation
 */
(() => {
  const PROPERTIES = [
    {
      id: "solstice-cliff-villa",
      type: "villa",
      beds: 5,
      baths: 6,
      area: 680,
      badge: "signature",
      featured: true,
      image: "assets/images/property-cliffside.png",
      fallback: {
        title: "Solstice Cliffside Villa",
        location: "Coastal Ridge Enclave",
        price: "Upon Inquiry",
        badge: "Signature",
        summary:
          "Cantilevered oceanfront villa with double-height glazing, infinity pool, and seamless indoor-outdoor limestone terraces.",
        description:
          "Designed around uninterrupted coastal light, Solstice Cliffside Villa pairs monolithic white concrete planes with warm oak joinery and floor-to-ceiling low-iron glass.",
        features: [
          "22-meter heated saltwater infinity pool",
          "Double-height ocean-view great room",
          "Private wellness suite with sauna & plunge",
        ],
      },
    },
    {
      id: "courtyard-travertine-house",
      type: "house",
      beds: 4,
      baths: 4,
      area: 460,
      badge: "new",
      featured: true,
      image: "assets/images/property-courtyard.png",
      fallback: {
        title: "Courtyard Travertine House",
        location: "Botanical Reserve District",
        price: "Upon Inquiry",
        badge: "New Listing",
        summary:
          "Minimalist modern house organized around a tranquil reflection pond, oak timber louvers, and natural stone galleries.",
        description:
          "Built for quiet privacy in a lush residential enclave, this architectural house frames an interior reflection courtyard at its heart.",
        features: [
          "Central reflection pond & Zen garden courtyard",
          "Honed Roman travertine facade & flooring",
          "3-car subterranean gallery garage",
        ],
      },
    },
    {
      id: "pinecrest-glass-pavilion",
      type: "villa",
      beds: 4,
      baths: 5,
      area: 540,
      badge: "signature",
      featured: true,
      image: "assets/images/property-hillside.png",
      fallback: {
        title: "Pinecrest Glass Pavilion",
        location: "Highland Forest Sanctuary",
        price: "Upon Inquiry",
        badge: "Signature",
        summary:
          "Elevated hillside glass pavilion suspended among mature pines with a wrap-around timber deck and fireplace lounge.",
        description:
          "Anchored into a gentle wooded slope, Pinecrest Glass Pavilion floats quietly above the canopy with expansive structural glass walls.",
        features: [
          "Panoramic 270-degree hillside glass facade",
          "Cantilevered teak & limestone viewing deck",
          "Geothermal radiant floor heating",
        ],
      },
    },
    {
      id: "skyline-aura-penthouse",
      type: "penthouse",
      beds: 3,
      baths: 4,
      area: 390,
      badge: "limited",
      featured: false,
      image: "assets/images/property-penthouse.png",
      fallback: {
        title: "Skyline Aura Penthouse",
        location: "Central Waterfront Tower",
        price: "Upon Inquiry",
        badge: "Private Release",
        summary:
          "Full-floor sky villa featuring a private sunken terrace lounge, reflective water court, and 360-degree horizon views.",
        description:
          "Occupying the entire crown of an architectural landmark, Skyline Aura Penthouse brings villa-scale proportions to elevated urban living.",
        features: [
          "Private direct-keyed elevator lobby",
          "Landscaped wrap-around sky terrace & sunken lounge",
          "24/7 concierge & private climate-controlled storage",
        ],
      },
    },
    {
      id: "horizon-infinity-estate",
      type: "villa",
      beds: 6,
      baths: 7,
      area: 820,
      badge: "signature",
      featured: true,
      image: "assets/images/hero-villa.png",
      fallback: {
        title: "Horizon Infinity Estate",
        location: "Peninsula South Shore",
        price: "Upon Inquiry",
        badge: "Signature",
        summary:
          "Twilight-oriented contemporary estate featuring twin guest pavilions, sculptural water mirror, and private garden lawn.",
        description:
          "Conceived as a multi-generational compound, Horizon Infinity Estate pairs a dramatic main residence with two independent guest pavilions.",
        features: [
          "Main residence plus two detached guest pavilions",
          "Outdoor summer kitchen & pergola dining terrace",
          "Solar-integrated roof & rainwater harvesting",
        ],
      },
    },
    {
      id: "atrium-minimal-residence",
      type: "house",
      beds: 4,
      baths: 4,
      area: 420,
      badge: "new",
      featured: false,
      image: "assets/images/interior-living.png",
      fallback: {
        title: "Atrium Minimal Residence",
        location: "Heritage Park Avenue",
        price: "Upon Inquiry",
        badge: "New Listing",
        summary:
          "Double-height interior sanctuary with a monolithic travertine fireplace, slatted oak ceiling, and private garden sanctuary.",
        description:
          "Combining urban convenience with serene residential proportions, Atrium Minimal Residence centers on a sunlit double-height living atrium.",
        features: [
          "Double-height sunlit living atrium",
          "Monolithic travertine fireplace centerpiece",
          "Private landscaped rear garden & plunge pool",
        ],
      },
    },
  ];

  const state = {
    type: "all",
    minBeds: 0,
    sort: "featured",
    activeModalId: null,
    lastFocusedEl: null,
    inquirySubmitted: false,
  };

  function tr(key, fallback = "") {
    if (window.AuraI18n && typeof window.AuraI18n.t === "function") {
      const value = window.AuraI18n.t(key, fallback);
      if (value !== key) return value;
    }
    return fallback || key;
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function getFilteredProperties() {
    const filtered = PROPERTIES.filter((item) => {
      const matchType = state.type === "all" || item.type === state.type;
      const matchBeds = item.beds >= state.minBeds;
      return matchType && matchBeds;
    });

    const sorted = [...filtered];
    if (state.sort === "areaDesc") {
      sorted.sort((a, b) => b.area - a.area);
    } else if (state.sort === "bedsDesc") {
      sorted.sort((a, b) => b.beds - a.beds || b.area - a.area);
    } else {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }

  function renderProperties() {
    const grid = document.getElementById("properties-grid");
    const emptyEl = document.getElementById("properties-empty");
    if (!grid || !emptyEl) return;

    const list = getFilteredProperties();
    grid.innerHTML = "";

    if (list.length === 0) {
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    const bedsLabel = tr("properties.specs.beds", "Beds");
    const bathsLabel = tr("properties.specs.baths", "Baths");
    const areaUnit = tr("properties.specs.area", "m²");
    const ctaText = tr("properties.viewDetails", "View Residence");

    list.forEach((item) => {
      const base = `properties.items.${item.id}`;
      const title = tr(`${base}.title`, item.fallback.title);
      const location = tr(`${base}.location`, item.fallback.location);
      const price = tr(`${base}.price`, item.fallback.price);
      const summary = tr(`${base}.summary`, item.fallback.summary);
      const badgeText = tr(
        `properties.badges.${item.badge}`,
        item.fallback.badge,
      );

      const card = createEl("article", "property-card");

      const media = createEl("div", "property-media");
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = title;
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);

      media.appendChild(createEl("span", "property-badge", badgeText));
      card.appendChild(media);

      const body = createEl("div", "property-body");

      const metaTop = createEl("div", "property-meta-top");
      metaTop.appendChild(createEl("span", "property-location", location));
      metaTop.appendChild(createEl("span", "property-price", price));
      body.appendChild(metaTop);

      body.appendChild(createEl("h3", "property-title", title));
      body.appendChild(createEl("p", "property-summary", summary));

      const specs = createEl("dl", "property-specs");
      [
        [`${item.beds}`, bedsLabel],
        [`${item.baths}`, bathsLabel],
        [`${item.area}`, areaUnit],
      ].forEach(([val, lbl]) => {
        const pair = createEl("div", "spec-pair");
        const dt = createEl("dt", "", lbl);
        const dd = createEl("dd", "", val);
        pair.append(dd, dt);
        specs.appendChild(pair);
      });
      body.appendChild(specs);

      const btn = createEl("button", "property-card-btn", ctaText);
      btn.type = "button";
      btn.addEventListener("click", () => openModal(item.id, btn));
      body.appendChild(btn);

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function populatePropertySelect() {
    const select = document.getElementById("inquiry-property");
    if (!select) return;
    const currentValue = select.value;

    while (select.options.length > 2) {
      select.remove(2);
    }

    PROPERTIES.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = tr(
        `properties.items.${item.id}.title`,
        item.fallback.title,
      );
      select.appendChild(opt);
    });

    if (currentValue) {
      select.value = currentValue;
    }
  }

  function syncFilterUI() {
    document.querySelectorAll("[data-filter-type]").forEach((btn) => {
      const active = btn.getAttribute("data-filter-type") === state.type;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    const bedsFilter = document.getElementById("filter-beds");
    if (bedsFilter) bedsFilter.value = String(state.minBeds);

    const sortFilter = document.getElementById("filter-sort");
    if (sortFilter) sortFilter.value = state.sort;
  }

  function bindFilters() {
    document.querySelectorAll("[data-filter-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.type = btn.getAttribute("data-filter-type") || "all";
        syncFilterUI();
        renderProperties();
      });
    });

    const bedsFilter = document.getElementById("filter-beds");
    if (bedsFilter) {
      bedsFilter.addEventListener("change", (e) => {
        state.minBeds = Number(e.target.value) || 0;
        renderProperties();
      });
    }

    const sortFilter = document.getElementById("filter-sort");
    if (sortFilter) {
      sortFilter.addEventListener("change", (e) => {
        state.sort = e.target.value || "featured";
        renderProperties();
      });
    }

    const resetBtn = document.getElementById("reset-filters-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.type = "all";
        state.minBeds = 0;
        state.sort = "featured";
        syncFilterUI();
        renderProperties();
      });
    }

    const heroForm = document.getElementById("hero-search-form");
    if (heroForm) {
      heroForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const typeSelect = document.getElementById("hero-type");
        const bedsSelect = document.getElementById("hero-beds");
        state.type = typeSelect ? typeSelect.value : "all";
        state.minBeds = bedsSelect ? Number(bedsSelect.value) || 0 : 0;
        syncFilterUI();
        renderProperties();
        document
          .getElementById("properties")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  function renderModalContent(propertyId) {
    const item = PROPERTIES.find((p) => p.id === propertyId);
    if (!item) return;

    const base = `properties.items.${item.id}`;
    const title = tr(`${base}.title`, item.fallback.title);
    const location = tr(`${base}.location`, item.fallback.location);
    const price = tr(`${base}.price`, item.fallback.price);
    const desc = tr(`${base}.description`, item.fallback.description);
    const features = tr(`${base}.features`, item.fallback.features);

    const modalImg = document.getElementById("modal-image");
    const modalBadge = document.getElementById("modal-badge");
    const modalLocation = document.getElementById("modal-location");
    const modalTitle = document.getElementById("modal-title");
    const modalPrice = document.getElementById("modal-price");
    const modalDesc = document.getElementById("modal-description");
    const modalSpecs = document.getElementById("modal-specs");
    const modalFeatures = document.getElementById("modal-features");

    if (modalImg) {
      modalImg.src = item.image;
      modalImg.alt = title;
    }
    if (modalBadge) {
      modalBadge.textContent = tr(
        `properties.badges.${item.badge}`,
        item.fallback.badge,
      );
    }
    if (modalLocation) modalLocation.textContent = location;
    if (modalTitle) modalTitle.textContent = title;
    if (modalPrice) modalPrice.textContent = price;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalSpecs) {
      modalSpecs.innerHTML = "";
      [
        [String(item.beds), tr("properties.specs.beds", "Beds")],
        [String(item.baths), tr("properties.specs.baths", "Baths")],
        [
          `${item.area} ${tr("modal.areaUnit", "m²")}`,
          tr("featured.specs.areaLabel", "Living Area"),
        ],
      ].forEach(([val, lbl]) => {
        const box = createEl("div", "modal-spec-box");
        box.appendChild(createEl("strong", "", val));
        box.appendChild(createEl("span", "", lbl));
        modalSpecs.appendChild(box);
      });
    }

    if (modalFeatures) {
      modalFeatures.innerHTML = "";
      const list = Array.isArray(features) ? features : item.fallback.features;
      list.forEach((feat) => {
        modalFeatures.appendChild(createEl("li", "", feat));
      });
    }
  }

  function trapModalFocus(e, modal) {
    if (e.key !== "Tab" || modal.hidden) return;
    const focusables = modal.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal(propertyId, triggerEl) {
    const modal = document.getElementById("property-modal");
    if (!modal) return;

    state.activeModalId = propertyId;
    state.lastFocusedEl = triggerEl || document.activeElement;
    renderModalContent(propertyId);

    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("modal-close-btn")?.focus();
  }

  function closeModal() {
    const modal = document.getElementById("property-modal");
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.classList.remove("modal-open");
    state.activeModalId = null;

    if (state.lastFocusedEl && typeof state.lastFocusedEl.focus === "function") {
      state.lastFocusedEl.focus();
    }
  }

  function bindModal() {
    const modal = document.getElementById("property-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const scheduleBtn = document.getElementById("modal-schedule-btn");
    const featuredBtn = document.getElementById("featured-inspect-btn");

    featuredBtn?.addEventListener("click", () => {
      openModal("solstice-cliff-villa", featuredBtn);
    });

    closeBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    scheduleBtn?.addEventListener("click", () => {
      const targetId = state.activeModalId;
      closeModal();
      const select = document.getElementById("inquiry-property");
      if (select && targetId) {
        select.value = targetId;
        select.classList.remove("is-invalid");
        select.setAttribute("aria-invalid", "false");
        const errProp = document.getElementById("error-property");
        if (errProp) errProp.textContent = "";
      }
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("inquiry-name")?.focus({ preventScroll: true });
    });

    document.addEventListener("keydown", (e) => {
      if (modal && !modal.hidden) {
        trapModalFocus(e, modal);
      }
      if (e.key === "Escape") {
        if (modal && !modal.hidden) {
          closeModal();
          return;
        }
        const nav = document.getElementById("primary-nav");
        if (nav && nav.classList.contains("is-open")) {
          closeMobileNav(true);
        }
      }
    });
  }

  function closeMobileNav(restoreFocus = false) {
    const nav = document.getElementById("primary-nav");
    const toggle = document.getElementById("nav-toggle");
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("data-i18n-aria", "nav.menuOpen");
    toggle.setAttribute(
      "aria-label",
      tr("nav.menuOpen", "Open navigation menu"),
    );
    if (restoreFocus) {
      toggle.focus();
    }
  }

  function bindNavigationAndScroll() {
    const header = document.getElementById("site-header");
    const nav = document.getElementById("primary-nav");
    const toggle = document.getElementById("nav-toggle");
    const backToTop = document.getElementById("back-to-top");

    toggle?.addEventListener("click", () => {
      const willOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
      const ariaKey = willOpen ? "nav.menuClose" : "nav.menuOpen";
      toggle.setAttribute("data-i18n-aria", ariaKey);
      toggle.setAttribute(
        "aria-label",
        tr(
          ariaKey,
          willOpen ? "Close navigation menu" : "Open navigation menu",
        ),
      );
    });

    nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMobileNav(false));
    });

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      header?.classList.toggle("is-scrolled", y > 24);
      backToTop?.classList.toggle("is-visible", y > 520);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function bindRevealAnimations() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => observer.observe(el));
  }

  function bindInquiryForm() {
    const form = document.getElementById("inquiry-form");
    const statusEl = document.getElementById("inquiry-status");
    const nameInput = document.getElementById("inquiry-name");
    const emailInput = document.getElementById("inquiry-email");
    const propertySelect = document.getElementById("inquiry-property");

    if (!form || !statusEl || !nameInput || !emailInput || !propertySelect) {
      return;
    }

    const setFieldError = (input, errorId, message) => {
      const errEl = document.getElementById(errorId);
      input.classList.toggle("is-invalid", Boolean(message));
      input.setAttribute("aria-invalid", String(Boolean(message)));
      if (errEl) errEl.textContent = message || "";
    };

    const validateFields = (focusFirstInvalid = false) => {
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const propVal = propertySelect.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      let firstInvalid = null;

      if (!nameVal) {
        setFieldError(
          nameInput,
          "error-name",
          tr("contact.validation.nameRequired", "Please enter your full name."),
        );
        firstInvalid = firstInvalid || nameInput;
      } else {
        setFieldError(nameInput, "error-name", "");
      }

      if (!emailValid) {
        setFieldError(
          emailInput,
          "error-email",
          tr(
            "contact.validation.emailInvalid",
            "Please enter a valid email address.",
          ),
        );
        firstInvalid = firstInvalid || emailInput;
      } else {
        setFieldError(emailInput, "error-email", "");
      }

      if (!propVal) {
        setFieldError(
          propertySelect,
          "error-property",
          tr(
            "contact.validation.propertyRequired",
            "Please select a residence or consultation option.",
          ),
        );
        firstInvalid = firstInvalid || propertySelect;
      } else {
        setFieldError(propertySelect, "error-property", "");
      }

      if (focusFirstInvalid && firstInvalid) {
        firstInvalid.focus();
      }
      return !firstInvalid;
    };

    [
      [nameInput, "error-name"],
      [emailInput, "error-email"],
      [propertySelect, "error-property"],
    ].forEach(([field, errId]) => {
      const eventName = field.tagName === "SELECT" ? "change" : "input";
      field.addEventListener(eventName, () => {
        if (field.classList.contains("is-invalid")) {
          setFieldError(field, errId, "");
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      state.inquirySubmitted = false;
      statusEl.hidden = true;
      statusEl.textContent = "";

      if (!validateFields(true)) return;

      state.inquirySubmitted = true;
      statusEl.textContent = tr(
        "contact.successMessage",
        "Thank you. Your private inquiry has been recorded in this preview session.",
      );
      statusEl.hidden = false;
      form.reset();
    });

    window.addEventListener("auravilla:langchange", () => {
      if (state.inquirySubmitted && !statusEl.hidden) {
        statusEl.textContent = tr(
          "contact.successMessage",
          "Thank you. Your private inquiry has been recorded in this preview session.",
        );
      }
      if (
        nameInput.classList.contains("is-invalid") ||
        emailInput.classList.contains("is-invalid") ||
        propertySelect.classList.contains("is-invalid")
      ) {
        validateFields(false);
      }
    });
  }

  async function bootstrap() {
    bindFilters();
    bindModal();
    bindNavigationAndScroll();
    bindRevealAnimations();
    bindInquiryForm();

    window.addEventListener("auravilla:langchange", () => {
      populatePropertySelect();
      renderProperties();
      if (state.activeModalId) {
        renderModalContent(state.activeModalId);
      }
    });

    if (window.AuraTheme) {
      window.AuraTheme.init();
    }

    if (window.AuraI18n) {
      await window.AuraI18n.init();
    } else {
      populatePropertySelect();
      renderProperties();
    }
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
