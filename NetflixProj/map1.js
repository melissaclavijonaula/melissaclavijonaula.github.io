
    
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
     
        //Color Scale

        var dataExtent = d3.extent(NetflixSubscriptions, function(d){
        return d.TotalLibrarySize;
        });

         var colorScale = d3.scaleLinear()
         .domain(dataExtent)
         .range(["#FF9494","#800000"]);

         function fillColor(d) {
         // var dataMin = 2274;
         //var dataMax = 7325;
         //var Medium = 5000;
          var iso = d.id.toLowerCase();
          var myData = NetflixSubscriptions
            .filter(function(row) {
              return row.Country_code === iso;
            });

         // if (myData.length) {
         // myData = myData[0];
         // console.log(d.id, myData["TotalLibrarySize"]);
         //return colorScale (myData["TotalLibrarySize"]);
         //}

          if (myData.length) {
            myData = myData[0];
            console.log(d.id, myData["TotalLibrarySize"]);
            return colorScale (myData["TotalLibrarySize"]);
            // return "#D81F26";
          }

         // if (myData.length > 5000) {
         // myData = myData[0];
         //console.log(d.id, myData["TotalLibrarySize"]);
         //return "#D81F26";
         // }

         //else if (myData.length <5000) {
         //myData = myData[0];
         //console.log(d.id, myData["TotalLibrarySize"]);
         //return "#FEC0B2"
         //}

          else {
            return "#D3D3D3";
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
                .attr("fill", "#DC0000");
          
              d3.select("#tooltip")
                .style("display", "block")
                .style("top", event.pageY + 20 + "px")
                .style("left", event.pageX + 20 + "px")
                .html(`<i>Country</i>: <b>${myData.Country}</b> <br>
                       <i>TV Shows</i>: <b>${myData.TVShows}</b> <br>
                       <i>Movies</i>: <b>${myData.Movies}</b> <br>
                       <i>Basic Suscription (USD)</i>: <b>${myData.CostBasic}</b> <br>
                       <i>Standard Suscription (USD)</i>: <b>${myData.CostStandard}</b> <br>
                       <i>Premium Suscription (USD)</i>: <b>${myData.CostPremium}</b>`
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

      