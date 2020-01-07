// API key
const API_KEY = "pk.eyJ1IjoiYmthcHNhbGlzIiwiYSI6ImNrMzg2OTZnMzA0bTMzaW5yMWhyb2hxN3AifQ.LCoY1nACfyPGDfOOP7C5hg";

var myMap = L.map("map", {
  center: [45.00, -80.00],
  zoom: 3
});

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

var geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(geoURL, function(data) {

	function colorSelector(magnitude) {
		if (magnitude > 5) {
			return "#ea2c2c"
		}
		else if (magnitude > 4) {
			return "#ea822c"
		}
		else if (magnitude > 3) {
			return "#ee9c00"
		}
		else if (magnitude > 2) {
			return "#eecc00"
		}
		else if (magnitude > 1) {
			return "#d4ee00"
		}
		else {
			return "#98ee00"
		}
	};

	function radiusSelector(magnitude) {
		return magnitude * 5; 			
		};

	function myStyle(feature) {
		return  {	color: colorSelector(feature.properties.mag),
					fillColor: colorSelector(feature.properties.mag),
					radius: radiusSelector(feature.properties.mag),
					weight: 1,
					opacity: 1,
					fillOpacity: 0.65,
					stroke: true
				};
		}

	var geoJSON = L.geoJSON(data, {
		pointToLayer: function(feature, latlng) {
			return L.circleMarker(latlng)
			},

		style: myStyle,			

		onEachFeature: function(feature, layer) {
			layer.bindPopup(feature.properties.title);
		}
	}).addTo(myMap);

	var legend = L.control({position: "bottomright" })

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend');
		var mag = [0, 1, 2, 3, 4, 5];
		var colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
		var labels = [];

	    for (var i = 0; i < mag.length; i++) {
	        div.innerHTML +=
	            '<i style="background: ' + colors[i] + '"></i> ' +
	            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br><br>' : '+');
	    }

	    return div;
		};
	legend.addTo(myMap); 	
	})