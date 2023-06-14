$(function () {
  var mapBoxKey =
    "pk.eyJ1IjoiamVyZW15dGJveWVyIiwiYSI6ImNsaXYwa3EzODAzamIzZm53ajAzOG13eGUifQ.2OBZgtgqI-ZgvNqhPN1iFw";
  var ticketMasterKey = "z2QxkbAvwHIeIktH66VAhDwXlDvuDjpg";

  // Specify the date for filtering
  var date = "2023-06-15";

  // Initialize the map
  mapboxgl.accessToken = mapBoxKey;
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-74.5, 40], // Set the initial center of the map
    zoom: 10, // Set the initial zoom level of the map
  });

  // Make the API request to retrieve events
  $.get("https://app.ticketmaster.com/discovery/v2/events.json", {
    apikey: ticketMasterKey,
    city: "philadelphia",
    // countryCode: 'US',
    startDateTime: date + "T00:00:00Z",
    endDateTime: date + "T23:59:59Z",
    size: 200, // Increase the size parameter to retrieve more events (maximum is 200)
  })
    .done(function (response) {
      // Extract venue IDs and event details from the response
      var venues = response._embedded.events.map(function (event) {
        var venue = event._embedded.venues[0];
        console.log(venue);
        return {
          id: venue.id,
          address:
            venue.address.line1 +
            ", " +
            venue.city.name +
            ", " +
            venue.state.name +
            ", " +
            venue.country.name,
          coordinates: venue.location.longitude + "," + venue.location.latitude,
          name: event.name,
          date: event.dates.start.localDate,
          time: event.dates.start.localTime,
          url: event.url,
        };
      });

      venues.forEach(function (venue) {
        $(".events").append(
          "<h3>" +
            venue.name +
            "</h3>" +
            "<p>Date: " +
            venue.date +
            "</p>" +
            "<p>Time: " +
            venue.time +
            "</p>" +
            "<p>Address: " +
            venue.address +
            "</p>" +
            '<p><a href="' +
            venue.url +
            '" target="_blank">Event Details</a></p>'
        );
      });

      // Add markers to the map
      venues.forEach(function (venue) {
        var marker = new mapboxgl.Marker()
          .setLngLat(venue.coordinates.split(","))
          .addTo(map)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              "<h3>" +
                venue.name +
                "</h3>" +
                "<p>Date: " +
                venue.date +
                "</p>" +
                "<p>Time: " +
                venue.time +
                "</p>" +
                "<p>Address: " +
                venue.address +
                "</p>" +
                '<p><a href="' +
                venue.url +
                '" target="_blank">Event Details</a></p>'
            )
          );
      });
    })
    .fail(function (error) {
      console.error(error);
    });
});
