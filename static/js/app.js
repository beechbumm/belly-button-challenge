// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata


    // Filter the metadata for the object with the desired sample number
    var filteredMetadata = metadata.filter(obj => obj.id = sample)[0];
    console.log(filteredMetadata)


    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadata = d3.select("#sample-metadata");
    console.log(sampleMetadata)

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      sampleMetadata.append("h6").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;
    console.log("from line 36",samples)


    // Filter the samples for the object with the desired sample number
    var filteredSample = samples.filter(obj => obj.id === sample)[0];


    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = filteredSample.otu_ids;
    var otu_labels = filteredSample.otu_labels;
    var sample_values = filteredSample.sample_values;


    // Build a Bubble Chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,  // Set marker size based on sample values
        color: otu_ids,       // Set marker color based on otu_ids (optional)
        colorscale: 'Viridis'  // Optional color scale for markers
      }
    };

    var data = [trace1];
    var layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };
    
    
    // Render the Bubble Chart
    Plotly.newPlot('bubble', data, layout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var otu_labels_bar = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    var trace2 = {
      x: sample_values.sort((a, b) => b - a).slice(0, 10),  // Sort descending and slice top 10
      y: otu_labels_bar.slice(0, 10),  // Match labels to sliced values
      type: 'bar',
      orientation: 'h'  // Horizontal bar chart
    };
    // Don't forget to slice and reverse the input data appropriately
    var data = [trace2];

    var layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      yaxis: {
        autorange: "reversed"
      }
    };


    // Render the Bar Chart
    Plotly.newPlot('bar', data, layout);  // Replace 'barChart' with your chart container ID
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    names.forEach((sample) => {
      dropdown.append("option")
              .text(sample)
              .property("value", sample);
    });
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();