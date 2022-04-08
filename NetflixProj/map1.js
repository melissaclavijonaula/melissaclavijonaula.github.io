
    
    var height = 600;
    var width = 800;

    var svg = d3.select("#map1")
      .attr ("width", width)
      .attr("height", height);

    svg.select("#ocean")
      .attr ("width", width)
      .attr("height", height);

    var map = svg.select("#map");

    d3.json("world-alpha3.json")
      .then(function(world) {

        console.log(world);
        var geoJSON = topojson.feature(world, world.objects.countries);

        geoJSON.features = geoJSON.features.filter(function(d) {
          return d.id !== "ATA";
        });

        console.log(geoJSON);

        var proj = d3.geoMercator()
          .fitSize([width, height], geoJSON);

        var path = d3.geoPath()
          .projection(proj);

        var countries = map.selectAll("path")
          .data(geoJSON.features);

        countries.enter().append("path")
          .attr("d", path)
          .attr("fill", "#D81F26")
          .attr("stroke-width", 0.5)
          .attr("stroke", "white");

      });