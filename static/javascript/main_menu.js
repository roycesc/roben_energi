function toggleCollapse() {
  const sideMenu = document.querySelector('.side-menu');
  const contentWrapper = document.querySelector('.content-wrapper');
  sideMenu.classList.toggle('collapsed');
  contentWrapper.classList.toggle('menu-collapsed');

  // Trigger the window resize event
  window.dispatchEvent(new Event('resize'));
}
// Window resize

window.addEventListener('resize', () => {
  if (window.hasOwnProperty('onWindowResize')) {
    window.onWindowResize();
  }
});


function resizeCards() {
  const cardContainers = document.querySelectorAll('.card-container');
  const contentWrapper = document.querySelector('.content-wrapper');
  const isCollapsed = contentWrapper.classList.contains('menu-collapsed');
  const newWidth = isCollapsed
    ? `calc((100% - var(--side-menu-collapsed-width) - 32px) / 3)`
    : `calc((100% - var(--side-menu-width) - 32px) / 3)`;

  cardContainers.forEach((cardContainer) => {
    cardContainer.style.flex = `0 0 ${newWidth}`;
    cardContainer.style.maxWidth = newWidth;
  });

  // Update the margin-left property of content-wrapper
  contentWrapper.style.marginLeft = isCollapsed
    ? `calc(100% - (100% - var(--side-menu-collapsed-width)))`
    : `calc(100% - (100% - var(--side-menu-width)))`;
}
