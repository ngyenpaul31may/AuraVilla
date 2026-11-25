/**
 * AuraVilla main application script:
 * - Interactive Data-Driven Insights tabs & Revenue chart
 * - 3-card tilted investment properties carousel + Property Detail Modal
 * - Accessible Private Inquiry Modal & validation
 * - Mobile drawer & sticky header state
 */
(() => {
  const PROPERTIES = [
    {
      id: "villa-redwood",
      status: "underOffer",
      badgeStyle: "pill-peach",
      beds: 5,
      baths: 6,
      area: 640,
      image: "assets/images/property-cliffside.png",
    },
    {
      id: "cedar-pavilion",
      status: "rented",
      badgeStyle: "pill-mint",
      beds: 4,
      baths: 5,
      area: 520,
      image: "assets/images/property-hillside.png",
    },
    {
      id: "skyline-edge",
      status: "forSale",
      badgeStyle: "pill-lilac",
      beds: 4,
      baths: 4,
      area: 440,
      image: "assets/images/property-courtyard.png",
    },
    {
      id: "solstice-cliff",
      status: "underOffer",
      badgeStyle: "pill-peach",
      beds: 5,
      baths: 6,
      area: 680,
      image: "assets/images/hero-villa.png",
    },
    {
      id: "courtyard-travertine",
      status: "forSale",
      badgeStyle: "pill-lilac",
      beds: 4,
      baths: 4,
      area: 460,
      image: "assets/images/interior-living.png",
    },
    {
      id: "skyline-penthouse",
      status: "rented",
      badgeStyle: "pill-mint",
      beds: 3,
      baths: 4,
      area: 390,
      image: "assets/images/property-penthouse.png",
    },
  ];

  const INSIGHTS_SERIES = [
    {
      heights: [46, 68, 56, 52, 92, 60, 48],
      peakIndex: 4,
      curvePath:
        "M 10 80 C 38 62, 66 48, 96 60 C 126 72, 152 66, 180 54 C 208 42, 224 38, 246 46 C 272 56, 296 72, 322 58 C 336 50, 346 48, 354 52",
    },
    {
      heights: [64, 52, 82, 51, 98, 55, 80],
      peakIndex: 4,
      curvePath:
        "M 10 88 C 36 62, 62 62, 94 74 C 128 86, 154 74, 182 58 C 208 44, 226 38, 248 48 C 274 60, 294 82, 318 60 C 334 46, 344 48, 354 56",
    },
    {
      heights: [52, 64, 70, 78, 98, 72, 66],
      peakIndex: 4,
      curvePath:
        "M 10 82 C 42 66, 74 60, 108 62 C 142 64, 168 48, 198 40 C 224 32, 244 30, 266 44 C 290 60, 314 54, 336 42 C 344 38, 350 40, 354 44",
    },
  ];

  const state = {
    activeInsight: 1,
    carouselIndex: 0,
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

  function renderInsightChart() {
    const idx = state.activeInsight;
    const series = INSIGHTS_SERIES[idx] || INSIGHTS_SERIES[1];

    const titleEl = document.getElementById("insight-metric-title");
    const valueEl = document.getElementById("insight-metric-value");
    const deltaEl = document.getElementById("insight-metric-delta");
    const noteEl = document.getElementById("insight-metric-note");
    const chartEl = document.getElementById("insight-chart-bars");

    if (titleEl) {
      titleEl.textContent = tr(`insights.tabs.${idx}.metricTitle`, "Revenue");
    }
    if (valueEl) {
      valueEl.textContent = tr(`insights.tabs.${idx}.metricValue`, "$96,437");
    }
    if (deltaEl) {
      deltaEl.textContent = tr(`insights.tabs.${idx}.delta`, "↑ 18.4%");
    }
    if (noteEl) {
      noteEl.textContent = tr(`insights.tabs.${idx}.deltaNote`, "vs last week");
    }
    if (!chartEl) return;

    chartEl.innerHTML = "";
    const peakTagText = tr(`insights.tabs.${idx}.peak`, "+20%");

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "chart-trend-svg");
    svg.setAttribute("viewBox", "0 0 360 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#e82e82");
    path.setAttribute("stroke-width", "2.1");
    path.setAttribute("stroke-dasharray", "4 4");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("d", series.curvePath);
    svg.appendChild(path);
    chartEl.appendChild(svg);

    series.heights.forEach((pct, dayIdx) => {
      const isPeak = dayIdx === series.peakIndex;
      const col = createEl("div", `bar-col${isPeak ? " is-peak" : ""}`);
      const track = createEl("div", "bar-track");
      const bar = createEl("div", `bar-fill${isPeak ? " is-peak" : ""}`);
      bar.style.height = `${pct}%`;

      if (isPeak) {
        bar.appendChild(createEl("span", "bar-peak-tag", peakTagText));
      }

      track.appendChild(bar);
      const dayLabel = tr(
        `insights.days.${dayIdx}`,
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIdx],
      );
      col.append(track, createEl("span", "bar-day", dayLabel));
      chartEl.appendChild(col);
    });
  }

  function bindInsightTabs() {
    const tabs = Array.from(document.querySelectorAll("[data-insight-tab]"));
    const tabpanel = document.getElementById("insight-tabpanel");

    const activateTab = (nextIdx, moveFocus = false) => {
      state.activeInsight = nextIdx;
      tabs.forEach((btn) => {
        const idx = Number(btn.getAttribute("data-insight-tab"));
        const active = idx === nextIdx;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
        btn.setAttribute("tabindex", active ? "0" : "-1");
        if (active && tabpanel) {
          tabpanel.setAttribute("aria-labelledby", btn.id);
        }
        if (active && moveFocus) {
          btn.focus();
        }
      });
      renderInsightChart();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        activateTab(Number(tab.getAttribute("data-insight-tab")), false);
      });

      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          next = (i + 1) % tabs.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          next = (i - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          next = 0;
        } else if (e.key === "End") {
          next = tabs.length - 1;
        }
        if (next !== null) {
          e.preventDefault();
          activateTab(next, true);
        }
      });
    });
  }

  function renderCarousel() {
    const stage = document.getElementById("carousel-stage");
    if (!stage) return;

    stage.innerHTML = "";
    const total = PROPERTIES.length;
    const slots = [
      { offset: -1, posClass: "is-left" },
      { offset: 0, posClass: "is-center" },
      { offset: 1, posClass: "is-right" },
    ];

    const exploreLabel = tr("featured.explore", "Explore");

    slots.forEach(({ offset, posClass }) => {
      const idx = (state.carouselIndex + offset + total) % total;
      const item = PROPERTIES[idx];
      const base = `featured.items.${item.id}`;

      const title = tr(`${base}.title`, item.id);
      const summary = tr(`${base}.summary`, "");
      const price = tr(`${base}.price`, "$4,800");
      const priceSuffix = tr(
        `${base}.priceSuffix`,
        tr("featured.perMonth", "/month"),
      );
      const badgeLabel = tr(`featured.badges.${item.status}`, item.status);

      const card = createEl("article", `property-card ${posClass}`);

      const media = createEl("div", "property-media");
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = title;
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);

      const badge = createEl(
        "span",
        `pill-badge ${item.badgeStyle} property-status-badge`,
        badgeLabel,
      );
      media.appendChild(badge);
      card.appendChild(media);

      const info = createEl("div", "property-info");
      info.appendChild(createEl("h3", "property-title", title));
      info.appendChild(createEl("p", "property-summary", summary));

      const foot = createEl("div", "property-footer");
      const priceEl = createEl("div", "property-price", price);
      priceEl.appendChild(createEl("span", "", priceSuffix));

      const btn = createEl("button", "btn-pill explore-btn", `${exploreLabel} ↗`);
      btn.type = "button";
      btn.setAttribute("data-property-trigger", item.id);
      btn.addEventListener("click", () => openPropertyModal(item.id, btn));

      foot.append(priceEl, btn);
      info.appendChild(foot);
      card.appendChild(info);
      stage.appendChild(card);
    });
  }

  function bindCarousel() {
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    prevBtn?.addEventListener("click", () => {
      state.carouselIndex =
        (state.carouselIndex - 1 + PROPERTIES.length) % PROPERTIES.length;
      renderCarousel();
    });

    nextBtn?.addEventListener("click", () => {
      state.carouselIndex = (state.carouselIndex + 1) % PROPERTIES.length;
      renderCarousel();
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
      opt.textContent = tr(`featured.items.${item.id}.title`, item.id);
      select.appendChild(opt);
    });

    if (currentValue) {
      select.value = currentValue;
    }
  }

  function renderPropertyModal(propertyId) {
    const item = PROPERTIES.find((p) => p.id === propertyId);
    if (!item) return;

    const base = `featured.items.${item.id}`;
    const title = tr(`${base}.title`, item.id);
    const location = tr(`${base}.location`, "");
    const price = `${tr(`${base}.price`, "")}${tr(`${base}.priceSuffix`, "")}`;
    const desc = tr(`${base}.description`, "");
    const features = tr(`${base}.features`, []);

    const modalImg = document.getElementById("modal-image");
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
    if (modalLocation) modalLocation.textContent = location;
    if (modalTitle) modalTitle.textContent = title;
    if (modalPrice) modalPrice.textContent = price;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalSpecs) {
      modalSpecs.innerHTML = "";
      [
        [String(item.beds), tr("featured.specs.beds", "Beds")],
        [String(item.baths), tr("featured.specs.baths", "Baths")],
        [`${item.area}`, tr("featured.specs.area", "m²")],
      ].forEach(([val, lbl]) => {
        const box = createEl("div", "modal-spec-box");
        box.appendChild(createEl("strong", "", val));
        box.appendChild(createEl("span", "", lbl));
        modalSpecs.appendChild(box);
      });
    }

    if (modalFeatures) {
      modalFeatures.innerHTML = "";
      if (Array.isArray(features)) {
        features.forEach((feat) => {
          modalFeatures.appendChild(createEl("li", "", feat));
        });
      }
    }
  }

  function trapFocus(e, modal) {
    if (e.key !== "Tab" || modal.hidden) return;
    const focusables = modal.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (!modal.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
      return;
    }

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function resetInquiryFormState() {
    const statusEl = document.getElementById("inquiry-status");
    if (statusEl) statusEl.textContent = "";
    state.inquirySubmitted = false;

    [
      ["inquiry-name", "error-name"],
      ["inquiry-email", "error-email"],
      ["inquiry-property", "error-property"],
    ].forEach(([fieldId, errId]) => {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById(errId);
      if (field) {
        field.classList.remove("is-invalid");
        field.setAttribute("aria-invalid", "false");
      }
      if (errEl) errEl.textContent = "";
    });
  }

  function openPropertyModal(propertyId, triggerEl) {
    const modal = document.getElementById("property-modal");
    if (!modal) return;
    state.activeModalId = propertyId;
    state.lastFocusedEl = triggerEl || document.activeElement;
    renderPropertyModal(propertyId);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("modal-close-btn")?.focus();
  }

  function openInquiryModal(preselectId, triggerEl) {
    const modal = document.getElementById("inquiry-modal");
    if (!modal) return;

    const drawer = document.getElementById("mobile-drawer");
    const candidate = triggerEl || document.activeElement;
    state.lastFocusedEl =
      drawer && candidate && drawer.contains(candidate)
        ? document.getElementById("nav-toggle")
        : candidate;

    resetInquiryFormState();

    const select = document.getElementById("inquiry-property");
    if (select) {
      select.value = preselectId || "";
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("inquiry-name")?.focus();
  }

  function closeAllModals() {
    const propModal = document.getElementById("property-modal");
    const inqModal = document.getElementById("inquiry-modal");
    const closedPropertyId = state.activeModalId;
    let closed = false;

    [propModal, inqModal].forEach((m) => {
      if (m && !m.hidden) {
        m.hidden = true;
        closed = true;
      }
    });

    if (closed) {
      document.body.classList.remove("modal-open");
      state.activeModalId = null;

      let target = state.lastFocusedEl;
      if (!target || !document.contains(target)) {
        target = closedPropertyId
          ? document.querySelector(`[data-property-trigger="${closedPropertyId}"]`)
          : null;
      }
      if (target && typeof target.focus === "function") {
        target.focus();
      }
    }
  }

  function bindModals() {
    const propModal = document.getElementById("property-modal");
    const inqModal = document.getElementById("inquiry-modal");

    document
      .getElementById("modal-close-btn")
      ?.addEventListener("click", closeAllModals);
    document
      .getElementById("inquiry-close-btn")
      ?.addEventListener("click", closeAllModals);

    [propModal, inqModal].forEach((m) => {
      m?.addEventListener("click", (e) => {
        if (e.target === m) closeAllModals();
      });
    });

    document
      .getElementById("modal-schedule-btn")
      ?.addEventListener("click", () => {
        const targetId = state.activeModalId;
        state.activeModalId = null;
        if (propModal) propModal.hidden = true;
        openInquiryModal(targetId, state.lastFocusedEl);
      });

    document.querySelectorAll("[data-open-inquiry]").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        if (trigger.tagName === "A") e.preventDefault();
        openInquiryModal(null, trigger);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (propModal && !propModal.hidden) trapFocus(e, propModal);
      if (inqModal && !inqModal.hidden) trapFocus(e, inqModal);

      if (e.key === "Escape") {
        if ((propModal && !propModal.hidden) || (inqModal && !inqModal.hidden)) {
          closeAllModals();
          return;
        }
        const drawer = document.getElementById("mobile-drawer");
        if (drawer && drawer.classList.contains("is-open")) {
          closeMobileDrawer(true);
        }
      }
    });
  }

  function closeMobileDrawer(restoreFocus = false) {
    const drawer = document.getElementById("mobile-drawer");
    const toggle = document.getElementById("nav-toggle");
    if (!drawer || !toggle) return;
    drawer.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("data-i18n-aria", "nav.menuOpen");
    toggle.setAttribute("aria-label", tr("nav.menuOpen", "Open navigation menu"));
    if (restoreFocus) toggle.focus();
  }

  function bindNavigationAndScroll() {
    const header = document.getElementById("site-header");
    const drawer = document.getElementById("mobile-drawer");
    const toggle = document.getElementById("nav-toggle");

    toggle?.addEventListener("click", () => {
      const willOpen = !drawer.classList.contains("is-open");
      drawer.classList.toggle("is-open", willOpen);
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

    drawer?.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => closeMobileDrawer(false));
    });

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      header?.classList.toggle("is-scrolled", y > 40);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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

    const setFieldError = (input, errId, msg) => {
      const errEl = document.getElementById(errId);
      input.classList.toggle("is-invalid", Boolean(msg));
      input.setAttribute("aria-invalid", String(Boolean(msg)));
      if (errEl) errEl.textContent = msg || "";
    };

    const validate = (focusFirst = false) => {
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const propVal = propertySelect.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      let firstInvalid = null;

      if (!nameVal) {
        setFieldError(
          nameInput,
          "error-name",
          tr("inquiry.validation.nameRequired", "Please enter your full name."),
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
            "inquiry.validation.emailInvalid",
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
            "inquiry.validation.propertyRequired",
            "Please select a property or consultation option.",
          ),
        );
        firstInvalid = firstInvalid || propertySelect;
      } else {
        setFieldError(propertySelect, "error-property", "");
      }

      if (focusFirst && firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    };

    [
      [nameInput, "error-name"],
      [emailInput, "error-email"],
      [propertySelect, "error-property"],
    ].forEach(([field, errId]) => {
      const ev = field.tagName === "SELECT" ? "change" : "input";
      field.addEventListener(ev, () => {
        if (field.classList.contains("is-invalid")) {
          setFieldError(field, errId, "");
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      state.inquirySubmitted = false;
      statusEl.textContent = "";
      if (!validate(true)) return;

      state.inquirySubmitted = true;
      statusEl.textContent = tr(
        "inquiry.successMessage",
        "Thank you. Your private inquiry has been recorded in this preview session.",
      );
      form.reset();
    });

    window.addEventListener("auravilla:langchange", () => {
      if (state.inquirySubmitted && statusEl.textContent) {
        statusEl.textContent = tr(
          "inquiry.successMessage",
          "Thank you. Your private inquiry has been recorded in this preview session.",
        );
      }
      if (
        nameInput.classList.contains("is-invalid") ||
        emailInput.classList.contains("is-invalid") ||
        propertySelect.classList.contains("is-invalid")
      ) {
        validate(false);
      }
    });
  }

  async function bootstrap() {
    bindInsightTabs();
    bindCarousel();
    bindModals();
    bindNavigationAndScroll();
    bindInquiryForm();

    window.addEventListener("auravilla:langchange", () => {
      renderInsightChart();
      renderCarousel();
      populatePropertySelect();
      if (state.activeModalId) {
        renderPropertyModal(state.activeModalId);
      }
    });

    if (window.AuraTheme) {
      window.AuraTheme.init();
    }

    if (window.AuraI18n) {
      await window.AuraI18n.init();
    } else {
      renderInsightChart();
      renderCarousel();
      populatePropertySelect();
    }
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
