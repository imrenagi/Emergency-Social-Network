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
	reset_page();
});

$('#submitNewsButton').on('click',function(){
	var confirmation = confirm("Sending this news will send email notifications to everyone in the area. Please use this facility with consideration. Do you still want to continue?");
	if (confirmation == false) {
	    location = 'news';
	} 
	var news_text = $('#news-textarea').val(); 
	var image_url = document.getElementById('sendImageButton').files[0];
	var image='';

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
		if($.inArray(ext, ['png','jpg','jpeg']) == -1){
            alert('Invalid image extension! Upload only jpeg or png images.');
            reset_page();
            return;
		}

		var reader = new FileReader();
		var imageFile;
		alert('Your image is uploading. Upon upload, you will be redirected to the News page.')
		reader.onload = function(){
	        console.log('Image reading done');
	        image = reader.result;
	        send_news(news_text, image);         
        };
		reader.readAsDataURL(imageFile)
	}
	else
	{
		send_news(news_text, image);
	}
	
});


function reset_page()
{
	$('#news-textarea').val('');
	$('#news-textarea').focus();
 	document.getElementById('imageForm').reset();
	deleteMarkers();
}

function send_news(news_text, image)
{
	var stat = $('#news-option').attr('option')
	var news={ 
        reporter_id: localStorage['ID'],
        status: stat, 
        lat: location.lat,
        long: location.lng, 
	    message: news_text,
        image_url: image
    };

   /* $.ajax({
            type: "POST",
            data: news,
            url: "/news",
            dataType: "json",
            statusCode: {
                200: function(data) {
               			alert('News sent. Redirecting to News page.');
               			location='news';
                }
            }
    });*/


}

