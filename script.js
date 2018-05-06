var type;
var place;
var marker;
var markerOldList = [];

//on page load, load the map with marker for Fremont,CA location
var map = new google.maps.Map(document.getElementById('map-canvas'),{
    center: {lat: 37.548271, lng:-121.988571},
    zoom: 13
});

var position = new google.maps.LatLng(37.548271,-121.988571);
var marker = new google.maps.Marker({
    map: map,
    position: {lat: 37.548271, lng:-121.988571},
});


//change the marker position for based on user input for search box
var searchBox = new google.maps.places.SearchBox(document.getElementById('search'));
google.maps.event.addListener(searchBox,'places_changed',function(){
    place = searchBox.getPlaces();
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(place[0].geometry.location);
    marker.setPosition(place[0].geometry.location);
    map.fitBounds(bounds);
    map.setZoom(13);
});

function loadOptions(opt)
{
    type = document.getElementById(opt).value;
}
//loads the categories of places in the list
options('opt');
function options(opt)
{
    var optList = ['All','cafe','bank','dentist','hospital','atm','restaurant','gas_station','park','parking'];
    var sel = document.getElementById(opt);

    for(var i=0;i<optList.length; i++)
    {
        sel.options.add(new Option(optList[i]));
    }

};

//search nearby location based on selected category and loads the marker.
function searchNearBy()
{
    //marker.setMap(null);
    //map.marker = [];
    var service = new google.maps.places.PlacesService(map);
    if(place == undefined)
    {
        var location = position;
    }
    else{
        var location = place[0].geometry.location;
    }

    service.nearbySearch(
        {
            location:location ,
            radius: '5000',
            type: [type],
        },processRequest);

    function processRequest(output,status,pagination)
    {

        if (status!= google.maps.places.PlacesServiceStatus.OK)
        {
            var place = document.getElementById('search');
            place.innerHTML="";
            return;
        }
        else
        {

            createMarker(output);
        }
    }

    function createMarker(places) {
        var bounds = new google.maps.LatLngBounds();
        var place = document.getElementById('search');
        // delete previous marker
        for(var j=0;j<markerOldList.length;j++)
        {
            markerOldList[j].setMap(null);
        }
        for (var i = 0,place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });
            markerOldList.push(marker);
            place.innerHTML += '<li>' + place.name + '</li>';

            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
    }
    return ;
}
