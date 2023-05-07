import { getSelectedRegion } from './settings.js';


const chartDiv = d3.select('#chart');
let chartDivWidth = parseInt(chartDiv.style('width'));
let chartDivHeight = parseInt(chartDiv.style('height'));


async function fetchChartData(region) {
  console.log("Fetching chart data for region:", region);

  try {
    const response = await fetch(`/chart_data?region=${region}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}

function filterDataByHours(data, hours) {
  const currentTime = new Date();
  const cutoffTime = new Date(currentTime - hours * 60 * 60 * 1000);

  return data.filter((d) => {
    let hour = parseInt(d.hour, 10);
    const dataTime = new Date(`${d.date}T${hour < 10 ? '0' + hour : hour}:00:00`);
    return dataTime >= cutoffTime;
  });
}


async function renderPriceChart(region, chartWidth, chartHeight) {
  const data = await fetchChartData(region);
  const filteredData = filterDataByHours(data, 48);
  console.log('Filtered data:', filteredData);

// Clear the previous chart
  d3.select('#chart').selectAll('*').remove();

// Set dimensions and margins
  let margin;
if (window.innerWidth <= 768) { // 768px is a common breakpoint for mobile devices
  margin = { top: 40, right: 24, bottom: 40, left: 24 };
} else {
  margin = { top: 40, right: 40, bottom: 40, left: 40 };
}
  const width = chartWidth - margin.left - margin.right;
  const height = chartHeight - margin.top - margin.bottom;

// Define the scales
  const currentTime = new Date();
  const cutoffTime = new Date(currentTime - 48 * 60 * 60 * 1000 + 120 * 120 * 1000);

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right) // Add margin.left and margin.right
    .attr('height', height + margin.top + margin.bottom) // Add margin.top and margin.bottom
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


  const x = d3
    .scaleTime()
    .domain([
      d3.min(filteredData, (d) => new Date(`${d.date}T${String(d.hour).padStart(2, '0')}:00:00`)),
      d3.max(filteredData, (d) => new Date(`${d.date}T${String(d.hour).padStart(2, '0')}:00:00`)),
    ])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, (d) => d.price) * 1.1])
    .range([height, 0]);

    //console.log("filteredData", filteredData);
    //console.log("y scale domain", y.domain());

// Create the SVG container
//  const svg = d3
//    .select('#chart')
//    .append('svg')
//    .attr('width', width + margin.left + margin.right)
//    .attr('height', height + margin.top + margin.bottom)
//    .append('g')
//    .attr('transform', `translate(${margin.left},${margin.top})`);

// Add area path generator
  const area = d3
    .area()
    .curve(d3.curveCardinal)
    .x((d) => x(new Date(`${d.date}T${String(d.hour).padStart(2, '0')}:00:00`)))
    .y0(height)
    .y1((d) => y(d.price));

// Add the area path
  svg
    .append('path')
    .datum(filteredData)
    .attr('fill', 'url(#price-gradient)')
    .attr('d', area);

  // Add the line path
  svg
    .append('path')
    .datum(filteredData)
    .attr('fill', 'none')
    .attr('stroke', 'var(--robin-egg-blue)')
    .attr('stroke-width', 2)
    .attr('opacity', '0.8')
    .attr('d', d3.line()
      .curve(d3.curveCardinal) // Round out the line and gradient area
      .x((d) => x(new Date(`${d.date}T${String(d.hour).padStart(2, '0')}:00:00`)))
      .y((d) => y(d.price))
    );

// Add the X-axis
  const xAxis = d3.axisBottom(x).ticks(8);
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-family', 'var(--chart-font)')
      .attr('fill', 'var(--grey200)')
      .style('text-anchor', 'middle');

// Add the Y-axis
  const yAxis = d3.axisLeft(y);
    svg
      .append('g')
      .call(yAxis)
          .selectAll('text')
      .attr('font-family', 'var(--chart-font)')
      .attr('fill', 'var(--grey200)');

// Add the title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'var(--chart-font)')
      .attr('font-size', '24px')
      .attr('fill', 'var(--grey200)')
      .text(`${region}'s energy prices`);

  // Add the tooltip
const tooltip = d3
  .select('#chart')
  .append('div')
  .style('opacity', 0)
  .attr('class', 'tooltip')
  .style('background-color', 'var(--white)')
  .style('border', '1px solid var(--grey100)')
  .style('border-radius', '4px')
  .style('padding', '4px')
  .style('position', 'absolute');

const showTooltip = (event, d) => {
  const [xPos, yPos] = d3.pointer(event);
  tooltip
    .style('opacity', 1)
    .html(`Time: ${d.hour}:00<br>Price: €${d.price.toFixed(2)}`)
    .style('left', `${xPos + 20}px`)
    .style('top', `${yPos + margin.top}px`);
};

const hideTooltip = () => {
  tooltip.style('opacity', 0);
};

const xGridlinesMinor = d3.axisBottom(x)
  .tickSize(-height)
  .tickFormat("")
  .ticks(16);

svg.append("g")
  .attr("class", "grid")
  .attr("transform", `translate(0, ${height})`)
  .call(xGridlinesMinor)
  .selectAll("line")
  .style("stroke-dasharray", "2,2")
  .style("stroke-opacity", 0.4);

const xGridlinesMajor = d3.axisBottom(x)
  .tickSize(-height)
  .tickFormat("")
  .ticks(2);

svg.append("g")
  .attr("class", "grid")
  .attr("transform", `translate(0, ${height})`)
  .call(xGridlinesMajor)
  .selectAll("line")
  .style("stroke-opacity", 0.7);

svg.append("line")
  .attr("x1", width)
  .attr("y1", 0)
  .attr("x2", width)
  .attr("y2", height)
  .attr("stroke", "var(--grey200)")
  .attr("stroke-width", 1);

// Add dots for the data points
  svg
    .selectAll('dot')
    .data(filteredData)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(new Date(`${d.date}T${String(d.hour).padStart(2, '0')}:00:00`)))
    .attr('cy', (d) => y(d.price))
    .attr('r', 3)
    .attr('fill', 'var(--robin-egg-blue)')
    .on('mousemove', showTooltip)
    .on('mouseout', hideTooltip);

  svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat("")
          .ticks(8));

  svg.selectAll(".grid .tick line")
      .style("stroke-dasharray", "3,3")
      .style("stroke-opacity", 0.7);

  svg.select(".grid .domain").remove();

// Create gradient definition
  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'price-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('y1', y(0))
    .attr('x2', 0)
    .attr('y2', y(d3.max(filteredData, (d) => d.price) * 1.1));

  gradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'var(--robin-egg-blue)')
    .attr('stop-opacity', 0);

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'var(--robin-egg-blue)')
    .attr('stop-opacity', 0.8);
}

window.onload = () => {
  chartDivWidth = parseInt(chartDiv.style('width'));
  chartDivHeight = parseInt(chartDiv.style('height'));
  renderPriceChart(defaultRegion, chartDivWidth, chartDivHeight);
};

// You can get the region from session storage or use a default value
const defaultRegion = getSelectedRegion();


renderPriceChart(defaultRegion, chartDivWidth, chartDivHeight);

function resize() {
  chartDivWidth = parseInt(chartDiv.style('width'));

  // Re-render the chart with the new dimensions
  renderPriceChart(defaultRegion, chartDivWidth, chartDivHeight);
}

window.addEventListener('resize', () => {
  resize();
});


