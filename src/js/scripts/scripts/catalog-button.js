class CatalogButton extends HTMLElement {
  /** @type {HTMLButtonElement} */
  button;
  /** @type {HTMLDivElement} */
  catalog;
  /** @type {HTMLDivElement} */
  catalogMainBlock;
  /** @type {HTMLAnchorElement} */
  catalogFirstLink;
  /** @type {MediaQueryList} */
  isDesktop = matchMedia('(min-width: 992.1px)');
  /** @type {AbortController} */
  abortController;
  /** @type {AbortController} */
  mediaAbortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.button = this.querySelector('button');
    this.catalog = document.querySelector('.header-catalog');
    this.catalogMainBlock = this.catalog.querySelector('.header-catalog-main');

    if (this.button) {
      this.mediaAbortController = new AbortController();

      this.init(this.isDesktop);

      this.isDesktop.addEventListener('change', (event) => {
        this.init(event);
      }, { signal: this.mediaAbortController.signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.mediaAbortController?.abort();

    this.abortController = undefined;
    this.mediaAbortController = undefined;
    this.button = undefined;
    this.catalog = undefined;
    this.catalogMainBlock = undefined;
    this.catalogFirstLink = undefined;
  }

  /** @param {MediaQueryList | MediaQueryListEvent} media */
  init(media) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    const { matches } = media;

    if (matches) {
      this.desktopEvents();
    } else {
      this.mobileEvents();
    }
  }

  desktopEvents() {
    if (this.catalog) {
      this.catalogFirstLink = this.catalog.querySelector('a');

      this.button.addEventListener('click', () => {
        this.button.classList.toggle('active');
        this.catalog.classList.toggle('active');
      }, { signal: this.abortController.signal });

      document.addEventListener('keydown', (event) => {
        const { key } = event;

        if (key === 'Escape') {
          this.button.classList.remove('active');
          this.catalog.classList.remove('active');
        }
      }, { signal: this.abortController.signal });

      if (this.catalogFirstLink) {
        this.button.addEventListener('keydown', (event) => {
          const { key } = event;

          if (key === 'Tab' && this.catalog.classList.contains('active')) {
            event.preventDefault();

            this.catalogFirstLink.focus();
          }
        }, { signal: this.abortController.signal });

        this.catalogFirstLink.addEventListener('keydown', (event) => {
          const { key, shiftKey } = event;

          if (shiftKey && key === 'Tab') {
            event.preventDefault();

            this.button.focus();
          }
        }, { signal: this.abortController.signal });
      }
    }
  }

  mobileEvents() {
    if (this.catalogMainBlock) {
      this.button.addEventListener('click', () => {
        this.catalogMainBlock.classList.add('active');
      }, { signal: this.abortController.signal });
    }
  }
}

customElements.define('catalog-button', CatalogButton);
