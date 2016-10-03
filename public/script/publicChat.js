var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function reformatTime(timestamp) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timestamp*1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = '0' + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = '0' + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = months[date.getMonth()] + '. ' + date.getDate() + ' '
                        + date.getFullYear() + ' '
                        + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
};
window.onload = function() {
    $.ajax({
        type: "GET",
        data: {},
        url: "/message/public",
        dataType: "json",
        statusCode: {
            200: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var color = 'normal';
                    var icon = 'fa-minus';
                    var lat = 0, long = 0;
                    var time = reformatTime(data[i].timestamp);
                    var user = data[i].sender.user_name;
                    var text = data[i].text;
                    switch (data[i].status) {
                        case 1:  {
                            color = 'ok';
                            icon = 'fa-check-circle';
                        };
                        break;
                        case 2: {
                            color = 'warning';
                            icon = 'fa-exclamation-triangle';
                        }
                        break;
                        case 3: {
                            color = 'danger';
                            icon = 'fa-plus-square';
                        }
                    }
                    $('#pins').append('<div class="pin pin-' + color + '"><div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  | <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ')</div><div class="pin-heading pin-heading-' + color + '"> <i class="fa ' + icon + '"></i> ' + user + ' </div><p>' + text + '</p></div>');
                }
            }
        }
    });
}
$('#input').on('click', '#sendButton', function() { 
    var latitude = 0;
    var longitude = 0;
    // Get location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log(latitude + ', ' + longitude);
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
});

