// Define the URL for the JSON data
let url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// Declare the variable to store the movie data
let movieData;

// Select the canvas element using D3
let canvas = d3.select("#canvas");

// Define the function to draw the tree map
let drawTreeMap = () => {
  // Create a tooltip element
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  // Create a hierarchical structure of the movie data
  let hierarchy = d3
    .hierarchy(movieData, (node) => {
      return node["children"];
    })
    .sum((node) => {
      return node["value"];
    })
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });

  // Create a tree map layout
  let createTreeMap = d3
    .treemap()
    .size([1100, 700])
    .padding(2);

  // Generate the tree map layout based on the hierarchy
  createTreeMap(hierarchy);

  // Get the movie titles as leaves of the hierarchy
  let movieTitles = hierarchy.leaves();

  // Create a group element for each movie
  let block = canvas
    .selectAll("g")
    .data(movieTitles)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return "translate(" + movie["x0"] + ", " + movie["y0"] + ")";
    });

  // Add rectangles for each movie as tiles
  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      let category = movie["data"]["category"];
      if (category === "Action") {
        return "firebrick";
      } else if (category === "Drama") {
        return "deepskyblue";
      } else if (category === "Adventure") {
        return "darkseagreen";
      } else if (category === "Family") {
        return "khaki";
      } else if (category === "Animation") {
        return "darkorchid";
      } else if (category === "Comedy") {
        return "orange";
      } else if (category === "Biography") {
        return "saddlebrown";
      }
    })
    .attr("data-name", (movie) => {
      return movie["data"]["name"];
    })
    .attr("data-category", (movie) => {
      return movie["data"]["category"];
    })
    .attr("data-value", (movie) => {
      return movie["data"]["value"];
    })
    .attr("width", (movie) => {
      return movie["x1"] - movie["x0"];
    })
    .attr("height", (movie) => {
      return movie["y1"] - movie["y0"];
    })
    .on("mouseover", (movie) => {
      // Show the tooltip on mouseover
      tooltip.transition().style("visibility", "visible");

      // Set the content of the tooltip
      tooltip.html(
        "Name: " +
          movie["data"]["name"] +
          "<br/>" +
          "Category: " +
          movie["data"]["category"] +
          "<br/>" +
          "Value: $" +
          movie["data"]["value"]
      );

      // Set attributes on the tooltip element
      document
        .querySelector("#tooltip")
        .setAttribute("data-name", movie["data"]["name"]);
      document
        .querySelector("#tooltip")
        .setAttribute("data-category", movie["data"]["category"]);
      document
        .querySelector("#tooltip")
        .setAttribute("data-value", movie["data"]["value"]);
    })
    .on("mousemove", function () {
      // Position the tooltip based on the mouse position
      return tooltip
        .style("top", d3.event.pageY - 20 + "px")
        .style("left", d3.event.pageX + 50 + "px");
    })
    .on("mouseout", (movie) => {
      // Hide the tooltip on mouseout
      tooltip.transition().style("visibility", "hidden");
    });

  // Add text labels for each movie
  block
    .append("text")
    .text((movie) => {
      return movie["data"]["name"];
    })
    .attr("y", 20)
    .attr("font-size", "10px")
    .on("mouseover", (movie) => {
      // Show the tooltip on mouseover
      tooltip.transition().style("visibility", "visible");

      // Set the content of the tooltip
      tooltip.html(
        "Name: " +
          movie["data"]["name"] +
          "<br/>" +
          "Category: " +
          movie["data"]["category"] +
          "<br/>" +
          "Value: $" +
          movie["data"]["value"]
      );

      // Set attributes on the tooltip element
      document
        .querySelector("#tooltip")
        .setAttribute("data-name", movie["data"]["name"]);
      document
        .querySelector("#tooltip")
        .setAttribute("data-category", movie["data"]["category"]);
      document
        .querySelector("#tooltip")
        .setAttribute("data-value", movie["data"]["value"]);
    })
    .on("mousemove", function () {
      // Position the tooltip based on the mouse position
      return tooltip
        .style("top", d3.event.pageY - 20 + "px")
        .style("left", d3.event.pageX + 50 + "px");
    })
    .on("mouseout", (movie) => {
      // Hide the tooltip on mouseout
      tooltip.transition().style("visibility", "hidden");
    })
    .call(wrapText, 68); // Call the wrapText function for text wrapping
};

// Wrap text function
function wrapText(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // Adjust line height as needed
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 2)
        .attr("y", y)
        .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 2)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

// Load the JSON data
d3.json(url).then(
  (data, error) => {
    if (error) {
      console.log(error);
    } else {
      // Store the loaded movie data
      movieData = data;
      console.log(movieData);

      // Call the drawTreeMap function to render the visualization
      drawTreeMap();
    }
  }
);
