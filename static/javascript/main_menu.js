const sideMenuToggleEvent = new Event('sideMenuToggle');

function getCssVariableValue(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

const toggleMobileMenu = () => {
    const hamburgerMenuItems = document.getElementById("hamburgerMenuItems");
    hamburgerMenuItems.classList.toggle("show");
};

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", toggleMobileMenu);


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

  window.dispatchEvent(sideMenuToggleEvent);
}

function showModal(modal) {
  if ($('#hamburgerMenuItems').hasClass('show')) {
    toggleMobileMenu(); // Close the mobile menu if it's open
  }
  modal.style.display = "block";
  modal.querySelector(".modal-content").style.display = "block";
  setTimeout(function () {
    modal.classList.add("modal-show");
  }, 100);
}


function closeModal() {
  const modal = document.getElementById("settingsModal");
  hideModal(modal);
}

function hideModal(modal) {
  modal.classList.remove("modal-show");
  setTimeout(function () {
    modal.style.display = "none";
    modal.querySelector(".modal-content").style.display = "none";
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  const settingsBtn = document.getElementById("settingsBtn");
  const settingsBtnMobile = document.getElementById("settingsBtnMobile");
  const settingsModal = document.getElementById("settingsModal");

  settingsBtn.addEventListener("click", () => showModal(settingsModal));
  settingsBtnMobile.addEventListener("click", () => showModal(settingsModal));
});

function handleWindowResize() {
  const sideMenu = document.querySelector('.side-menu');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const contentWrapper = document.getElementById('content-wrapper');
  const width = window.innerWidth;

  if (width <= 767) {
    sideMenu.style.display = 'none';
    hamburgerMenu.style.display = 'block';
    contentWrapper.style.marginLeft = '0';
  } else {
    sideMenu.style.display = 'block';
    hamburgerMenu.style.display = 'none';
    contentWrapper.style.marginLeft = sideMenu.classList.contains('collapsed') ? getCssVariableValue('--side-menu-collapsed-width') : getCssVariableValue('--side-menu-width');
  }
}

let lastScrollTop = 0;
const hamburgerMenu = document.querySelector('.hamburger-menu');

window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        hamburgerMenu.style.top = '-76px';
    } else {
        // Scrolling up
        hamburgerMenu.style.top = '0';
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});



window.addEventListener('resize', handleWindowResize);

document.addEventListener('DOMContentLoaded', () => {
  handleWindowResize();
});

