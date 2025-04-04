class CounterElement extends HTMLElement {
  /** @type {HTMLInputElement} */
  input;
  /** @type {HTMLButtonElement} */
  minus;
  /** @type {HTMLButtonElement} */
  plus;
  /** @type {number} */
  min;
  /** @type {number} */
  max;
  /** @type {number} */
  step;
  /** @type {number} */
  value;
  /** @type {AbortController} */
  abortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.input = this.querySelector('input');
    this.minus = this.querySelector('.counter__button--minus');
    this.plus = this.querySelector('.counter__button--plus');

    if (this.input && this.minus && this.plus) {
      this.abortController = new AbortController();

      const { min = 1, max = 10, step = 1, value = 1, } = this.input;

      this.min = parseFloat(min);
      this.max = parseFloat(max);
      this.step = parseFloat(step);
      this.value = parseFloat(value);

      this.input.addEventListener('change', this.onChange.bind(this), { signal: this.abortController.signal });
      this.minus.addEventListener('click', this.onMinus.bind(this), { signal: this.abortController.signal });
      this.plus.addEventListener('click', this.onPlus.bind(this), { signal: this.abortController.signal });
    }
  }

  onChange() {
    const value = parseFloat(this.input.value);

    if (isNaN(value)) {
      this.input.value = this.value;

      return;
    }

    this.value = parseFloat(Math.max(Math.min(value, this.max), this.min).toFixed(2));

    this.input.value = this.value;

    this.input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  onMinus() {
    this.value = parseFloat(Math.max(this.value - this.step, this.min).toFixed(2));

    this.input.value = this.value;

    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  onPlus() {
    this.value = parseFloat(Math.min(this.value + this.step, this.max).toFixed(2));

    this.input.value = this.value;

    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  disconnectedCallback() {
    this.abortController?.abort();

    this.abortController = null;
    this.input = null;
    this.minus = null;
    this.plus = null;
    this.min = null;
    this.max = null;
    this.step = null;
    this.value = null;
  }
}

customElements.define('counter-element', CounterElement);
