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

function updateMessage(data) {
    var color = 'normal';
    var icon = 'fa-minus';
    var lat = data.location.lat, long = data.location.long;
    var time = reformatTime(data.timestamp);
    var user = data.sender.user_name;
    var text = data.text;
    switch (data.status) {
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
    var pin = '<div class="pin pin-' + color + '"><div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  | <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ')</div><div class="pin-heading pin-heading-' + color + '"> <i class="fa ' + icon + '"></i> ' + user + ' </div><p>' + text + '</p></div>';
    return pin;
}

var socket = io.connect("http://localhost:3000");

window.onload = function() {
    $.ajax({
        type: "GET",
        data: {},
        url: "/message/public",
        dataType: "json",
        statusCode: {
            200: function(data) {
                var pins = '';
                for (var i = 0; i < data.length; i++) {
                    pins += updateMessage(data[i]);
                }
                $('#pins').prepend(pins);
            }
        }
    });

    socket.on('broadcast message', function(data) {
        $('#pins').prepend(updateMessage(JSON.parse(data)));
    });
}
$('#input').on('click', '#sendButton', function() { 
    var message = $('#text').val();
    if (message != '') {
        // Get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                localStorage['latitude'] = position.coords.latitude;
                localStorage['longitude'] = position.coords.longitude;
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
        socket.emit('send message', { 
                    sender_id: localStorage['ID'], 
                    message: message, 
                    message_status: localStorage['STATUS'],
                    latitude: localStorage['latitude'],
                    longitude: localStorage['longitude']
                });
    }

    
});

