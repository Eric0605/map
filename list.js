function AppViewModel() {
    var self = this;
    this.check = ko.observable("");
    this.location = ko.observableArray([]);
    for (var i = 0; i < locations.length; i++) {
        var locationname = locations[i].title;
        self.location().push({ name: locationname});
      };
    self.filterList = ko.computed(function () {
      for (var i = 0; i < locations.length; i++) {
        var newname = locations[i].title + " " + locations[i].title.toLowerCase();
        var searching = newname.search(self.check());
        if (searching === -1) {
          self.location().remove(this);
        }
      }
    // calculate the filtered list and return it here
    return null;
  });
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
