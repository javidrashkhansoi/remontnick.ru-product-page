import Swiper from 'swiper';
import { Keyboard, Navigation, } from 'swiper/modules';

class ProductObjects extends HTMLElement {
  /** @type {HTMLDivElement} */
  slider;
  /** @type {HTMLDivElement} */
  prev;
  /** @type {HTMLDivElement} */
  next;
  /** @type {Swiper} */
  swiper;

  constructor() {
    super();
  }

  connectedCallback() {
    this.slider = this.querySelector('.objects-slider');

    if (this.slider) {
      this.prev = this.querySelector('.slider-arrow--prev');
      this.next = this.querySelector('.slider-arrow--next');

      this.swiper = new Swiper(this.slider, {
        modules: [Keyboard, Navigation,],
        keyboard: {
          enabled: true,
          pageUpDown: false,
        },
        navigation: {
          enabled: true,
          nextEl: this.next,
          prevEl: this.prev,
        },
        breakpoints: {
          '600.1': {
            slidesPerView: 2,
          },
          '900.1': {
            slidesPerView: 3,
          },
          '1250.1': {
            slidesPerView: 4,
          },
        },
        slidesPerView: 1,
        spaceBetween: 16,
      });
    }
  }

  disconnectedCallback() {
    this.swiper?.destroy(true, true);

    this.swiper = null;
    this.slider = null;
    this.prev = null;
    this.next = null;
  }
}

customElements.define('product-objects', ProductObjects);
