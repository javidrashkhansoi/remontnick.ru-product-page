/** @type {HTMLButtonElement} */
const headerCatalogButton = document.querySelector('.header-catalog-button');
/** @type {HTMLDivElement} */
const headerCatalog = document.querySelector('.header-catalog');

if (headerCatalogButton && headerCatalog) {
  headerCatalogButton.addEventListener('click', () => {
    headerCatalogButton.classList.toggle('header-catalog-button--active');
    headerCatalog.classList.toggle('header-catalog--show');
  });

  document.addEventListener('keydown', (event) => {
    const { key } = event;

    if (key === 'Escape') {
      headerCatalogButton.classList.remove('header-catalog-button--active');
      headerCatalog.classList.remove('header-catalog--show');
    }
  });
}

/** @type {NodeListOf<HTMLAnchorElement>} */
const headerCatalogMainLinks = document.querySelectorAll('[data-catalog-main]');
/** @type {NodeListOf<HTMLDivElement>} */
const headerCatalogInners = document.querySelectorAll('[data-catalog-inner]');

headerCatalogMainLinks.forEach((link, index) => {
  const { dataset } = link;
  const { catalogMain } = dataset;

  link.addEventListener('mouseenter', () => {
    headerCatalogMainLinks.forEach(main => {
      main.classList.toggle('header-catalog-main-link--active', main.dataset.catalogMain === catalogMain);
    });

    headerCatalogInners.forEach(inner => {
      inner.toggleAttribute('hidden', inner.dataset.catalogInner !== catalogMain);
    });
  });

  link.addEventListener('focus', () => {
    headerCatalogInners.forEach(inner => {
      inner.toggleAttribute('hidden', inner.dataset.catalogInner !== catalogMain);

      if (!inner.hidden) {
        const innerLinks = inner.querySelectorAll('a');
        const firstInnerLink = [...innerLinks].at(0);
        const lastInnerLink = [...innerLinks].at(-1);

        firstInnerLink.focus();

        firstInnerLink.addEventListener('keydown', (event) => {
          const { key, shiftKey } = event;

          if (shiftKey && key === 'Tab') {
            const prevMainLink = [...headerCatalogMainLinks].at(index - 1);

            if (prevMainLink) {
              prevMainLink.focus();
            } else {
              headerCatalogMainLinks[headerCatalogMainLinks.length - 1].focus();
            }
          }
        }, { once: true });

        lastInnerLink.addEventListener('keydown', (event) => {
          const { key } = event;

          if (key === 'Tab') {
            const nextMainLink = [...headerCatalogMainLinks].at(index + 1);

            if (nextMainLink) {
              nextMainLink.focus();
            } else {
              headerCatalogMainLinks[0].focus();
            }
          }
        }, { once: true });
      }
    });

    headerCatalogMainLinks.forEach(main => {
      main.classList.toggle('header-catalog-main-link--active', main.dataset.catalogMain === catalogMain);
    });
  });
});
