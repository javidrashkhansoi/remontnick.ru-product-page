class TabsElement extends HTMLElement {
  /** @type {NodeListOf<HTMLButtonElement>} */
  tabs;
  /** @type {NodeListOf<HTMLDivElement>} */
  panels;
  /** @type {AbortController} */
  abortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.tabs = this.querySelectorAll('[data-tab]');
    this.panels = this.querySelectorAll('[data-panel]');

    if (this.tabs.length === this.panels.length) {
      this.abortController = new AbortController();

      this.tabs.forEach((tab) => {
        const { dataset } = tab;
        const { tab: tabData } = dataset;

        tab.addEventListener('click', () => {
          this.tabs.forEach((item) => {
            item.classList.toggle('active', item.dataset.tab === tabData);
          });

          this.panels.forEach((item) => {
            item.toggleAttribute('hidden', item.dataset.panel !== tabData);
          });
        }, { signal: this.abortController.signal });
      });
    }
  }

  disconnectedCallback() {
    this.abortController?.abort();

    this.abortController = null;
    this.tabs = null;
    this.panels = null;
  }
}

customElements.define('tabs-element', TabsElement);
