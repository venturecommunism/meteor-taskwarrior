Meteor.subscribe('Coords');

  var map;
  var directionsDisplay;
  var directionsService;
  var pointsArr = new Array();

  Template.mapview.helpers({
    counter: function () {
      return Coords.find().count();
    }
  });

  Template.mapview.events = {
    'click #clearButton': function () {
      Meteor.call('removeAllCoords');
    }
  };

  Template.mapview.rendered = function () {
    // Create map
    var mapOptions = {
      zoom: 16,
      center: new google.maps.LatLng(40.4378271, -3.6795367)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

    directionsService = new google.maps.DirectionsService();

    // Add listener
    google.maps.event.addListener(map, 'click', addLatLng);

    directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    function addLatLng(event) {

      // Add coordinates into db
      var point = {
        'lat': event.latLng.lat(),
        'lng': event.latLng.lng()
      };
      Coords.insert(point);
    }
  };

  function drawPath() {
    if (pointsArr.length >= 2) {
      var origen = pointsArr[0];
      var destino = pointsArr[pointsArr.length - 1];
      var waypointsArr = new Array();
      if (pointsArr.length > 2) {

        pointsArr.forEach(function (item) {
          if (origen != item && destino != item) {
            waypointsArr.push({'location': item});
          }
        });
      }

      var request = {
        origin: origen,
        waypoints: waypointsArr,
        destination: destino,
        travelMode: google.maps.TravelMode.WALKING
      };
      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });

      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directions-panel'));

    }
  }


  // Aqui esta la magia!!
  // Se declara la dependencia para que al cambiar se actualice en todos los clientes
  Tracker.autorun(function () {
    console.log('change');
    if (Coords.find().count()) {
      var allCoords = Coords.find();

      pointsArr = new Array();
      allCoords.forEach(function (coord) {
        // Add coordinates into the path
        var latlng = new google.maps.LatLng(coord.lat, coord.lng);
        pointsArr.push(latlng);
      });
      drawPath();
    }
    else {
      if(directionsDisplay) {
        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
      }
    }
  });

