const generateSampleData = () => {
    const data = [];
  
    for (let i = 0; i < 48; i++) {
      data.push({
        hour: i,
        value: Math.floor(Math.random() * 101),
      });
    }
  
    return data;
  };
  
  // Generate the sample data and store it in a variable
  const sampleData = generateSampleData();

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
      .attr("y", y(100))
      .attr("width", x(24))
      .attr("height", height)
      .attr("fill", "white")
      .attr("opacity", 0.3);

      
    // Add background color for 24:00 to 48:00
    svg
    .append("rect")
    .attr("x", x(24))
    .attr("y", 0)
    .attr("width", x(24))
    .attr("height", height)
    .attr("fill", "grey")
    .attr("opacity", 0.3);
      
      // Add text background and date for 0:00 to 24:00
      svg
      .append("rect")
      .attr("x", x(0))
      .attr("y", 0)
      .attr("width", x(24))
      .attr("height", 20)
      .attr("fill", "white");
      
      svg
      .append("text")
      .attr("x", x(12))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(new Date().toLocaleDateString());
      
      // Add text background and date for 24:00 to 48:00
      svg
      .append("rect")
      .attr("x", x(24))
      .attr("y", 0)
      .attr("width", x(24))
      .attr("height", 20)
      .attr("fill", "grey");
      
      svg
        .append("text")
        .attr("x", x(36))
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text(new Date(Date.now() + 86400000).toLocaleDateString());

      // Add line
      const line = d3
      .line()
      .x((d) => x(d.hour))
      .y((d) => y(d.value));
      
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
        .datum(sampleData)
        .attr("fill", "none")
        .attr("stroke", "url(#gradient)")
        .attr("stroke-width", 1.5)
        .attr("d", line);

// Add the overlay and solid line
    const overlayWidth = x(currentHour);
  
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", overlayWidth)
      .attr("height", height)
      .attr("fill", "var(--venetian-red)")
      .attr("opacity", 0.2);
  
    svg
      .append("line")
      .attr("x1", x(currentHour))
      .attr("y1", 0)
      .attr("x2", x(currentHour))
      .attr("y2", height)
      .attr("stroke", "var(--venetian-red)")
      .attr("stroke-width", 2);
      
};      
// Call drawChart when window is resized
window.addEventListener("resize", () => {
    d3.select("#chart").html("");
    drawChart();
    });
    
    // Initial call to drawChart
    document.addEventListener("DOMContentLoaded", () => {
    drawChart();
    });
  