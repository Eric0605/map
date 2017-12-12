var map;
var markers = [];
var placeMarkers = [];
var placelist = document.getElementById('clicklist');
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 38.6597717,
            lng: -121.328110
        },
        zoom: 13,
        mapTypeControl: false
    });
    var largeInfowindow = new google.maps.InfoWindow();
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var address = locations[i].address;
        var phone = locations[i].phone;
        var foursquareapiurl = "https://api.foursquare.com/v2/venues/search?ll=" + locations[i].location.lat + "," + locations[i].location.lng + "&client_id=22EKUI5CYBNLNDMHFMC5TUYSS2M1HMBVRB4VUTSODER3QAWC&client_secret=F2HTCRSSOEFJ5CIKRQJVGX01WRHMFZ3ZJ1PAEYUEE2OLWSPA&v=20171203&query=" + locations[i].title;
        var results;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            address: address,
            phone: phone,
            icon: defaultIcon,
            id: i,
            additionalinformation: foursquareapiurl,
            url : results
        });
        markers.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
                var Marker = this;
                window.setTimeout(function() {
                  Marker.setAnimation(null)
                },700);
            }
        });
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length-1; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        };
        map.fitBounds(bounds);
    }
}

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        function getStreetView(data, status) {
          var url = {};
          $.ajax({
            url: marker.additionalinformation,
            dataType: 'json',
            success: function(data) {
              if (data.response.venues[0].url !== undefined) {
                url = data.response.venues[0].url;
              }
              else {
                url = "";
              }
            },
            error : function() {
              alert("error")
            }
          });
          console.log(url);
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>' + '<div>' + marker.address + '</div>' + '<div>' + marker.phone + '</div>' + '<div>' + url +  '</div>' + '<div><a href="' + marker.additionalinformation + '">' + "more info" + "</a></div>");
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.address + '</div>' + '<div>' + marker.phone + '</div>' + '<div>' + url +  '</div>'+
                    '<div>No Street View Found</div>' + '<div><a href="' + marker.additionalinformation + '">' + "more info" + "</a></div>");
            }
        }
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
        });
        var placeInfoWindow = new google.maps.InfoWindow();
        marker.addListener('click', function() {
            if (placeInfoWindow.marker == this) {
                console.log("This infowindow already is on this marker!");
            } else {
                getPlacesDetails(this, placeInfoWindow);
            }
        });
        placeMarkers.push(marker);
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}
function myErrorHandlingFunction(){
  alert("error!!!!")
};
