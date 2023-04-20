function saveSettings() {
    const regionSelect = document.getElementById('regionSelect');
    const currencySelect = document.getElementById('currencySelect');
    const updateButton = document.getElementById('updateButton');

    localStorage.setItem('selectedRegion', regionSelect.value);
    localStorage.setItem('selectedCurrency', currencySelect.value);

    updateButton.disabled = true;
    updateButton.textContent = 'Updated';

    setTimeout(() => {
        updateButton.disabled = false;
        updateButton.textContent = 'Update';
    }, 3000); // Change back to "Update" after 3 seconds

    // Reload the /prices page with the selected region as a query parameter
    updatePricesPage(regionSelect.value);}

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

function updatePricesPage(selectedRegion) {
    // Send a POST request to the server with the selected region
    fetch('/prices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedRegion }),
    })
    .then((response) => {
        if (response.ok) {
            console.log('Region updated successfully');
        } else {
            console.error('Error updating region');
        }
    });
}


