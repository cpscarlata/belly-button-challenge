<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Bellybutton Biodiversity</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
</head>

<body>
  <div id="chart"></div>

  <script src="script.js"></script>
</body>
</html>

// Define the URL for the JSON data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to create the bar chart
async function createBarChart(selectedID) {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Filter data based on selected ID
  const sample = data.samples.find(sample => sample.id === selectedID);

  // Slice and sort data to get top 10 OTUs
  const topOTUs = sample.otu_ids.slice(0, 10).reverse();
  const topValues = sample.sample_values.slice(0, 10).reverse();
  const topLabels = sample.otu_labels.slice(0, 10).reverse();

  // Create the horizontal bar chart
  const chartDiv = d3.select("#chart");
  
  // Clear previous chart
  chartDiv.html("");

  // Create SVG element
  const svg = chartDiv.append("svg")
    .attr("width", "100%")
    .attr("height", 500);

  // Define margins and dimensions
  const margin = { top: 20, right: 20, bottom: 30, left: 200 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  // Create scales
  const x = d3.scaleLinear()
    .domain([0, d3.max(topValues)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(topOTUs)
    .range([0, height])
    .padding(0.1);

  // Create axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Create bars
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.selectAll(".bar")
    .data(topValues)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d, i) => y(topOTUs[i]))
      .attr("width", d => x(d))
      .attr("height", y.bandwidth());

  // Add labels
  g.selectAll(".label")
    .data(topLabels)
    .enter().append("text")
      .attr("class", "label")
      .attr("x", -10)
      .attr("y", (d, i) => y(topOTUs[i]) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d);

  // Add axes
  svg.append("g")
    .attr("transform", `translate(${margin.left},${height + margin.top})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(yAxis);
}

// Function to initialize dropdown
async function init() {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Get the dropdown element
  const dropdown = d3.select("#chart")
    .append("select")
    .attr("id", "selectID")
    .on("change", function() {
      createBarChart(this.value);
    });

  // Add options to dropdown
  dropdown.selectAll("option")
    .data(data.names)
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  // Initial rendering
  createBarChart(data.names[0]);
}

// Call the initialization function
init();

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTU Bubble Chart</title>
  <!-- Load D3 library -->
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div id="chart"></div>

  <script src="script.js"></script>
</body>
</html>

// Define the URL for the JSON data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to create the bubble chart
async function createBubbleChart(selectedID) {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Filter data based on selected ID
  const sample = data.samples.find(sample => sample.id === selectedID);

  // Define data for bubble chart
  const bubbleData = {
    x: sample.otu_ids,
    y: sample.sample_values,
    size: sample.sample_values,
    color: sample.otu_ids,
    text: sample.otu_labels
  };

  // Define layout for bubble chart
  const layout = {
    title: `OTU Bubble Chart - Sample ${selectedID}`,
    showlegend: false,
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Value"
    }
  };

  // Create bubble trace
  const trace = {
    x: bubbleData.x,
    y: bubbleData.y,
    mode: 'markers',
    marker: {
      size: bubbleData.size,
      color: bubbleData.color,
      colorscale: 'Viridis',
      opacity: 0.5
    },
    text: bubbleData.text
  };

  // Define data and layout
  const bubbleLayout = [trace];

  // Plot the bubble chart
  Plotly.newPlot('chart', bubbleLayout, layout);
}

// Function to initialize dropdown
async function init() {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Get the dropdown element
  const dropdown = d3.select("#chart")
    .append("select")
    .attr("id", "selectID")
    .on("change", function() {
      createBubbleChart(this.value);
    });

  // Add options to dropdown
  dropdown.selectAll("option")
    .data(data.names)
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  // Initial rendering
  createBubbleChart(data.names[0]);
}

// Call the initialization function
init();

// Define the URL for the JSON data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to create the bubble chart
async function createBubbleChart(selectedID) {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Filter data based on selected ID
  const sample = data.samples.find(sample => sample.id === selectedID);

  // Define data for bubble chart
  const bubbleData = {
    x: sample.otu_ids,
    y: sample.sample_values,
    size: sample.sample_values,
    color: sample.otu_ids,
    text: sample.otu_labels
  };

  // Define layout for bubble chart
  const layout = {
    title: `OTU Bubble Chart - Sample ${selectedID}`,
    showlegend: false,
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Value"
    }
  };

  // Create bubble trace
  const trace = {
    x: bubbleData.x,
    y: bubbleData.y,
    mode: 'markers',
    marker: {
      size: bubbleData.size,
      color: bubbleData.color,
      colorscale: 'Viridis',
      opacity: 0.5
    },
    text: bubbleData.text
  };

  // Define data and layout
  const bubbleLayout = [trace];

  // Plot the bubble chart
  Plotly.newPlot('chart', bubbleLayout, layout);
}

// Function to initialize dropdown
async function init() {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Get the dropdown element
  const dropdown = d3.select("#chart")
    .append("select")
    .attr("id", "selectID")
    .on("change", function() {
      createBubbleChart(this.value);
    });

  // Add options to dropdown
  dropdown.selectAll("option")
    .data(data.names)
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  // Initial rendering
  createBubbleChart(data.names[0]);
}

// Call the initialization function
init();

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#metadata {
  margin-bottom: 20px;
}

#charts {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}

#bubble-chart, #bar-chart {
  width: 45%;
}

// Define the URL for the JSON data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to create the bubble chart
async function createBubbleChart(selectedID) {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Filter data based on selected ID
  const sample = data.samples.find(sample => sample.id === selectedID);

  // Define layout for bubble chart
  const layout = {
    title: `OTU Bubble Chart - Sample ${selectedID}`,
    showlegend: false,
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Value"
    }
  };

  // Create bubble trace
  const trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    mode: 'markers',
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids,
      colorscale: 'Viridis',
      opacity: 0.5
    },
    text: sample.otu_labels
  };

  // Define data and layout
  const bubbleLayout = [trace];

  // Plot the bubble chart
  Plotly.newPlot('bubble-chart', bubbleLayout, layout);
}

// Function to create the bar chart
async function createBarChart(selectedID) {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Filter data based on selected ID
  const sample = data.samples.find(sample => sample.id === selectedID);

  // Slice and sort data to get top 10 OTUs
  const topOTUs = sample.otu_ids.slice(0, 10).reverse();
  const topValues = sample.sample_values.slice(0, 10).reverse();
  const topLabels = sample.otu_labels.slice(0, 10).reverse();

  // Create layout for bar chart
  const layout = {
    title: `Top 10 OTUs - Sample ${selectedID}`,
    xaxis: {
      title: "Sample Value"
    },
    yaxis: {
      title: "OTU ID",
      type: 'category',
      categoryorder: 'total ascending'
    }
  };

  // Create bar trace
  const trace = {
    x: topValues,
    y: topOTUs.map(otu => `OTU ${otu}`),
    type: 'bar',
    orientation: 'h',
    text: topLabels,
    hoverinfo: 'text'
  };

  // Define data and layout
  const barLayout = [trace];

  // Plot the bar chart
  Plotly.newPlot('bar-chart', barLayout, layout);
}

// Function to display metadata
async function displayMetadata(selectedID) {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Filter metadata based on selected ID
  const metadata = data.metadata.find(item => item.id === parseInt(selectedID));

  // Get the metadata div
  const metadataDiv = d3.select("#metadata");

  // Clear previous metadata
  metadataDiv.html("");

  // Display each key-value pair from metadata
  Object.entries(metadata).forEach(([key, value]) => {
    metadataDiv.append("p").text(`${key}: ${value}`);
  });
}

// Function to initialize dashboard
async function init() {
  // Fetch the JSON data
  const response = await fetch(url);
  const data = await response.json();

  // Get the dropdown element
  const dropdown = d3.select("#metadata")
    .append("select")
    .attr("id", "selectID")
    .on("change", function() {
      const selectedID = this.value;
      createBubbleChart(selectedID);
      createBarChart(selectedID);
      displayMetadata(selectedID);
    });

  // Add options to dropdown
  dropdown.selectAll("option")
    .data(data.names)
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  // Initial rendering
  const initialID = data.names[0];
  createBubbleChart(initialID);
  createBarChart(initialID);
  displayMetadata(initialID);
}

// Call the initialization function
init();
