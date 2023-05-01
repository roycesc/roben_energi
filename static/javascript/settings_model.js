
    // Get the settings form element
    var settingsForm = document.getElementById("settingsForm");

    // Handle the form submission
    settingsForm.onsubmit = function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the selected region value
        var selectedRegion = document.getElementById("selectedRegion").value;

        // Send the selected region to the server using AJAX
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/settings", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Close the modal and handle the response, if needed
                modal.style.display = "none";
            }
        };
        xhr.send("selectedRegion=" + encodeURIComponent(selectedRegion));
    };

// Get the settings button and modal elements
var settingsBtn = document.getElementById("settingsBtn");
var settingsModal = document.getElementById("settingsModal");
var closeBtn = document.getElementsByClassName("close")[0];

// When the user clicks on the settings button, open the modal
settingsBtn.onclick = function() {
    settingsModal.style.display = "block";
}

// When the user clicks on the close button, close the modal
closeBtn.onclick = function() {
    settingsModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == settingsModal) {
        settingsModal.style.display = "none";
    }
}
// Get the settings button for mobile and modal elements
var settingsBtnMobile = document.getElementById("settingsBtnMobile");

// When the user clicks on the settings button for mobile, open the modal
settingsBtnMobile.onclick = function() {
    settingsModal.style.display = "block";
}

const cancelButton = document.getElementById('close');
if (cancelButton) {
    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        // Close the modal
        settingsModal.style.display = "none";

    });
}
