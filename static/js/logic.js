// Defining earthquake plates using GeoJSON
let earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicplatesURL = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"


// Create the layergroups
let earthquakes = L.layerGroup();
let tectonicplates = L.layerGroup();

// Creating the tile layers
let satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

let grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

let outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Basemaps and overlays
let baseMaps = {
  "Satellite": satelliteMap,
  "Grayscale": grayscaleMap,
  "Outdoors": outdoorsMap,
};

let overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicplates
};

// Create the map, add layers and control layer
let myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 2,
  layers: [satelliteMap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

d3.json(earthquakesURL, function (earthquakeInfo) {
  // Markersize
  function markerSize(magnitude) {
    return magnitude * 4;
  };
  // Marker colors
  function chooseColor(depth) {
    switch (true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "orangered";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "gold";
      case depth > 10:
        return "yellow";
      default:
        return "lightgreen";
    }
  }
  // Pop up showing place and time of earthquake
  L.geoJSON(earthquakeInfo, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng,
        // Set the style of the markers
        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
        + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);
  // Adding earthquakes layer to the createMap function
  earthquakes.addTo(myMap);

  // Get tectonic plate info from tectonicplatesURL
  d3.json(tectonicplatesURL, function (data) {
    L.geoJSON(data, {
      color: "orange",
      weight: 2
    }).addTo(tectonicplates);
    tectonicplates.addTo(myMap);
  });

  // Legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});
