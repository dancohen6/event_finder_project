// var baseURL = 'https://swapi.dev/api'

// var characterURL = baseURL + '/people'

// var starShipsURL = baseURL + '/starships'

// var gifyBase = 'https://api.giphy.com/v1/gifs/random?api_key=pLa6ujglEAjSf4D17C39tK8LJC8IdmZO&tag=&rating='

// $.get(gifyBase)
//     .then(
//     )

// $.get(starShipsURL)
//     .then(function(data) {
//         console.log(data.results[6]);
//         $('h1').append(data.results[6].name);
//         $('h2').append(data.results[6].manufacturer);
//     })

// fetch(characterURL)
//     .then(function(res) {
//         return res.json()
//     }).then(function (data) {
//         console.log(data);
//     })

var mapBoxKey =
  "pk.eyJ1IjoiamVyZW15dGJveWVyIiwiYSI6ImNsaXYwa3EzODAzamIzZm53ajAzOG13eGUifQ.2OBZgtgqI-ZgvNqhPN1iFw";
var ticketMasterKey = "z2QxkbAvwHIeIktH66VAhDwXlDvuDjpg";

$(function () {
  var mapBoxKey = "pk.eyJ1IjoiamVyZW15dGJveWVyIiwiYSI6ImNsaXYwa3EzODAzamIzZm53ajAzOG13eGUifQ.2OBZgtgqI-ZgvNqhPN1iFw";
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
    city: 'philadelphia',
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

      venues.forEach(function(venue) {
        $('.events').append(
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
              '" target="_blank">Event Details</a></p>')
      })

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

// $(function() {
//     // Specify the search term
//     var searchTerm = "naruto english dub official trailer";

//     // Make the API request
//     $.get(
//       "https://www.googleapis.com/youtube/v3/search", {
//         part: "snippet",
//         q: searchTerm,
//         type: "video",
//         maxResults: 1,
//         key: "AIzaSyCT3YyIHMpt0S4KB8h8uL6MftkbGWbQU7Q"
//       }
//     )
//     .done(function(response) {
//       // Get the video ID of the first result
//       var videoId = response.items[0].id.videoId;

//       // Create the YouTube video embed URL
//       var embedUrl = "https://www.youtube.com/embed/" + videoId;

//       // Create an iframe element with the video embedded
//       var iframe = $('<iframe>', {
//         src: embedUrl,
//         frameborder: 0,
//         allowfullscreen: true,
//         width: "560",
//         height: "315"
//       });

//       // Append the iframe to a container element on your website
//       $('#video-container').append(iframe);
//     })
//     .fail(function(error) {
//       console.error(error);
//     });
//   });
