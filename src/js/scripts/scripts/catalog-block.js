class CatalogBlock extends HTMLElement {
  /** @type {NodeListOf<HTMLLIElement>} */
  dropdownMainItems;
  /** @type { { item: HTMLLIElement, link: HTMLAnchorElement, button: HTMLButtonElement, inner: HTMLDivElement }[] } */
  dropdowns;
  /** @type {HTMLLIElement} */
  activeDropdownItem;
  /** @type {HTMLDivElement} */
  activeDropdownInner;
  /** @type {MediaQueryList} */
  isDesktop = window.matchMedia('(min-width: 992.1px)');
  /** @type {AbortController} */
  abortController;
  /** @type {AbortController} */
  mediaAbortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.mediaAbortController = new AbortController();
    this.dropdownMainItems = this.querySelectorAll('.header-catalog-main__item[data-dropdown-button]');

    this.dropdowns = [...this.dropdownMainItems].map(
      /** @param {HTMLLIElement} item */
      (item) => {
        const { dataset } = item;
        const { dropdownButton } = dataset;
        const link = item.querySelector('a');
        const button = item.querySelector('button');
        /** @type {HTMLDivElement} */
        const inner = document.querySelector(`.header-catalog-inner__block[data-dropdown-inner="${dropdownButton}"]`);

        if (item && link && button && inner) {
          if (item.classList.contains('active')) {
            this.activeDropdownItem = item;
          }

          if (inner.classList.contains('active')) {
            this.activeDropdownInner = inner;
          }

          return {
            item,
            link,
            button,
            inner,
          };
        }
      });

    this.init(this.isDesktop);

    this.isDesktop.addEventListener('change', (event) => {
      this.init(event);
    }, { signal: this.mediaAbortController.signal });
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.mediaAbortController?.abort();

    this.abortController = undefined;
    this.mediaAbortController = undefined;
    this.dropdownMainItems = undefined;
    this.dropdowns = undefined;
    this.activeDropdownItem = undefined;
    this.activeDropdownInner = undefined;
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
    const eventHandler =
      /**
       * @param {HTMLLIElement} item
       * @param {HTMLDivElement} inner
       */
      (item, inner) => {
        this.activeDropdownItem?.classList.remove('active');
        this.activeDropdownInner?.classList.remove('active');

        item.classList.toggle('active');
        inner.classList.toggle('active');

        this.activeDropdownItem = item;
        this.activeDropdownInner = inner;
      }

    this.dropdowns.forEach(({ item, link, button, inner }) => {
      link.addEventListener('mouseenter', () => {
        eventHandler(item, inner);
      }, { signal: this.abortController.signal });

      button.addEventListener('click', () => {
        eventHandler(item, inner);
      }, { signal: this.abortController.signal });
    });
  }

  mobileEvents() {
    this.dropdowns.forEach(({ item, link, button, inner }) => {
      button.addEventListener('click', () => {
        inner.classList.toggle('dropdown-active');
      }, { signal: this.abortController.signal });
    });
  }
}

customElements.define('catalog-block', CatalogBlock);
