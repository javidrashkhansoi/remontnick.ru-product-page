const headerResult = document.querySelector('.header-result');

if (headerResult) {
  // const headerSearchInput = document.querySelector('.header-search__input');
  const searchOpeners = document.querySelectorAll('.header-icon--search, .burger-header__search');

  // headerSearchInput?.addEventListener('focus', () => {
  //   showSearchResult();
  // });

  searchOpeners.forEach(searchOpener => {
    searchOpener.addEventListener('click', () => {
      showSearchResult();
    });
  });

  document.addEventListener('click', (event) => {
    /** @type {{ target: HTMLElement }} */
    const { target } = event;

    if (!target.closest('.header-result') && !target.closest('.header-search') && !target.closest('.header-icon--search') && !target.closest('.burger-header__search')) {
      hideSearchResult();
    }
  });

  document.addEventListener('keydown', (event) => {
    const { key } = event;

    if (key === 'Escape') {
      hideSearchResult();
    }
  });

  function showSearchResult() {
    headerResult.classList.add('header-result--show');
  }

  function hideSearchResult() {
    headerResult.classList.remove('header-result--show');
  }
}
