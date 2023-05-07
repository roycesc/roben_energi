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

function findPriceAtCurrentTime(data, currentTime) {
  const closestDataPoint = data.reduce((prev, curr) => {
    const prevTimeDiff = Math.abs(new Date(`${prev.date}T${String(prev.hour).padStart(2, '0')}:00:00`) - currentTime);
    const currTimeDiff = Math.abs(new Date(`${curr.date}T${String(curr.hour).padStart(2, '0')}:00:00`) - currentTime);
    return (prevTimeDiff < currTimeDiff) ? prev : curr;
  });

  const prevDataPoint = data[data.indexOf(closestDataPoint) - 1];
  if (!prevDataPoint) {
    return closestDataPoint.price;
  }

  const timeDiff = closestDataPoint.hour - prevDataPoint.hour;
  const priceDiff = closestDataPoint.price - prevDataPoint.price;
  const currentTimeDiff = currentTime.getHours() - prevDataPoint.hour;
  const interpolatedPrice = prevDataPoint.price + (currentTimeDiff * priceDiff) / timeDiff;

  return interpolatedPrice;
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
    .attr('stroke-width', 4)
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

  // Add the time dot
//  const currentTimeDot = svg.append('circle')
//  .attr('cy', 0)
//  .attr('r', 8) // Change the dot size here
//  .attr('fill', 'var(--pale-cyan)');

const currentTimeDot = svg.append('circle')
.attr('r', 5) // Set the radius of the dot here (default is 5)
.attr('fill', 'var(--dot-color, var(--pale-cyan))'); // Set the fill color, default is --grey100, but can be overridden by --dot-color

const currentTimeLine = svg.append('line')
  .attr('stroke', 'var(--pale-cyan')
  .attr('stroke-width', '1');

const currentTimeText = svg.append('text')
  .attr('class', 'detail');

function updateCurrentTimeLine() {
  const currentTime = new Date();
  currentTime.setMinutes(0); // Set the minutes to 0 to get the start of the current hour
  currentTime.setSeconds(0); // Set the seconds to 0 to avoid any small offset
  currentTime.setMilliseconds(0); // Set the milliseconds to 0 to avoid any small offset
  const xPosition = x(currentTime);

  // Find the two closest data points
  const closestDataPoints = filteredData
    .slice()
    .sort(
      (a, b) =>
        Math.abs(
          currentTime - new Date(`${a.date}T${String(a.hour).padStart(2, "0")}:00:00`)
        ) -
        Math.abs(
          currentTime - new Date(`${b.date}T${String(b.hour).padStart(2, "0")}:00:00`)
        )
    )
    .slice(0, 2);

  // Calculate the interpolated price
  const timeDiff = closestDataPoints[1].hour - closestDataPoints[0].hour;
  const priceDiff = closestDataPoints[1].price - closestDataPoints[0].price;
  const currentTimeDiff = currentTime.getHours() - closestDataPoints[0].hour;
  const interpolatedPrice = closestDataPoints[0].price + (currentTimeDiff * priceDiff) / timeDiff;
  const yPosition = y(interpolatedPrice);

  currentTimeDot
    .attr("cx", xPosition)
    .attr("cy", y(interpolatedPrice));

  // Update the currentTimeLine position
  currentTimeLine
    .attr('x1', xPosition)
    .attr('y1', yPosition - 12)
    .attr('x2', xPosition)
    .attr('y2', yPosition - 12 - 16);

  // Update the currentTimeText position and content
  const currentDate = currentTime.toISOString().slice(0, 10);
  const currentHour = currentTime.getHours();

  currentTimeText
    .attr('x', xPosition)
    .attr('y', yPosition - 12 - 16)
    .text(`${currentDate}\n ${currentHour}:00 - ${(currentHour + 1) % 24}:00\n ${interpolatedPrice.toFixed(2)}`);

}




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
    .style('left', `${xPos + 8}px`)
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

  const rectangleWidth = 24;

  svg
    .selectAll('invisible-rectangle')
    .data(filteredData)
    .enter()
    .append('rect')
    .attr('x', (d) => x(new Date(`${d.date}T${String(d.hour).padStart(2, '0')}:00:00`)) - rectangleWidth / 2)
    .attr('y', (d) => y(d.price) - rectangleWidth / 2)
    .attr('width', rectangleWidth)
    .attr('height', rectangleWidth)
    .attr('fill', 'none')
    .attr('pointer-events', 'all') // Make sure the invisible rectangles still trigger mouse events
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

  svg.select(".grid .domain").remove();

  return {
    updateCurrentTimeLine,
  };
}


window.onload = () => {
  chartDivWidth = parseInt(chartDiv.style('width'));
  chartDivHeight = parseInt(chartDiv.style('height'));
  renderPriceChart(defaultRegion, chartDivWidth, chartDivHeight).then(returnedChart => {
    chart = returnedChart;
    chart.updateCurrentTimeLine();
  });
};

setInterval(() => {
  if (typeof chart !== 'undefined') {
    chart.updateCurrentTimeLine();
  } else {
    console.warn('chart is not defined yet. Skipping the updateCurrentTimeLine() call.');
  }
}, 1000 * 60 * 5);

function resize() {
  chartDivWidth = parseInt(chartDiv.style('width'));
  chartDivHeight = parseInt(chartDiv.style('height'));
  renderPriceChart(defaultRegion, chartDivWidth, chartDivHeight);
  updateCurrentTimeLine();
}



function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Resizes the graph after the menu collapses 
document.getElementById('toggle-collapse-btn').addEventListener('click', () => {
  resize();
});

// You can get the region from session storage or use a default value
const defaultRegion = getSelectedRegion();

//renderPriceChart(defaultRegion, chartDivWidth, chartDivHeight);
window.addEventListener('resize', debounce(resize, 200));


window.addEventListener('sideMenuToggleEvent', () => {
  resize();
});

