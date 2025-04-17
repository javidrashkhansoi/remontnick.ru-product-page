/** @type {NodeListOf<HTMLButtonElement>} */
const dropdownButtons = document.querySelectorAll('[data-dropdown-button]');
/** @type {NodeListOf<HTMLButtonElement>} */
const dropdownCloseButtons = document.querySelectorAll('[data-dropdown-close]');

dropdownButtons.forEach(button => {
  const { dataset } = button;
  const { dropdownButton } = dataset;
  const dropdownInner = document.querySelector(`[data-dropdown-inner="${dropdownButton}"]`);

  if (dropdownInner) {
    button.addEventListener('click', () => {
      dropdownInner.classList.add('active');
    });
  }
});

dropdownCloseButtons.forEach(button => {
  const dropdownInner = button.closest('[data-dropdown-inner]');

  if (dropdownInner) {
    button.addEventListener('click', () => {
      dropdownInner.classList.remove('active');
    });
  }
});
