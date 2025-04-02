class ActionButton extends HTMLElement {
  /** @type {HTMLButtonElement} */
  button;
  /** @type {AbortController} */
  abortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.button = this.querySelector('button');

    if (this.button) {
      this.abortController = new AbortController();

      this.button.addEventListener('click', (event) => {
        this.button.classList.toggle('active');
      }, { signal: this.abortController.signal });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
    this.button = null;
  }
}

customElements.define('action-button', ActionButton);
