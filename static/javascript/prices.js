function loadPricesData() {
    const selectedRegion = localStorage.getItem('selectedRegion') || 'SE1'; // Replace 'SE1' with a default value if necessary

    // Make an AJAX request to the Flask view function to get the filtered data
    fetch(`/prices?selectedRegion=${selectedRegion}`)
        .then(response => response.json())
        .then(data => {
            // Process the data and display it on the /prices page
            displayPricesData(data);
        });
}

function displayPricesData(data) {
    // Add code to display the data on the /prices page
    // For example, you can create an HTML table or use a charting library to display the data
}

// Call the loadPricesData function when the /prices page loads
window.addEventListener('DOMContentLoaded', loadPricesData);
