url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

        // Load and process the JSON data
        d3.json(url).then(function (data) {
            console.log(data);
            // Assuming your data structure includes 'samples', 'names', etc.
            samples = data.samples;
            names = data.names;
            metadata= data.metadata;

            // Create a dropdown menu with individual names
            dropdown = d3.select("#selDataset");
            names.forEach(function (name) {
                dropdown.append("option").text(name).property("value", name);
            });

            // Initialize the chart with the first individual
            updateChart(names[0]);

            // Event listener for dropdown change
            dropdown.on("change", function () {
                selectedIndividual = dropdown.property("value");
                updateChart(selectedIndividual);
            });

            // Function to update the chart based on the selected individual
            function updateChart(selectedIndividual) {

                // Find the sample data for the selected individual
                selectedSample = samples.find(sample => sample.id === selectedIndividual);

                /// Create a horizontal bar chart using Plotly///

                top10OTUs = selectedSample.otu_ids.slice(0, 10);
                top10Values = selectedSample.sample_values.slice(0, 10);
                top10Labels = selectedSample.otu_labels.slice(0, 10);

                data = [{
                    type: 'bar',
                    x: top10Values.reverse(),  // Reverse for a horizontal chart
                    y: top10OTUs.map(otu => `OTU ${otu}`).reverse(),
                    text: top10Labels.reverse(),
                    orientation: 'h'
                }];

                layout = {
                    title: `Top 10 OTUs for ${selectedIndividual}`,
                    xaxis: { title: 'Sample Values' },
                    yaxis: { title: 'OTU ID' }
                };

                Plotly.newPlot('bar', data, layout);
            
                ///Bubble Chart creation using Plotly///

                data = [{
                    x: selectedSample.otu_ids,
                    y: selectedSample.sample_values,
                    mode: 'markers',
                    marker: {
                        size: selectedSample.sample_values,
                        color: selectedSample.otu_ids,
                        colorscale: 'Viridis'
                    },
                    text: selectedSample.otu_labels
                }];

                layout = {
                    title: `Bubble Chart for ${selectedIndividual}`,
                    xaxis: { title: 'OTU IDs' },
                    yaxis: { title: 'Sample Values' }
                };

                Plotly.newPlot('bubble', data, layout);


                ///Metdata displayed with key-value pair///

                metadataSample= metadata[names.indexOf(selectedIndividual)];
                metadataDiv = d3.select("#metadata");
                metadataDiv.html(""); // Clear existing content

                Object.entries(metadataSample).forEach(([key, value]) => {
                    metadataDiv.append("p").text(`${key}: ${value}`);
                });
                
            }

        
        });
