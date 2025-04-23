class DropdownButton extends HTMLElement {
  /** @type {string} */
  dropdown;
  /** @type {HTMLDivElement} */
  dropdownItem;
  /** @type {HTMLButtonElement} */
  button;
  /** @type {SearchBlock} */
  searchBlock;
  /** @type {MediaQueryList} */
  isDesktop = matchMedia('(min-width: 1200.1px)');
  /** @type {AbortController} */
  mediaAbortController;
  /** @type {AbortController} */
  abortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.mediaAbortController = new AbortController();

    this.dropdown = this.getAttribute('dropdown');
    this.dropdownItem = document.querySelector(`[data-dropdown-inner="${this.dropdown}"]`);
    this.button = this.querySelector('button');
    this.searchBlock = document.querySelector('search-block');

    if (this.dropdownItem && this.button) {
      this.init(this.isDesktop);

      this.isDesktop.addEventListener('change', (event) => {
        this.init(event);
      }, { signal: this.mediaAbortController.signal, });
    }
  }

  disconnectedCallback() {
    this.mediaAbortController?.abort();
    this.abortController?.abort();

    this.mediaAbortController = undefined;
    this.abortController = undefined;
    this.dropdown = undefined;
    this.dropdownItem = undefined;
    this.button = undefined;
    this.searchBlock = undefined;
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
    if (this.searchBlock) {
      this.button.addEventListener('mouseenter', () => {
        this.searchBlock.hide();
      }, { signal: this.abortController.signal });
    }
  }

  mobileEvents() {
    this.button.addEventListener('click', () => {
      this.dropdownItem.classList.add('active');
    }, { signal: this.abortController.signal });
  }
}

customElements.define('dropdown-button', DropdownButton);
