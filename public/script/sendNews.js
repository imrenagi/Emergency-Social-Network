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

$('#cancelButton').on('click',function(){
	$('#news-textarea').val('');
	$('#news-textarea').focus();
	document.getElementById('imageForm').reset();
	deleteMarkers();
});

$('#submitNewsButton').on('click',function(){
	var news_text = $('#news-textarea').val(); 
	var image_url = document.getElementById('sendImageButton').files[0];
	var url='';
	if(loc==undefined||((news_text=='')&&image_url==undefined))
	{
		alert("News report is incomplete!");
		$('#news-textarea').val('');
		$('#news-textarea').focus();
		document.getElementById('imageForm').reset();
		//deleteMarkers();
		return;
	}
	if(image_url!=undefined)
	{
		var ext = $('#sendImageButton').val().split('.').pop().toLowerCase();
	}
	$('#news-textarea').val('');
	$('#news-textarea').focus();
 	document.getElementById('imageForm').reset();
	deleteMarkers();
});
