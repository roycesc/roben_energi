function saveSettings() {
    const regionSelect = document.getElementById('regionSelect');
    const currencySelect = document.getElementById('currencySelect');

    localStorage.setItem('selectedRegion', regionSelect.value);
    localStorage.setItem('selectedCurrency', currencySelect.value);
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
}

// Call the loadSettings function when the page loads
window.addEventListener('DOMContentLoaded', loadSettings);

