class ActionButton extends HTMLElement {
  /** @type {AbortController} */
  abortController;
  /** @type {HTMLButtonElement} */
  button;

  constructor() {
    super();
  }

  connectedCallback() {
    this.button = this.querySelector('button');

    if (this.button) {
      this.abortController = new AbortController();

      this.button.addEventListener('click', (event) => {
        this.button.classList.toggle('active');
      });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
    this.button = null;
  }
}

customElements.define('action-button', ActionButton);
