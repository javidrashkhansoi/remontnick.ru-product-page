/** @type {HTMLDivElement} */
const headerTop = document.querySelector('.header-top');

if (headerTop) {
  const headerTopResizeObserver = new ResizeObserver((entries) => {
    entries.forEach(entry => {
      document.documentElement.style.removeProperty('--header-top-height');

      setTimeout(() => {
        const { borderBoxSize } = entry;
        const { blockSize } = borderBoxSize[0];

        document.documentElement.style.setProperty('--header-top-height', `${blockSize}px`);
      });
    });
  });

  headerTopResizeObserver.observe(headerTop);
}
