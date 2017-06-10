// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function createMap(geo_data) {
  var map = L.map('map', {scrollWheelZoom: false, zoomControl: true}).setView([51.505, -0.09], 10);
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var myStyle = {
      "color": "red",
      "weight": 5,
      "opacity": 1.0
  };
  var layer = L.geoJSON(geo_data, {
      style: myStyle,
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      }
  }).addTo(map);

  map.fitBounds(layer.getBounds());
}

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var geo_data = JSON.parse(xhr.responseText);
        createMap(geo_data);
      }
    }
    xhr.send();
  });
});
