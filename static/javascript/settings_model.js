import { showModal, hideModal } from './transition.js';


const settingsModal = document.getElementById("settingsModal");
const settingsBtn = document.getElementById("settingsBtn");
const settingsBtnMobile = document.getElementById("settingsBtnMobile");
const closeBtn = document.querySelector('.modal-header .close');

// When the user clicks on the settings button, open the modal
settingsBtn.onclick = function() {
  showModal(settingsModal);
}

settingsBtnMobile.onclick = function() {
  showModal(settingsModal);
}

const cancelButton = document.getElementById('close');
if (cancelButton) {
  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    hideModal(settingsModal);
  });
}

if (closeBtn) {
  closeBtn.onclick = function() {
    hideModal(settingsModal);
  };
}

