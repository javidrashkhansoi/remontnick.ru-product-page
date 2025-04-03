import Swiper from 'swiper';
import { Keyboard, Navigation, Scrollbar, Thumbs, } from 'swiper/modules';

class HeroSliders extends HTMLElement {
  /** @type {HTMLDivElement} */
  slider;
  /** @type {HTMLDivElement} */
  thumbs;
  /** @type {HTMLDivElement} */
  prev;
  /** @type {HTMLDivElement} */
  next;
  /** @type {HTMLDivElement} */
  scrollbar;
  /** @type {Swiper} */
  swiper;
  /** @type {Swiper} */
  thumbsSwiper;

  constructor() {
    super();
  }

  connectedCallback() {
    this.slider = this.querySelector('.hero-slider');
    this.thumbs = this.querySelector('.hero-thumbs');

    if (this.thumbs) {
      this.thumbsSwiper = new Swiper(this.thumbs, {
        slidesPerView: 4,
        spaceBetween: 16,
        direction: 'vertical',
      });
    }

    if (this.slider) {
      this.prev = this.querySelector('.slider-arrow--prev');
      this.next = this.querySelector('.slider-arrow--next');
      this.scrollbar = this.querySelector('.hero-slider__scrollbar');

      this.swiper = new Swiper(this.slider, {
        modules: [Keyboard, Navigation, Scrollbar, Thumbs,],
        keyboard: {
          enabled: true,
          pageUpDown: false,
        },
        navigation: {
          enabled: true,
          nextEl: this.next,
          prevEl: this.prev,
        },
        scrollbar: {
          el: this.scrollbar,
          draggable: true,
          enabled: true,
          hide: false,
        },
        thumbs: {
          swiper: this.thumbs,
        },
        breakpoints: {
          '769.1': {

          },
        },
        // slidesPerView: 1,
        spaceBetween: 16,
      });
    }
  }

  disconnectedCallback() {
    this.swiper?.destroy(true, true);
    this.thumbsSwiper?.destroy(true, true);

    this.swiper = null;
    this.thumbsSwiper = null;
    this.slider = null;
    this.thumbs = null;
    this.prev = null;
    this.next = null;
    this.scrollbar = null;
  }
}

customElements.define('hero-sliders', HeroSliders);
