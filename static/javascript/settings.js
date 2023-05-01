let currentSelectedRegion = localStorage.getItem('selectedRegion') || 'SYS';



export function getSelectedRegion() {
    return currentSelectedRegion;
}

function updateServer() {
    const regionSelect = document.getElementById("regionSelect");
    const selectedRegion = regionSelect.value;

    // Send a POST request to the '/settings' route with the selectedRegion
    return fetch("/settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `selectedRegion=${selectedRegion}`,
    });
}


function saveSettings() {
    const regionSelect = document.getElementById('regionSelect');
    const currencySelect = document.getElementById('currencySelect');
    const updateButton = document.getElementById('updateButton');

    localStorage.setItem('selectedRegion', regionSelect.value);
    localStorage.setItem('selectedCurrency', currencySelect.value);

    updateButton.disabled = true;
    updateButton.textContent = 'Updated';

    setTimeout(() => {
        updateButton.disabled = true;
        updateButton.textContent = 'Update and Close';
    }, 3000); // Change back to "Update" after 3 seconds

    // Fetch the updated price data for the selected region and update the 'prices.html' page
    fetch(`/prices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedRegion: regionSelect.value }),
    })
    .then((response) => response.text())
    .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const pricesContainer = doc.querySelector('#content-wrapper #prices-container');
        const targetContainer = document.querySelector('#content-wrapper #prices-container');

        if (pricesContainer && targetContainer) {
            targetContainer.innerHTML = pricesContainer.innerHTML;
        }
    });
    currentSelectedRegion = regionSelect.value;

    // Refresh the page to redraw the chart with the updated settings
    window.location.reload();
}




function loadSettings() {
    const regionSelect = document.getElementById('regionSelect');
    const currencySelect = document.getElementById('currencySelect');
    const selectedRegion = localStorage.getItem('selectedRegion');
    const selectedCurrency = localStorage.getItem('selectedCurrency');

    if (regionSelect && selectedRegion) {
        regionSelect.value = selectedRegion;
    }

    if (currencySelect && selectedCurrency) {
        currencySelect.value = selectedCurrency;
    }

    if (updateButton) {
        updateButton.disabled = true;
    }
}

function enableUpdateButton() {
    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.disabled = false;
    }
}

function disableUpdateButton() {
    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.disabled = true;
        updateButton.textContent = 'Updated';
    }
}

// Call the loadSettings function when the page loads

window.addEventListener('DOMContentLoaded', loadSettings);

const regionSelect = document.getElementById('regionSelect');
const currencySelect = document.getElementById('currencySelect');

if (regionSelect) {
    regionSelect.addEventListener('change', enableUpdateButton);
}
if (currencySelect) {
    currencySelect.addEventListener('change', enableUpdateButton);
}


// Add the event listener for the 'Update' button
const updateButton = document.getElementById('updateButton');
if (updateButton) {
    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Call saveSettings function to save the region and currency
        saveSettings();

        try {
            const response = await updateServer();

            if (response.status === 200) {
                // No alert when settings update successfully
                disableUpdateButton();
            } else {
                alert("Failed to update settings.");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Failed to update settings.");
        }
    });
}









