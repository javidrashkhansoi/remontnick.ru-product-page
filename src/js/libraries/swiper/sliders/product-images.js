import Swiper from 'swiper';
import { Pagination, } from 'swiper/modules';

class ProductImages extends HTMLElement {
  /** @type {HTMLDivElement} */
  slider;
  /** @type {HTMLDivElement} */
  pagination;
  /** @type {Swiper} */
  swiper;

  constructor() {
    super();
  }

  connectedCallback() {
    this.slider = this.querySelector('.product-images');

    if (this.slider) {
      this.pagination = this.querySelector('.slider-pagination');

      this.swiper = new Swiper(this.slider, {
        modules: [Pagination,],
        pagination: {
          clickable: true,
          el: this.pagination,
          enabled: true,
        },
        spaceBetween: 16,
        nested: true,
      });
    }
  }

  disconnectedCallback() {
    this.swiper?.destroy(true, true);

    this.swiper = null;
    this.slider = null;
    this.pagination = null;
  }
}

customElements.define('product-images', ProductImages);
