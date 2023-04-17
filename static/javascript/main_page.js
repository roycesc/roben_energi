document.addEventListener("DOMContentLoaded", function () {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = document.getElementById("chart").clientWidth - margin.left - margin.right;
    const height = document.getElementById("chart").clientHeight - margin.top - margin.bottom;


    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    window.addEventListener("resize", function () {
            const width = document.getElementById("chart").clientWidth - margin.left - margin.right;
            const height = document.getElementById("chart").clientHeight - margin.top - margin.bottom;
            
            d3.select("#chart svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
        });
        

    });

