const graphData = [
    { hour: 0, value: 10 },
    { hour: 1, value: 15 },
    { hour: 2, value: 20 },
    { hour: 3, value: 25 },
    { hour: 4, value: 30 },
    { hour: 5, value: 35 },
    { hour: 6, value: 40 },
    { hour: 7, value: 45 },
    { hour: 8, value: 50 },
    { hour: 9, value: 55 },
    { hour: 10, value: 60 },
    { hour: 11, value: 65 },
    { hour: 12, value: 70 },
    { hour: 13, value: 75 },
    { hour: 14, value: 80 },
    { hour: 15, value: 85 },
    { hour: 16, value: 90 },
    { hour: 17, value: 95 },
    { hour: 18, value: 100 },
    { hour: 19, value: 90 },
    { hour: 20, value: 80 },
    { hour: 21, value: 70 },
    { hour: 22, value: 60 },
    { hour: 23, value: 50 },
    { hour: 24, value: 40 },
    { hour: 25, value: 30 },
    { hour: 26, value: 20 },
    { hour: 27, value: 10 },
    { hour: 28, value: 15 },
    { hour: 29, value: 25 },
    { hour: 30, value: 35 },
    { hour: 31, value: 45 },
    { hour: 32, value: 55 },
    { hour: 33, value: 65 },
    { hour: 34, value: 75 },
    { hour: 35, value: 85 },
    { hour: 36, value: 95 },
    { hour: 37, value: 80 },
    { hour: 38, value: 70 },
    { hour: 39, value: 60 },
    { hour: 40, value: 50 },
    { hour: 41, value: 40 },
    { hour: 42, value: 30 },
    { hour: 43, value: 20 },
    { hour: 44, value: 10 },
    { hour: 45, value: 5 },
    { hour: 46, value: 10 },
    { hour: 47, value: 15 },
    { hour: 48, value: 20 },
  ];

const drawChart = () => {

    // Set up dimensions and margins
    const margin = { top: 12, right: 12, bottom: 64, left: 24 };
    const chart = d3.select("#chart");
    const width = parseInt(chart.style("width")) - margin.left - margin.right;
    const chartContainer = d3.select(".chart");
    const height = parseInt(chartContainer.style("height")) - margin.top - margin.bottom;

    // Set up scales
    const x = d3.scaleLinear().domain([0, 48]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Calculate the current time's position on the x-axis
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    // Create the SVG container
    const svg = chart
        .append("svg")
        .attr("class", "my-font")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    const xAxis = d3.axisBottom(x).ticks(48).tickFormat((d) => (d % 24) + ":00");
    const yAxis = d3.axisLeft(y);

    const xAxisGroup = svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    xAxisGroup.selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("dy", "-0.5em")
        .attr("dx", "-0.8em");

    svg.append("g").call(yAxis);

    // Add major x gridlines
    const xMajorGridlines = svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(4).tickSize(-height).tickFormat(""));

    // Add major y gridlines
    const yMajorGridlines = svg
        .append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks(4).tickSize(-width).tickFormat(""));

    // Add minor x gridlines
    const xMinorGridlines = svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(48).tickSize(-height).tickFormat(""));

    // Add minor y gridlines
    const yMinorGridlines = svg
        .append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks(20).tickSize(-width).tickFormat(""));

    // Add background color for 0:00 to 24:00
    svg
        .append("rect")
        .attr("x", x(0))
        .attr("y", 0)
        .attr("width", x(24))
        .attr("height", height)
        .attr("fill", "var(--white)")
        .attr("opacity", 0.3);

    // Add background color for 24:00 to 48:00
    svg
        .append("rect")
        .attr("x", x(24))
        .attr("y", 0)
        .attr("width", x(24))
        .attr("height", height)
        .attr("fill", "var(--secondary)")
        .attr("opacity", 0.4);

    // Add text background and date for 0:00 to 24:00
    svg
        .append("text")
        .attr("class", "my-font")
        .attr("x", x(12))
        .attr("y", 12)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(`Today - ${new Date().toLocaleDateString()}`);


    // Add text background and date for 24:00 to 48:00
    svg
        .append("text")
        .attr("class", "my-font")
        .attr("x", x(36))
        .attr("y", 12)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(`Tomorrow - ${new Date(Date.now() + 86400000).toLocaleDateString()}`);


    // Add line
    const line = d3
        .line()
        .x((d) => x(d.hour))
        .y((d) => y(d.value))
        .curve(d3.curveStepAfter);

    // Add gradient
    const gradient = svg
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", 0)
        .attr("y2", y(100));

    gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "blue")
        .attr("stop-opacity", 1);

    gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "red")
        .attr("stop-opacity", 1);

    svg
        .append("path")
        .datum(graphData)
        .attr("fill", "none")
        .attr("stroke", "url(#gradient)")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    //Add the overlay and solid line
    const overlayWidth = x(currentHour);
    svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", overlayWidth)
        .attr("height", height)
        .attr("fill", "var(--shandy)")
        .attr("opacity", 0.05);

    svg
        .append("line")
        .attr("x1", x(currentHour))
        .attr("y1", 0)
        .attr("x2", x(currentHour))
        .attr("y2", height)
        .attr("stroke", "var(--shandy)")
        .attr("stroke-width", 1);

};
// Call drawChart when window is resized
window.addEventListener("resize", () => {
    d3.select("#chart").html("");
    drawChart();
    });


    document.addEventListener("DOMContentLoaded", function () {
        drawChart();
      
        function resizeChart() {
          d3.select("#chart").html("");
          drawChart();
        }
      
        window.addEventListener("resize", resizeChart);
        window.addEventListener("sideMenuToggle", resizeChart);
      });
