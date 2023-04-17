function saveSettings() {
    const regionSelect = document.getElementById('regionSelect');
    const currencySelect = document.getElementById('currencySelect');

    localStorage.setItem('selectedRegion', regionSelect.value);
    localStorage.setItem('selectedCurrency', currencySelect.value);

    document.getElementById('updateButton').disabled = true;
}

function loadSettings() {
    const regionSelect = document.getElementById('regionSelect');
    const currencySelect = document.getElementById('currencySelect');
    const selectedRegion = localStorage.getItem('selectedRegion');
    const selectedCurrency = localStorage.getItem('selectedCurrency');

    if (selectedRegion) {
        regionSelect.value = selectedRegion;
    }

    if (selectedCurrency) {
        currencySelect.value = selectedCurrency;
    }

    document.getElementById('updateButton').disabled = true;
}

function enableUpdateButton() {
    document.getElementById('updateButton').disabled = false;
}

// Call the loadSettings function when the page loads
window.addEventListener('DOMContentLoaded', loadSettings);

// Add the event listener for the 'Update' button
const updateButton = document.getElementById('updateButton');
updateButton.addEventListener('click', saveSettings);

// Add event listeners for the select elements to enable the 'Update' button
const regionSelect = document.getElementById('regionSelect');
const currencySelect = document.getElementById('currencySelect');

regionSelect.addEventListener('change', enableUpdateButton);
currencySelect.addEventListener('change', enableUpdateButton);
