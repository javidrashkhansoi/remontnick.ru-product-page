import Swiper from 'swiper';
import { Keyboard, Navigation, } from 'swiper/modules';

class ProductsSlider extends HTMLElement {
  /** @type {HTMLDivElement} */
  slider;
  /** @type {HTMLDivElement} */
  prev;
  /** @type {HTMLDivElement} */
  next;
  /** @type {Swiper} */
  swiper;
  /** @type {boolean} */
  isResult;

  constructor() {
    super();
  }

  connectedCallback() {
    this.slider = this.querySelector('.products-slider');

    if (this.slider) {
      this.prev = this.querySelector('.slider-arrow--prev');
      this.next = this.querySelector('.slider-arrow--next');
      this.isResult = this.hasAttribute('result');

      const sliderOptions = this.isResult ? {
        breakpoints: {
          '350.1': {
            slidesPerView: 1.283018868,
          },
          '550.1': {
            slidesPerView: 2,
          },
          '768.1': {
            slidesPerView: 3,
          },
          '992.1': {
            slidesPerView: 4,
          },
        },
        spaceBetween: 16,
      } : {
        breakpoints: {
          '350.1': {
            slidesPerView: 1.283018868,
          },
          '550.1': {
            slidesPerView: 2,
          },
          '900.1': {
            slidesPerView: 3,
          },
          '1250.1': {
            slidesPerView: 4,
          },
        },
        on: {
          resize: (swiper) => {
            swiper.params.spaceBetween = this.gap;
          },
        },
        spaceBetween: this.gap,
      };

      this.swiper = new Swiper(this.slider, {
        ...sliderOptions,
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
        slidesPerView: 1,
      });
    }
  }

  disconnectedCallback() {
    this.swiper?.destroy(true, true);

    this.swiper = null;
    this.slider = null;
    this.prev = null;
    this.next = null;
    this.isResult = null;
  }

  get gap() {
    return Math.min(32, 16 + 16 * ((window.innerWidth - 320) / 1032));
  }
}

customElements.define('products-slider', ProductsSlider);
