
// Gets veriables values from the css
function getCssVariableValue(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

// Increase the contents of the webpage in relation to the side menu size changing
function toggleCollapse() {
  const sideMenu = document.querySelector('.side-menu');
  const contentWrapper = document.getElementById('content-wrapper');
  sideMenu.classList.toggle('collapsed');

  const sideMenuWidth = getCssVariableValue('--side-menu-width');
  const sideMenuCollapsedWidth = getCssVariableValue('--side-menu-collapsed-width');
  
  if (sideMenu.classList.contains('collapsed')) {
    contentWrapper.style.marginLeft = sideMenuCollapsedWidth;
  } else {
    contentWrapper.style.marginLeft = sideMenuWidth;
  }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  const hamburgerMenuItems = document.getElementById("hamburgerMenuItems");
  hamburgerMenuItems.classList.toggle("hide");
}

// Change side menu on window resize
function handleWindowResize() {
  const sideMenu = document.querySelector('.side-menu');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const contentWrapper = document.getElementById('content-wrapper');
  const width = window.innerWidth;

  if (width <= 767) {
    sideMenu.style.display = 'none';
    hamburgerMenu.style.display = 'flex';
    contentWrapper.style.marginLeft = '0';
  } else {
    sideMenu.style.display = 'block';
    hamburgerMenu.style.display = 'none';
    contentWrapper.style.marginLeft = sideMenu.classList.contains('collapsed') ? getCssVariableValue('--side-menu-collapsed-width') : getCssVariableValue('--side-menu-width');
  }
}

// Add event listener for window resize
window.addEventListener('resize', handleWindowResize);

// Set initial side menu state based on window size
document.addEventListener('DOMContentLoaded', () => {
  handleWindowResize();
});


