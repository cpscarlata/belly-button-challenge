
// Define the URL for the JSON data
// const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to create the bubble chart
async function createBubbleChart(selectedID) {
  // Fetch the JSON data
  const response = await fetch( "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
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
  Plotly.newPlot('bubble-chart', bubbleLayout, layout);
}





// Function to create the bar chart
async function createBarChart(selectedID) {
  // Fetch the JSON data
  const response = await fetch( "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
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
  const response = await fetch( "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
  const data = await response.json();
  
  // Filter metadata based on selected ID
  const metadata = data.metadata.find(item => item.id === parseInt(selectedID));
  // console.log(metadata)
  // Get the metadata div
  const metadataDiv = d3.select("#sample-metadata");

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
  const response = await fetch( "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
  const data = await response.json();
  console.log(data)


  // Get the dropdown element
  const dropdown = d3.select("#sample-metadata")
    .append("select")
    .attr("id", "#sample-metadata")
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
