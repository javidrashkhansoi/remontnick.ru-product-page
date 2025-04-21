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
  /** @type {HTMLInputElement} */
  input;
  /** @type {MediaQueryList} */
  isMobile = matchMedia('(max-width: 768px)');
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
    this.input = undefined;
  }

  /** @param {MediaQueryList | MediaQueryListEvent} media */
  init(media) {
    this.abortController?.abort();
    this.abortController = new AbortController();

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
        this.resultBlock.classList.remove('header-result--show');
      }, { signal: this.abortController.signal });
    }
  }

  desktopEvents() {
    if (this.input) {
      this.input.addEventListener('focus', () => {
        this.resultBlock.classList.add('header-result--show');
      }, { signal: this.abortController.signal });

      this.input.addEventListener('keydown', (event) => {
        const { key, shiftKey } = event;

        if (shiftKey && key === 'Tab') {
          this.resultBlock.classList.remove('header-result--show');
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
            this.resultBlock.classList.remove('header-result--show');
          }
        }
      }, { signal: this.abortController.signal });
    }
  }
}

customElements.define('search-block', SearchBlock);
