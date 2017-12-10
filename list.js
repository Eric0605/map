function AppViewModel() {
    var self = this;
    check = ko.observable("");
    this.location = ko.observableArray([]);
    yesorno = ko.observable(true);
    if (check() === "") {
      for (var i = 0; i < locations.length; i++) {
        var locationname = locations[i].title;
        self.location.push({ name: locationname});
      };
    }
    else if (check() !== ""){
      for (var i = 0; i < locations.length; i++) {
        var locationname = locations[i].title;
        if (locationname.serach(check()) !== -1) {
          self.location.push({ name: locationname});
        }
      }
    }
    else {
      yesorno(false);
    }
    showListings = function (){
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    };

    hideMarkers = function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };
    showinfo = function() {
      var content = this.name;
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
          if (content === markers[i].title) {
              markers[i].setMap(map);
              markers[i].setAnimation(google.maps.Animation.BOUNCE);
              var Marker = markers[i];
              window.setTimeout(function() {
                Marker.setAnimation(null)
              },700);
              populateInfoWindow(markers[i], new google.maps.InfoWindow())
          }
      }
    };
};
ko.applyBindings(new AppViewModel());
