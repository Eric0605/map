function AppViewModel() {
    var self = this;
    this.check = ko.observable("");
    yesorno = ko.observable(true);
    for (var i = 0; i < locations.length; i++) {
      var locationname = locations[i].title;
      self.location.push({ name: locationname});
    };
    this.location = ko.observableArray([]);
    self.filterList = ko.computed(function () {
      console.log(self.location(),self.check());
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
