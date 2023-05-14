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

function saveSettings(onDataUpdated) {
    const regionSelect = document.getElementById('regionSelect');
    const currencySelect = document.getElementById('currencySelect');
    const updateButton = document.getElementById('updateButton');

    localStorage.setItem('selectedRegion', regionSelect.value);
    localStorage.setItem('selectedCurrency', currencySelect.value);

    updateButton.disabled = true;
    updateButton.textContent = 'Updated';
    
    if (onDataUpdated) {
        onDataUpdated();
    }

    setTimeout(() => {
        updateButton.disabled = true;
        updateButton.textContent = 'Update';
        closeModal(); // Call the function to close the modal
    }, 1000); // Close the modal after 2 seconds

    currentSelectedRegion = regionSelect.value;
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
const updateButton = document.getElementById("updateButton");
if (updateButton) {
  updateButton.addEventListener("click", async (event) => {
    event.preventDefault();

    // Call saveSettings function to save the region and currency
    saveSettings(async () => {
      // Fetch the updated price data for the selected region and update the 'prices.html' page
      const response = await fetch(`/prices`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedRegion: regionSelect.value }),
      });

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const pricesContainer = doc.querySelector('#content-wrapper #prices-container');
      const targetContainer = document.querySelector('#content-wrapper #prices-container');

      if (pricesContainer && targetContainer) {
          targetContainer.innerHTML = pricesContainer.innerHTML;
      }
      // Add code here to update the graph and any other elements on the page
    });

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

  function handleRegionSelection() {
    const selectedRegion = getSelectedRegion(); // Get the selected region
        // Update the /prices page based on the selected region
        updatePricesPage(selectedRegion).then((isPricesUpdated) => {
        if (isPricesUpdated) {
            // Update the chart in main_page.html with the selected region
            renderPriceChart(selectedRegion, chartDivWidth, chartDivHeight);
        }
        });
    }
}