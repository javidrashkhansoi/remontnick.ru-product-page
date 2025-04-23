class SearchBlock extends HTMLElement {
  /** @type {HTMLDivElement} */
  resultBlock;
  /** @type {HTMLButtonElement} */
  returnButton;
  /** @type {HTMLButtonElement} */
  clearButton;
  /** @type {HTMLButtonElement} */
  submitButton;
  /** @type {HTMLAnchorElement | HTMLButtonElement} */
  resultFirstLink;
  /** @type { HTMLAnchorElement | HTMLButtonElement} */
  resultLastLink;
  /** @type {HTMLAnchorElement} */
  nextLink;
  /** @type {HTMLButtonElement} */
  headerSearchIcon;
  /** @type {NodeListOf<HTMLButtonElement>} */
  burgerSearchIcons;
  /** @type {HTMLButtonElement} */
  burgerCloseButton;
  /** @type {HTMLButtonElement} */
  catalogButton;
  /** @type {HTMLInputElement} */
  input;
  /** @type {MediaQueryList} */
  isMobile = matchMedia('(max-width: 768px)');
  /** @type {MediaQueryList} */
  isTablet = matchMedia('(min-width: 992.1px)');
  /** @type {MediaQueryList} */
  isDesktop = matchMedia('(min-width: 1352.1px)');
  /** @type {AbortController} */
  abortController;
  /** @type {AbortController} */
  mediaAbortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.mediaAbortController = new AbortController();
    this.resultBlock = document.querySelector('.header-result');
    this.returnButton = this.querySelector('.header-search__return');
    this.clearButton = this.querySelector('.header-search__clear');
    this.submitButton = this.querySelector('.header-search__button');
    this.headerSearchIcon = document.querySelector('.header-icon--search');
    this.burgerSearchIcons = document.querySelectorAll('.burger-header__search');
    this.burgerCloseButton = document.querySelector('.burger-header__close');
    this.catalogButton = document.querySelector('.header-catalog-button');
    this.input = this.querySelector('.header-search__input');

    if (this.input && this.clearButton) {
      this.clearButton.addEventListener('click', () => {
        this.input.value = '';
        this.input.focus();
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
      }, { signal: this.mediaAbortController.signal });

      this.input.addEventListener('keydown', (event) => {
        const { key } = event;

        if (key === 'Escape') {
          event.preventDefault();

          this.input.blur();
        }
      }, { signal: this.mediaAbortController.signal });
    }

    if (this.resultBlock) {
      const resultLinks = this.resultBlock.querySelectorAll('a, button');

      this.resultFirstLink = resultLinks[0];
      this.resultLastLink = resultLinks[resultLinks.length - 1];

      this.init(this.isMobile);

      this.isMobile.addEventListener('change', (event) => {
        this.init(event);
      }, { signal: this.mediaAbortController.signal });

      this.isDesktop.addEventListener('change', () => {
        this.updateInertElements();
      }, { signal: this.mediaAbortController.signal });

      this.burgerSearchIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
          if (this.burgerCloseButton) {
            this.burgerCloseButton.click();
          }

          setTimeout(() => {
            this.show();
          }, 0);
        }, { signal: this.mediaAbortController.signal });
      });

      document.addEventListener('keydown', (event) => {
        const { key } = event;

        if (key === 'Escape') {
          this.hide();
        }
      }, { signal: this.mediaAbortController.signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.mediaAbortController?.abort();

    this.abortController = undefined;
    this.mediaAbortController = undefined;
    this.resultBlock = undefined;
    this.returnButton = undefined;
    this.clearButton = undefined;
    this.submitButton = undefined;
    this.resultFirstLink = undefined;
    this.resultLastLink = undefined;
    this.nextLink = undefined;
    this.headerSearchIcon = undefined;
    this.burgerSearchIcons = undefined;
    this.burgerCloseButton = undefined;
    this.catalogButton = undefined;
    this.input = undefined;
  }

  /** @param {MediaQueryList | MediaQueryListEvent} media */
  init(media) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    this.updateInertElements();

    const { matches } = media;

    if (matches) {
      this.mobileEvents();
    } else {
      this.desktopEvents();
    }
  }

  mobileEvents() {
    if (this.returnButton) {
      this.returnButton.addEventListener('click', () => {
        this.hide();
      }, { signal: this.abortController.signal });
    }

    if (this.headerSearchIcon) {
      this.headerSearchIcon.addEventListener('click', () => {
        this.show();
      }, { signal: this.abortController.signal });
    }
  }

  desktopEvents() {
    if (this.input) {
      this.input.addEventListener('focus', () => {
        this.show();
      }, { signal: this.abortController.signal });

      this.input.addEventListener('keydown', (event) => {
        const { key, shiftKey } = event;

        if (shiftKey && key === 'Tab') {
          this.hide();
        }
      }, { signal: this.abortController.signal });
    }

    if (this.submitButton && this.resultFirstLink) {
      this.submitButton.addEventListener('keydown', (event) => {
        const { key, shiftKey } = event;

        if (!shiftKey && key === 'Tab' && this.resultBlock.classList.contains('header-result--show')) {
          event.preventDefault();

          this.resultFirstLink.focus();
        }
      }, { signal: this.abortController.signal });

      this.resultFirstLink.addEventListener('keydown', (event) => {
        const { key, shiftKey } = event;

        if (shiftKey && key === 'Tab') {
          event.preventDefault();

          this.submitButton.focus();
        }
      }, { signal: this.abortController.signal });
    }

    if (this.resultLastLink) {
      this.resultLastLink.addEventListener('keydown', (event) => {
        const { key } = event;

        if (key === 'Tab') {
          this.nextLink = this.closest('.header-actions').querySelector('.promotions-link') ?? this.closest('.header-main__row').querySelector('.icon-buttons .header-icon');

          if (this.nextLink) {
            event.preventDefault();

            this.nextLink.focus();
            this.hide();
          }
        }
      }, { signal: this.abortController.signal });
    }

    document.addEventListener('click', (event) => {
      /** @type {{ target: HTMLElement }} */
      const { target } = event;

      if (!target.closest('.header-result') && !target.closest('.header-search')) {
        this.hide();
      }
    }, { signal: this.abortController.signal });
  }

  show() {
    if (!this.resultBlock.classList.contains('header-result--show')) {
      const { matches: isTablet } = this.isTablet;

      if (this.catalogButton.classList.contains('active') && isTablet) {
        this.catalogButton.click();
      }

      this.resultBlock.classList.add('header-result--show');

      this.inertElements?.forEach((element) => {
        element.inert = true;
      });
    }
  }

  hide() {
    if (this.resultBlock.classList.contains('header-result--show')) {
      this.input.blur();
      this.resultBlock.classList.remove('header-result--show');

      this.inertedElements.forEach((element) => {
        element.inert = false;
      });
    }
  }

  updateInertElements() {
    if (this.resultBlock.classList.contains('header-result--show')) {
      this.inertedElements.forEach((element) => {
        element.inert = false;
      });

      this.inertElements?.forEach((element) => {
        element.inert = true;
      });
    }
  }

  /** @returns {NodeListOf<HTMLElement>} */
  get inertElements() {
    const { matches: isMobile } = this.isMobile;
    const { matches: isDesktop } = this.isDesktop;

    if (!isMobile && !isDesktop) {
      return document.querySelectorAll('#header ~ *:not(movable-element:has(.header-result))');
    }

    if (isMobile) {
      return document.querySelectorAll('#header, #header ~ *:not(movable-element:has(.header-result))');
    }

    return undefined;
  }

  /** @returns {NodeListOf<HTMLElement>} */
  get inertedElements() {
    return document.querySelectorAll('[inert]');
  }
}

customElements.define('search-block', SearchBlock);
