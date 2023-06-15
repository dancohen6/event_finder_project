$(function () {
  var mapBoxKey =
    "pk.eyJ1IjoiamVyZW15dGJveWVyIiwiYSI6ImNsaXYwa3EzODAzamIzZm53ajAzOG13eGUifQ.2OBZgtgqI-ZgvNqhPN1iFw";
  var ticketMasterKey = "z2QxkbAvwHIeIktH66VAhDwXlDvuDjpg";

  // Initialize the map
  mapboxgl.accessToken = mapBoxKey;
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-95.7129, 37.0902], // Set the initial center of the map
    zoom: 3, // Set the initial zoom level of the map
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, "top-right");

  // Store the map markers in an array
  var markers = [];

  // Function to add markers to the map
  function addMarkers(venues) {
    venues.forEach(function (venue) {
      var marker = new mapboxgl.Marker()
        .setLngLat(venue.coordinates.split(","))
        .addTo(map)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            "<h3><b>" +
              venue.name +
              "</b></h3>" +
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

      markers.push(marker);
    });

    // Set bounding box to snap map to markers on submit
    var bounds = new mapboxgl.LngLatBounds();
    markers.forEach(function (marker) {
      bounds.extend(marker.getLngLat());
    });
    console.log(bounds);
    map.fitBounds(bounds, { padding: 50 });
  }

  // Function to remove markers from the map
  function removeMarkers() {
    markers.forEach(function (marker) {
      marker.remove();
    });
    markers = [];
  }

  var venues;

  function handleRequest() {
    $(".table-heading").nextAll().empty(); // Clear the table on every submit
    var datePicker = $("#date-picker").val(); // Get Date value
    var searchValue = $("#search").val(); // Get Search value

    if (!datePicker) {
      $(".date-warning").show();
    } else {
      $(".date-warning").hide();
    }

    // Make the API request to retrieve events
    $.get("https://app.ticketmaster.com/discovery/v2/events.json", {
      apikey: ticketMasterKey,
      city: searchValue,
      // countryCode: 'US',
      startDateTime: datePicker + "T00:00:00Z",
      endDateTime: datePicker + "T23:59:59Z",
      size: 200,
    })
      .then(function (response) {
        // Extract venue IDs and event details from the response
        console.log(response);
        //considtional here
        if (response._embedded) {
          $(".empty-response-warning").hide();
          venues = response._embedded.events.map(function (event) {
            var venue = event._embedded.venues[0];
            console.log(venue);
            return {
              id: venue.id,
              venueName: venue.name,
              address:
                venue.address.line1 +
                ", " +
                venue.city.name +
                ", " +
                venue.state?.stateCode +
                ", " +
                venue.postalCode,
              coordinates:
                venue.location.longitude + "," + venue.location.latitude,
              name: event.name,
              date: event.dates.start.localDate,
              time: event.dates.start.localTime,
              url: event.url,
            };
          });

          // Loop through each event and create a table element
          venues.forEach(function (venue) {
            $(".table-heading").after(
              "<tr> " +
                "<td>" +
                "<h3><b><a href=" +
                venue.url +
                ">" +
                venue.name +
                "</a></b></h3>" +
                "<p>" +
                venue.venueName +
                "</p>" +
                "<p>" +
                venue.address +
                "</p>" +
                "</td>" +
                "<td><p>" +
                dayjs(venue.date).format("MM/DD/YYYY") +
                "</p>" +
                "<p>" +
                dayjs(venue.date + venue.time).format("h:mm A") +
                "</p></td>" +
                "</tr>"
            );
          });

          removeMarkers();
          addMarkers(venues);
        } else {
          $(".empty-response-warning").show();
        }
      })
      .fail(function (error) {
        console.error(error);
      });
  }
  $("#search-button").on("click", handleRequest);

  function handleModalSubmission() {
    $(".modal").hide();
    var preferredCity = $("#modal-input").val();
    $("#search").val(preferredCity);
    localStorage.setItem("preferredCity", preferredCity);
  }
  if (localStorage.getItem("preferredCity")) {
    $(".modal").hide();
    var storedCity = localStorage.getItem("preferredCity");
    $("#search").val(storedCity);
  }
  $("#modal-btn").on("click", handleModalSubmission);
});
