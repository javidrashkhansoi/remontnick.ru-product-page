class LengthElement extends HTMLElement {
  /** @type {NodeListOf<HTMLLIElement>} */
  lengthItems;
  /** @type {ResizeObserver} */
  observer;

  constructor() {
    super();
  }

  connectedCallback() {
    this.lengthItems = document.querySelectorAll('.hero-length__item');

    this.observer = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        this.lengthItems.forEach(item => {
          const { left } = item.getBoundingClientRect();

          item.style.setProperty('--tooltip-left', `${left}px`);
        });
      });
    });

    this.observer.observe(document.body);
  }

  disconnectedCallback() {
    this.observer?.disconnect();

    this.observer = null;
    this.lengthItems = null;
  }
}

customElements.define('length-element', LengthElement);
