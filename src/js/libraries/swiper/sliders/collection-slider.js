import Swiper from 'swiper';
import { Keyboard, Navigation, } from 'swiper/modules';

class CollectionSlider extends HTMLElement {
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
    this.slider = this.querySelector('.collection-slider');

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
          '768.1': {
            slidesPerView: 5,
          },
        },
        on: {
          resize: (swiper) => {
            swiper.params.spaceBetween = this.gap;
          },
        },
        slidesPerView: 4,
        spaceBetween: this.gap,
      });
    }
  }

  disconnectedCallback() { }

  get gap() {
    return Math.min(16, 8 + 8 * ((window.innerWidth - 320) / 1032));
  }
}

customElements.define('collection-slider', CollectionSlider);
