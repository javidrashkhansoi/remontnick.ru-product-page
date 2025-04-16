/** @type {HTMLDivElement} */
const headerWrapper = document.querySelector('.header__wrapper');
/** @type {HTMLDivElement} */
const headerTop = headerWrapper?.querySelector('.header-top');

if (headerTop) {
  const headerTopResizeObserver = new ResizeObserver((entries) => {
    entries.forEach(entry => {
      headerWrapper.style.removeProperty('--header-top-height');

      setTimeout(() => {
        const { borderBoxSize } = entry;
        const { blockSize } = borderBoxSize[0];

        headerWrapper.style.setProperty('--header-top-height', `${blockSize}px`);
      });
    });
  });

  headerTopResizeObserver.observe(headerTop);
}
