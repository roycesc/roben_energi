let currentSelectedRegion = localStorage.getItem('selectedRegion') || 'SYS';


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

    //function updatePricesPage(selectedRegion) {
        // Redirect the user to the /prices page with the selected region as a query parameter
    //    window.location.href = `/prices?selectedRegion=${selectedRegion}`;
    //}

    document.getElementById("updateButton").addEventListener("click", async (event) => {
        event.preventDefault();

        const regionSelect = document.getElementById("regionSelect");
        const selectedRegion = regionSelect.value;

        // Send a POST request to the '/settings' route with the selectedRegion
        const response = await fetch("/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `selectedRegion=${selectedRegion}`,
        });

        if (response.status === 200) {
          alert("Settings updated successfully.");
        } else {
          alert("Failed to update settings.");
        }
      });


    function getSelectedRegion() {
        return currentSelectedRegion;
    }
