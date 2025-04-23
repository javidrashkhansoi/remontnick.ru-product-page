class CatalogBlock extends HTMLElement {
  /** @type {NodeListOf<HTMLLIElement>} */
  dropdownMainItems;
  /** @type { { item: HTMLLIElement, link: HTMLAnchorElement, button: HTMLButtonElement, inner: HTMLDivElement, innerFirstLink: HTMLAnchorElement, innerLastLink: HTMLAnchorElement,  nextLink: HTMLAnchorElement, previousLink: HTMLAnchorElement }[] } */
  dropdowns;
  /** @type {HTMLLIElement} */
  activeDropdownItem;
  /** @type {HTMLDivElement} */
  activeDropdownInner;
  /** @type {HTMLButtonElement} */
  catalogButton;
  /** @type {HTMLInputElement} */
  searchInput;
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
    this.catalogButton = document.querySelector('.header-catalog-button');
    this.searchInput = document.querySelector('.header-search__input');

    this.dropdowns = [...this.dropdownMainItems].map(
      /** @param {HTMLLIElement} item */
      (item, index) => {
        const { dataset } = item;
        const { dropdownButton } = dataset;
        const link = item.querySelector('a');
        const button = item.querySelector('button');
        /** @type {HTMLDivElement} */
        const inner = document.querySelector(`.header-catalog-inner__block[data-dropdown-inner="${dropdownButton}"]`);

        if (link && button && inner) {
          const innerLinks = inner.querySelectorAll('a');
          const innerFirstLink = innerLinks[0];
          const innerLastLink = innerLinks[innerLinks.length - 1];
          const nextItem = this.dropdownMainItems[index + 1] ?? this.dropdownMainItems[0];
          const previousItem = this.dropdownMainItems[index - 1] ?? this.dropdownMainItems[this.dropdownMainItems.length - 1];
          const nextLink = nextItem.querySelector('a');
          const previousLink = previousItem.querySelector('a');

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
            innerFirstLink,
            innerLastLink,
            nextLink,
            previousLink,
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
    this.catalogButton = undefined;
    this.searchInput = undefined;
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

    this.dropdowns.forEach(({ item, link, button, inner, innerFirstLink, innerLastLink, nextLink, previousLink }) => {
      link.addEventListener('mouseenter', () => {
        eventHandler(item, inner);
      }, { signal: this.abortController.signal });

      link.addEventListener('keydown', (event) => {
        const { key } = event;

        if (key === 'ArrowRight') {
          event.preventDefault();

          if (innerFirstLink) {
            innerFirstLink.focus();
          }
        }

        if (key === 'ArrowDown') {
          event.preventDefault();

          if (nextLink) {
            nextLink.focus();
          }
        }

        if (key === 'ArrowUp') {
          event.preventDefault();

          if (previousLink) {
            previousLink.focus();
          }
        }
      }, { signal: this.abortController.signal });

      link.addEventListener('focus', () => {
        eventHandler(item, inner);
      }, { signal: this.abortController.signal });

      button.addEventListener('click', () => {
        eventHandler(item, inner);
      }, { signal: this.abortController.signal });

      if (innerFirstLink) {
        innerFirstLink.addEventListener('keydown', (event) => {
          const { key, shiftKey } = event;

          if (key === 'ArrowLeft' || (shiftKey && key === 'Tab')) {
            event.preventDefault();

            link.focus();
          }
        }, { signal: this.abortController.signal });
      }

      if (innerLastLink && this.catalogButton && this.searchInput) {
        innerLastLink.addEventListener('keydown', (event) => {
          const { key } = event;

          if (key === 'Tab') {
            event.preventDefault();

            this.catalogButton.click();
            this.searchInput.focus();
          }
        }, { signal: this.abortController.signal });
      }
    });
  }

  mobileEvents() {
    this.dropdowns.forEach(({ item, link, button, inner, innerFirstLink, innerLastLink, nextLink, previousLink }) => {
      button.addEventListener('click', () => {
        inner.classList.toggle('dropdown-active');
      }, { signal: this.abortController.signal });
    });
  }
}

customElements.define('catalog-block', CatalogBlock);
