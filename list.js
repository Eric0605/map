function AppViewModel() {
    var self = this;
    var Places = function(org) {
        this.dataplace = org.title,
        this.yesorno = ko.observable(true);
    };
    this.check = ko.observable("");
    this.places = ko.observableArray([]);
    for (var i = 0; i < locations.length; i++) {
      self.places.push(new Places(locations[i]));
    }
    this.location = ko.computed(function() {
        var second = self.check().toLowerCase();
        if (self.check() === "") {
          for (var i = 0; i < self.places().length; i++) {
            self.places()[i].yesorno(true);
          };
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
          }
          return self.places();
        }
        else {
            return ko.utils.arrayFilter(self.places(), function(Target) {
                var checking = Target.dataplace.toLowerCase();
                var checking2 = Target.dataplace;
                if (checking.search(self.check()) === -1 && checking.search(second) === -1 && checking2.search(self.check()) === -1 && checking2.search(second) === -1 ) {
                    Target.yesorno(false);
                    for (var i = 0; i < markers.length; i++) {
                      var checking3 = markers[i].title;
                      var checking4 = checking3.toLowerCase();
                      if (checking3.search(self.check()) === -1 && checking3.search(second) === -1 && checking4.search(self.check()) === -1 && checking4.search(second) === -1 ) {
                        markers[i].setMap(null);
                      }
                    }
                    return false;
                } else if (checking.search(self.check()) > -1 || checking2.search(self.check()) > -1) {
                    Target.yesorno(true);
                    for (var i = 0; i < markers.length; i++) {
                      var checking3 = markers[i].title;
                      var checking4 = checking3.toLowerCase();
                      if (checking3.search(self.check()) > -1 || checking4.search(self.check()) > -1) {
                        markers[i].setMap(map);
                      }
                    }
                    return true;
                }
            });
        }
    }, self);

    showListings = function() {
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
        var content = this.dataplace;
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            if (content === markers[i].title) {
                markers[i].setMap(map);
                markers[i].setAnimation(google.maps.Animation.BOUNCE);
                var Marker = markers[i];
                window.setTimeout(function() {
                    Marker.setAnimation(null)
                }, 700);
                populateInfoWindow(markers[i], new google.maps.InfoWindow())
            }
        }
    };
};
ko.applyBindings(new AppViewModel());
