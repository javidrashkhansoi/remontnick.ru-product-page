class BurgerHeader extends HTMLElement {
  /** @type {HTMLButtonElement} */
  backButton;
  /** @type {HTMLDivElement} */
  dropdownInner;
  /** @type {AbortController} */
  abortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.backButton = this.querySelector('.burger-header__back');
    this.dropdownInner = this.closest('[data-dropdown-inner]');

    if (this.backButton && this.dropdownInner) {
      this.backButton.addEventListener('click', () => {
        this.dropdownInner.classList.remove('active', 'dropdown-active');
      }, { signal: this.abortController?.signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();

    this.abortController = undefined;
    this.backButton = undefined;
    this.dropdownInner = undefined;
  }
}

customElements.define('burger-header', BurgerHeader);
