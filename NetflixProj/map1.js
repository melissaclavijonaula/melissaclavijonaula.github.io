
    
    var height = window.innerHeight;
    var width = window.innerWidth;

    var svg = d3.select("#map1")
      .attr ("width", width)
      .attr("height", height);

    svg.select("#ocean")
      .attr ("width", width)
      .attr("height", height);

    var map = svg.select("#map");

    //Data Binding 

    var csvLoader = d3.csv("NetflixSubscriptions.csv")
    var jsonLoader = d3.json("world-alpha2.json")

    Promise.all([csvLoader, jsonLoader])
    .then(function(results) {

    var NetflixSubscriptions = results[0];
    var world = results [1];

        console.log(world);
        var geoJSON = topojson.feature(world, world.objects.countries);

        geoJSON.features = geoJSON.features.filter(function(d) {
          return d.id !== "AQ";
        });

        console.log(NetflixSubscriptions);
        console.log(geoJSON);

        var proj = d3.geoMercator()
          .fitSize([width, height], geoJSON);

        var path = d3.geoPath()
          .projection(proj);

        var countries = map.selectAll("path")
          .data(geoJSON.features);

        function fillColor(d) {

          var dataMin = 2274;
          var dataMax = 7325;
          var iso = d.id.toLowerCase();
          var myData = NetflixSubscriptions
            .filter(function(row) {
              return row.Country_code === iso;
            });
     
        //Color Scale

         const colorScale = d3.scaleSequential()
         .interpolator(d3.interpolateRgb("#FEC0B2"+"#D81F26"))
         .domain([dataMin, dataMax]);

          if (myData.length) {
            myData = myData[0];
           // console.log(d.id, myData["TotalLibrarySize"]);
            return colorScale (d.id, myData["TotalLibrarySize"]);
          }

          else {
            return "gray";
          }            
        }

        countries.enter().append("path")
          .attr("d", path)
          .attr("fill",  fillColor)
          .attr("stroke-width", 0.5)
          .attr("stroke", "white")
          .on("mousemove", function(event, d) {

            var iso = d.id.toLowerCase();
            var myData = NetflixSubscriptions
              .filter(function(row) {
                return row.Country_code === iso;
              });
            console.log(myData);

            if (myData.length) {
              myData = myData[0];
              
              d3.select(this)
                .attr("fill", "#8B0000");
          
              d3.select("#tooltip")
                .style("display", "block")
                .style("top", event.pageY + 20 + "px")
                .style("left", event.pageX + 20 + "px")
                .html(`Country: <b>${myData.Country}</b>`+
                `TV Shows: <b>${myData.TVShows}</b>`+
                `Movies: <b>${myData.Movies}</b>`+
                `Basic Suscription: <b>${myData.CostBasic}</b>`+
                `Standard Suscription: <b>${myData.CostStandard}</b>`+
                `Premium Suscription: <b>${myData.CostPremium}</b>`
                );
            }

          })
          .on("mouseout", function(event, d) {
            d3.select(this)
              .attr("fill", fillColor(d));

            d3.select("#tooltip")
              .style("display", "none");
          });
        

      });

     