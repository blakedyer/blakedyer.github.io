(() => {
  const site = window.EARTH_HISTORY || { publications: [], albums: [] };
  const galleryStore = window.EARTH_HISTORY_GALLERIES || { albums: [], galleries: {} };
  const albums = galleryStore.albums && galleryStore.albums.length ? galleryStore.albums : site.albums || [];
  const galleries = galleryStore.galleries || {};

  const titleCase = (value) =>
    value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  function setupNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-menu]");

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open", !expanded);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      });
    });
  }

  function publicationMarkup(publication, compact = false) {
    const tags = publication.tags
      .map((tag) => `<li class="tag">${escapeHtml(titleCase(tag))}</li>`)
      .join("");

    return `
      <article class="paper-card${compact ? " paper-card--compact" : ""}" data-tags="${escapeHtml(publication.tags.join(" "))}">
        <div class="paper-card__top">
          <p class="paper-year">${escapeHtml(publication.year)}</p>
          <a class="paper-link" href="${escapeHtml(publication.link)}" target="_blank" rel="noopener">PDF</a>
        </div>
        <h3 class="paper-title">
          <a href="${escapeHtml(publication.link)}" target="_blank" rel="noopener">${escapeHtml(publication.title)}</a>
        </h3>
        <p class="paper-authors">${escapeHtml(publication.authors)}</p>
        <p class="paper-journal">${escapeHtml(publication.journal)}</p>
        <p class="paper-summary">${escapeHtml(publication.summary)}</p>
        <ul class="tag-list">${tags}</ul>
      </article>
    `;
  }

  function albumMarkup(album) {
    const meta = album.meta || `${album.count} photos`;

    return `
      <article class="album-card">
        <a class="album-card__image" href="${escapeHtml(album.link)}">
          <img src="${escapeHtml(album.image)}" alt="${escapeHtml(album.title)} album preview" loading="lazy">
        </a>
        <div class="album-card__body">
          <p class="album-card__meta">${escapeHtml(meta)}</p>
          <h3><a href="${escapeHtml(album.link)}">${escapeHtml(album.title)}</a></h3>
          <p>${escapeHtml(album.summary)}</p>
          <a class="text-link" href="${escapeHtml(album.link)}">Open album</a>
        </div>
      </article>
    `;
  }

  function renderHome() {
    const recentContainer = document.querySelector("#recent-publications");
    const featuredAlbumsContainer = document.querySelector("#featured-albums");

    if (recentContainer) {
      recentContainer.innerHTML = site.publications
        .slice(0, 4)
        .map((publication) => publicationMarkup(publication, true))
        .join("");
    }

    if (featuredAlbumsContainer) {
      featuredAlbumsContainer.innerHTML = albums
        .filter((album) => album.featured)
        .slice(0, 4)
        .map((album) => albumMarkup(album))
        .join("");
    }
  }

  function renderPublications() {
    const container = document.querySelector("#publication-grid");
    if (!container) {
      return;
    }

    container.innerHTML = site.publications.map((publication) => publicationMarkup(publication)).join("");
  }

  function setupPublicationFilters() {
    const buttons = Array.from(document.querySelectorAll("[data-filter]"));
    const cards = Array.from(document.querySelectorAll(".paper-card"));

    if (!buttons.length || !cards.length) {
      return;
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });

        cards.forEach((card) => {
          const tags = card.dataset.tags.split(" ");
          const show = filter === "all" || tags.includes(filter);
          card.hidden = !show;
        });
      });
    });
  }

  function renderAlbums() {
    const container = document.querySelector("#album-grid");
    if (!container) {
      return;
    }

    container.innerHTML = albums.map((album) => albumMarkup(album)).join("");
  }

  function renderCounts() {
    document.querySelectorAll("[data-publication-count]").forEach((item) => {
      item.textContent = String(site.publications.length);
    });

    document.querySelectorAll("[data-album-count]").forEach((item) => {
      item.textContent = String(albums.length);
    });
  }

  function setupMotionVideos() {
    const videos = Array.from(document.querySelectorAll("[data-motion-video]"));
    if (!videos.length || !window.matchMedia) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (reducedMotion.matches) {
        videos.forEach((video) => {
          video.pause();
          video.currentTime = 0;
        });
        return;
      }

      videos.forEach((video) => {
        if (video.dataset.motionVideo === "hero") {
          const playAttempt = video.play();
          if (playAttempt && typeof playAttempt.catch === "function") {
            playAttempt.catch(() => {});
          }
        }
      });
    };

    sync();

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", sync);
    } else if (typeof reducedMotion.addListener === "function") {
      reducedMotion.addListener(sync);
    }
  }

  function createIntroMarkup(gallery) {
    const paragraphs = [gallery.summary].concat(gallery.intro || []);
    const paragraphMarkup = paragraphs
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");

    return `
      <div class="gallery-intro-card__copy">
        <p class="section-kicker">Gallery Notes</p>
        <h2>${escapeHtml(gallery.title)}</h2>
        ${paragraphMarkup}
      </div>
      <div class="gallery-intro-card__stats">
        <p class="gallery-intro-card__count">${escapeHtml(gallery.photos.length)}</p>
        <p class="gallery-intro-card__label">photos in this album</p>
      </div>
    `;
  }

  function buildGalleryCard(photo, index) {
    const card = document.createElement("article");
    card.className = "gallery-card";

    const button = document.createElement("button");
    button.className = "gallery-card__button";
    button.type = "button";
    button.dataset.index = String(index);

    const image = document.createElement("img");
    image.className = "gallery-card__image";
    image.src = photo.display || photo.thumb || photo.src;
    if (photo.src && photo.display && photo.src !== photo.display) {
      image.srcset = `${photo.display} 1x, ${photo.src} 2x`;
    }
    image.alt = photo.alt || photo.caption || `Field photograph ${index + 1}`;
    image.loading = "lazy";
    image.decoding = "async";

    const body = document.createElement("div");
    body.className = "gallery-card__body";

    const caption = document.createElement("p");
    caption.className = "gallery-card__caption";
    caption.textContent = photo.caption || "\u00a0";
    if (!photo.caption) {
      caption.classList.add("is-empty");
      caption.setAttribute("aria-hidden", "true");
    }

    const meta = document.createElement("p");
    meta.className = "gallery-card__meta";
    meta.textContent = photo.caption ? `Photo ${index + 1}` : `Photo ${index + 1}`;

    body.append(caption, meta);
    button.append(image, body);
    card.append(button);
    return card;
  }

  function setupGalleryLightbox(gallery) {
    const lightbox = document.querySelector("#gallery-lightbox");
    if (!lightbox || !gallery.photos.length) {
      return;
    }

    const frame = lightbox.querySelector(".lightbox__frame");
    const image = lightbox.querySelector("[data-lightbox-image]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const meta = lightbox.querySelector("[data-lightbox-meta]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const prevButton = lightbox.querySelector("[data-lightbox-prev]");
    const nextButton = lightbox.querySelector("[data-lightbox-next]");
    const openButton = document.querySelector("[data-open-gallery]");
    const triggers = Array.from(document.querySelectorAll(".gallery-card__button"));
    let currentIndex = 0;

    const updatePhoto = (index) => {
      const total = gallery.photos.length;
      currentIndex = (index + total) % total;
      const photo = gallery.photos[currentIndex];

      image.src = photo.src || photo.display || photo.thumb;
      image.alt = photo.alt || photo.caption || `${gallery.title} field photograph ${currentIndex + 1}`;
      caption.textContent = photo.caption || "";
      meta.textContent = `${currentIndex + 1} / ${total}${photo.author ? ` \u00b7 ${photo.author}` : ""}`;
      caption.hidden = !photo.caption;
    };

    const openLightbox = (index) => {
      updatePhoto(index);
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openLightbox(Number(trigger.dataset.index));
      });
    });

    if (openButton) {
      openButton.addEventListener("click", () => openLightbox(0));
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeLightbox);
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => updatePhoto(currentIndex - 1));
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => updatePhoto(currentIndex + 1));
    }

    if (frame) {
      frame.addEventListener("click", (event) => event.stopPropagation());
    }

    lightbox.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        updatePhoto(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        updatePhoto(currentIndex + 1);
      }
    });
  }

  function renderGalleryPage() {
    if (document.body.dataset.page !== "gallery") {
      return;
    }

    const slug = document.body.dataset.gallery;
    const gallery = galleries[slug];
    if (!gallery) {
      return;
    }

    const hero = document.querySelector("#gallery-hero");
    const title = document.querySelector("#gallery-title");
    const summary = document.querySelector("#gallery-summary");
    const intro = document.querySelector("#gallery-intro");
    const count = document.querySelector("#gallery-count");
    const metaCopy = document.querySelector("#gallery-meta-copy");
    const grid = document.querySelector("#gallery-grid");

    if (hero && gallery.heroImage) {
      hero.style.backgroundImage = `url("${gallery.heroImage}")`;
    }

    if (title) {
      title.textContent = gallery.title;
    }

    if (summary) {
      summary.textContent = gallery.summary;
    }

    if (intro) {
      intro.innerHTML = createIntroMarkup(gallery);
    }

    if (count) {
      count.textContent = `${gallery.photos.length} photos`;
    }

    if (metaCopy) {
      metaCopy.textContent =
        "Full gallery with caption metadata carried through wherever it exists in the source archive.";
    }

    if (grid) {
      grid.innerHTML = "";
      gallery.photos.forEach((photo, index) => {
        grid.append(buildGalleryCard(photo, index));
      });
    }

    setupGalleryLightbox(gallery);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupNav();
    setupMotionVideos();
    renderCounts();
    renderHome();
    renderPublications();
    setupPublicationFilters();
    renderAlbums();
    renderGalleryPage();
  });
})();
