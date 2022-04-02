d3.select("#chart1")
  .on("mousemove", function(event) {
    
    d3.select("#tooltip")
      .style("display", "block")
      .style("top", event.pageY + 20 + "px")
      .style("left", event.pageX + 20 + "px")
      .html("Heyyy!");
  })

  .on("mouseout", function() {
    d3.select("#tooltip")
      .style("display", "none");

      console.log()
  });