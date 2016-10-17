var lastMessageId = 0;
var loadMoreButton = $('<button class="btn btn-default btn-block loadmore" id="loadMoreButton" onclick="loadMoreMessages()"> Load More </button>');
var limit = 30;

function updateMessage(data) {
    var color = 'normal';
    var icon = 'fa-minus';
    var lat = data.location.lat, long = data.location.long;
    var date = new Date(moment(data.timestamp*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC');
    var time = reformatTime(date);
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
    var pin = '<div class="pin pin-' + color + '"><div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  &nbsp &nbsp <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ') &nbsp &nbsp <a href="/privateChat/' + data.sender.id + '"><i class="fa fa-comment-o"></i></a> </div><div class="pin-heading pin-heading-' + color + '"> <i class="fa ' + icon + '"></i> ' + user + ' </div><p>' + text + '</p></div>';
    lastMessageId = data.id;
    return pin;
}

window.onload = function() {
    loadMoreMessages();
    socket.on('broadcast message', function(data) {
        $('#messages').prepend(updateMessage(JSON.parse(data)));
        $('#pins').scrollTop(0);
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
        $('#text').val('');
    }
});

function loadMoreMessages() {
    if (lastMessageId == 0) {
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
                    $('#messages').prepend(pins);
                    if (data.length == limit) {
                        $('.loadmore').append(loadMoreButton);
                    } else {
                        loadMoreButton.remove();
                    }
                }
            }
        });
    } else {
        $.get('/message/public?last_id='+(lastMessageId)+'&limit='+limit, function(data) {
            var pins = '';
            for (var i = 0; i < data.length; i++) {
                pins += updateMessage(data[i]);
            }
            $('#messages').append(pins);
            if (data.length == limit) {
                $('.loadmore').append(loadMoreButton);
            } else {
                loadMoreButton.remove();
            }
        });
    }  
} 
