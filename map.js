require([
   "esri/Map",
   "esri/views/MapView",
   "esri/Graphic",
   "esri/layers/GraphicsLayer"	
 ], function(Map, MapView, Graphic, GraphicsLayer) {

       // Create a basemap for the map view
       var map = new Map({
           basemap: "topo-vector"
       });

       // Create a map view for the HTML centered at Rexburg
       var view = new MapView({
           container: "viewDiv",  // Where in the html to put this 
           map: map,              // The basemap we created above
           center: [-112.0496876, 43.49211], // Rexburg longitude, latitude
           zoom: 9                // zoom in level
       });

       // Create a Graphics Layer which can be used to draw graphics
       // on the map
       var graphicsLayer = new GraphicsLayer();
       map.add(graphicsLayer);        
       function requestZips(cityName) {
           var xmlhttp = new XMLHttpRequest();

           // This long function below is what will happen when we get a result
           // The actual sending of the http request and reading response occurs
           // after the definition of this function.
           xmlhttp.onreadystatechange = function() {
               // Did we get a response (4) and was the response successful (200)
               if (this.readyState == 4 && this.status == 200) {
                   
                   // Convert the JSON text to JSON object that we
                   var data = JSON.parse(this.responseText);
                   console.log(data);
                   // Loop through each feature in the features list
                   for (place of data.places) {    

                       // Define location to draw
                       // This JS map is expected by ArcGIS to make a graphic
                       var point = {
                           type: "point",
                           longitude: place.longitude,
                           latitude: place.latitude
                       };
               
                       // Get zipcode and place name
                       var post_code = place["post code"];
                       var place_name = place["place name"];

                       
                       // Create a symbol
                       // This JS map is expected by ArcGIS to make a graphic                 
                       var simpleMarkerSymbol = {
                           type: "simple-marker",
                           color: [168,78,50],  
                           outline: {
                           color: [255, 255, 255], // white
                           width: 1
                           }
                       };
               
                       // Combine location and symbol to create a graphic object
                       // Also include the earthquake properties data so it
                       // can be used in the popup template.
                       var pointGraphic = new Graphic({
                           geometry: point,
                           symbol: simpleMarkerSymbol,
                           // attributes: feature.properties // this is just a JS Map
                       });

                       // Add popup.  The items in curly braces within the 
                       // template are the key names from the graphic attributes.
                       pointGraphic.popupTemplate = {
                           "title" : "Location: " + place_name,
                           "content" : "<b>ZipCode</b>: "+post_code+"<br><b>"
                       }
               
                       // Add the graphic (with its popup) to the graphics layer
                       graphicsLayer.add(pointGraphic);
                   } // End of Loop
               }
           }; // End of XML Call back Function

           // Time to actually send the GET request to the USGS.  When we get a response
           // it will call and execute the function we defined above.
       
           xmlhttp.open("GET", "http://api.zippopotam.us/us/id/" + cityName, true);
           xmlhttp.send();
       }
       
       var cities = ["idaho%20falls", "pocatello", "rexburg", "rigby", "parker", "ashton", "ucon", "woodville", "shelley", "arco", "rigby", "firth", "shelley", "blackfoot"];

       for (var city of cities) {
           requestZips(city);
       }       

});
