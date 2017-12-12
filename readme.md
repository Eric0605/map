# This is a map near Sacramento
The map included some good drinking shop, eating place, church and parks.
This site allow you to find the place by typing the name or clicking it. It will show you the location and information about it.
# How to run
1. download it
2. unzip it.
3. Open the html file.
4. click the name of the location.
5. It will center you to the location.
# Code:
# data.js:
1. define the data;
#index.js:
1.
var map;
var markers = [];
var placeMarkers = [];
var placelist = document.getElementById('clicklist');
// http://knockoutjs.com/examples/
var ViewModel = function(cityname, state) {
    this.city = ko.observable(cityname);
    this.state = ko.observable(state);
    this.cityplace = ko.pureComputed(function() {
        return this.city() + " " + this.state();
    }, this);
};
Define variable and create a basic ko command
2.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 38.6597717,
            lng: -121.328110
        },
        zoom: 13,
        mapTypeControl: false
    });
    var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('zoom-to-area-text'));
    zoomAutocomplete.bindTo('bounds', map);
    var largeInfowindow = new google.maps.InfoWindow();
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var address = locations[i].address;
        var phone = locations[i].phone;
        var foursquareapiurl = "https://api.foursquare.com/v2/venues/search?ll=" + locations[i].location.lat + "," + locations[i].location.lng + "&client_id=22EKUI5CYBNLNDMHFMC5TUYSS2M1HMBVRB4VUTSODER3QAWC&client_secret=F2HTCRSSOEFJ5CIKRQJVGX01WRHMFZ3ZJ1PAEYUEE2OLWSPA&v=20171203&query=" + locations[i].title;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            address: address,
            phone: phone,
            icon: defaultIcon,
            id: i,
            additionalinformation: foursquareapiurl
        });
        markers.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            //from https://developers.google.com/maps/documentation/javascript/examples/marker-animations?hl=zh-tw
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
            }
        });
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }
    document.getElementById('show-listings').addEventListener('', showListings());
    document.getElementById('hide-listings').addEventListener('click', function() {
        hideMarkers(markers);
    });
    document.getElementById('stop-animationbutton').addEventListener('click', function() {
        stopMarkersanimation(markers);
    });
}
Create a mode of the map and marker
3.
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
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>' + '<div>' + marker.address + '</div>' + '<div>' + marker.phone + '</div>' + '<div><a href="' + marker.additionalinformation + '">' + "more info" + "</a></div>");
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
                infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.address + '</div>' + '<div>' + marker.phone + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
    }
}
Create the info window of the markers
4.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function stopMarkersanimation(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
}
Give the function to the button.
5.
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
Some style to the Markers
6.
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
Create the markers.
7.
var createList = function listofname() {
    for (var i = 0; i < locations.length; i++) {
        var hrbar = document.createElement("hr");
        var locationtitle = locations[i].title;
        var list = document.createElement("div");
        list.innerHTML = locationtitle;
        list.id = "NumList" + i;
        hrbar.setAttribute('class', 'hritem');
        list.setAttribute('class', 'listitem');
        placelist.append(list);
        placelist.append(hrbar);
        list.addEventListener("click", function display() {
            for (var x = 0; x < markers.length; x++) {
                if (this.innerHTML === markers[x].title) {
                    markers[x].setMap(map);
                    markers[x].setAnimation(google.maps.Animation.BOUNCE);
                    populateInfoWindow(markers[x], new google.maps.InfoWindow())
                }
            }
        });
    };
};
createList();
Create a list of location.
8.
function check() {
    setTimeout(function() {
        var newvalue = document.getElementById('serach').value;
        var listitemclass = document.getElementsByClassName('listitem');
        var hritemclass = document.getElementsByClassName('hritem');
        for (var i = 0; i < listitemclass.length; i++) {
            var checklistitem = listitemclass[i].innerHTML;
            var checklistitemsecond = listitemclass[i].innerHTML.toLowerCase();
            var checklistitemstring = checklistitem.toString();
            var checklistitemstringsecond = checklistitemsecond.toString();
            var negativeornot = checklistitemstring.search(newvalue);
            var negativeornotsecond = checklistitemstringsecond.search(newvalue);
            if (negativeornot === -1 && negativeornotsecond === -1) {
                listitemclass[i].style.display = "none";
                hritemclass[i].style.display = "none";
            } else {
                listitemclass[i].style.display = "inline";
                hritemclass[i].style.display = "block";
            }
        }
    }, 1)
}
ko.applyBindings(new ViewModel("Sacramento", "CA"));
Check the location enter and run the app.
