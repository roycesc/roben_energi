function closeHamburgerMenu() {
  const hamburgerMenuItems = document.getElementById("hamburgerMenuItems");
  const contentWrapper = document.getElementById("content-wrapper");

  if (hamburgerMenuItems.classList.contains("show")) {
    hamburgerMenuItems.classList.remove("show");

    // Reapply the transition on the content-wrapper
    contentWrapper.style.transition = 'margin-top 0.3s ease-in-out';

    setTimeout(() => {
      contentWrapper.style.marginTop = "0";
    }, 10);
  }
}

// Settings Modal transition
//function showModal(modal) {
//  modal.style.display = "block";
//  modal.querySelector(".modal-content").style.display = "block";
//  setTimeout(function () {
//    modal.classList.add("modal-show");
//  }, 100);
//}
//    const contentWrapper = document.getElementById("content-wrapper");
//  contentWrapper.style.transition = "transform 0.3s ease-in-out";
//  contentWrapper.style.transform = "translateY(0)";

  // Add the 'hide' class to hamburgerMenuItems
//  const hamburgerMenuItems = document.getElementById("hamburgerMenuItems");
//  hamburgerMenuItems.classList.add("hide");
//}


//function hideModal(modal) {
//  modal.classList.remove("modal-show");
//  setTimeout(function () {
//    modal.style.display = "none";
//    modal.querySelector(".modal-content").style.display = "none";
//  }, 500);
//}







  // Remove the 'hide' class from hamburgerMenuItems
//const hamburgerMenuItems = document.getElementById("hamburgerMenuItems");
//  hamburgerMenuItems.classList.remove("hide");
//}

const menuItemLinks = document.querySelectorAll("#hamburgerMenuItems .menu-link");
menuItemLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const hamburgerMenuItems = document.getElementById("hamburgerMenuItems");
        hamburgerMenuItems.classList.remove("show"); // Use 'remove' instead of 'add'
    });
});

const settingsModal = document.getElementById("settingsModal");
const settingsBtn = document.getElementById("settingsBtn");
const settingsBtnMobile = document.getElementById("settingsBtnMobile");
const closeBtn = document.querySelector('.modal-header .close');

settingsBtn.onclick = function() {
  showModal(settingsModal);
}

settingsBtnMobile.onclick = function() {
  showModal(settingsModal);
}

closeBtn.onclick = function() {
  hideModal(settingsModal);
}

window.onclick = function (event) {
  if (event.target == settingsModal) {
    closeHamburgerMenu(); // Close the hamburger menu when the modal is hidden by clicking outside of it
    hideModal(settingsModal);
  }
};

// Add this code block to attach an event listener to the closeBtn
closeBtn.addEventListener("click", (event) => {
  event.preventDefault();
  closeHamburgerMenu(); // Close the hamburger menu when the modal is hidden by pressing the close button
  hideModal(settingsModal);
});

const cancelButton = document.getElementById('close');
if (cancelButton) {
  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    closeHamburgerMenu(); // Close the hamburger menu when the modal is hidden by pressing the close button
    hideModal(settingsModal);
  });
}
