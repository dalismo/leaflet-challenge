// Defining earthquake plates using GeoJSON
let earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicplatesURL = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"


// Create the layergroups
let earthquakes = L.layergroup();
let tectonicplates = L.layergroup();

// Creating the tile layers


