import { Burger } from "../../modules/burger.js";

const burger = new Burger({
  breakpoint: 1200,
  a11y: {
    inertElementsSelectors: '.header, .header ~ *:not(movable-element[target="header"])',
  },
});
