var markers=[];
var loc;

function initMap() {
	var cmusv = {lat: 37.41043, lng: -122.059753};
  	var map = new google.maps.Map(document.getElementById('sendMap'), {
          zoom: 20,
          center: cmusv
        });
   	map.addListener('click', function(event) {
   		//event.preventDefault();
   		deleteMarkers();
  		addMarker(event.latLng, map);
	});  
}

function deleteMarkers()
{
	loc=undefined;
	for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
    markers=[];

}

function addMarker(latlong, map) {
        var marker = new google.maps.Marker({
          position: latlong,
          map: map
        });
        loc = latlong;
        markers.push(marker);
        return false;
}


$('#dropdown-list a').click(function() {
    var option = $('#news-option');       
    option.text(' ' + $(this).text());
    option.attr('option', this.id);
});