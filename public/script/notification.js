var inputArea = '<div id="textarea" class="input-group"><textarea rows="1" style="resize:none;" placeholder="Share something..." class="form-control custom-control"></textarea><span class="input-group-addon btn btn-default"><span class="glyphicon glyphicon-send"></span></span></div>';
var panelHeading = document.getElementById('panel-heading');
var loadMoreButton = $('<button class="btn btn-default btn-block loadmore" id="loadMoreButton" onclick="loadMoreMessages()"> Load More </button>');
var limit = 30;
function isCoordinator() {
    return true;
}

function getContacts() {
    data = [
            {id: 1, username: 'Imre Nagi', unread: 6, status: 0}, 
            {id: 2, username: 'Xiangtian Li', unread: 2, status: 1},
            {id: 3, username: 'Ashutosh Tadkase', unread: 3, status: 2},
            {id: 4, username: 'Binglei Du', unread: 0, status: 3}
        ];
    for (var i = 0; i < data.length; i++) {
        var btnCls = 'contact-normal';
        switch (data[i].status) {
            case 1: btnCls = 'contact-ok'; break;
            case 2: btnCls = 'contact-warning'; break;
            case 3: btnCls = 'contact-danger';
        }
        $('#contacts').append('<button id="btn-' + data[i].id + '" status="' + data[i].status +'" user="' + data[i].username + '" onclick="tabClicked(' + data[i].id + ')" class="btn btn-default ' + btnCls + ' text-left"><div class="float-right"><div class="badge badge-contact">' + ((data[i].unread > 0) ? data[i].unread : '') +  '</div></div><span> ' + data[i].username + '</span></button>');
    }
}

function formatAnnouncement(data) {
    var lat = data.location.lat, long = data.location.long;
    var date = new Date(moment(data.timestamp*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC');
    var time = reformatTime(date);
    var user = data.sender.user_name;
    var text = data.text;
    return '<div class="pin"><div class="info"> <span class="fa fa-clock-o"></span> '+ time + '  | <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ')</div><div class="pin-heading">' + user + ' </div><p>' + text + '</p></div>';
}

function retrieveAnnouncement() {
    $.ajax({
        type: "GET",
        data: {},
        url: "/announcement",
        dataType: "json",
        success: function(data) {
            var announcements = '';
            for (var i = 0; i < data.announcements.length; i++) {
                announcements += formatAnnouncement(data.announcements[i]);
            }
            $('#messages').prepend(announcements);
            if (data.announcements.length == limit) {
                $('.loadmore').append(loadMoreButton);
            } else {
                loadMoreButton.remove();
            }
        }
    });
}

function getChatWindow() {
    // remove all items
    document.getElementById('messages').textContent = '';
    tab = panelHeading.getAttribute('tab');
    if (tab == '0') {
        isCoordinator() ? $('#textarea').show() : $('#textarea').hide();
        $('#win-header').replaceWith('<div id="win-header" class="text-center"># Announcement</div>')
        retrieveAnnouncement();
    }
    else {
        $('#textarea').show();
        var button = document.getElementById('btn-'+tab);
        var name = button.getAttribute('user');
        var color = '#';
        var icon = 'fa-minus';
        switch(button.getAttribute('status')) {
            case '1': color = '#9ccb19'; icon = 'fa-check-circle'; break;
            case '2': color = '#fcd116'; icon = 'fa-exclamation-triangle'; break;
            case '3': color = '#ce4844'; icon = 'fa-plus-square';
        }
        $('#win-header').replaceWith('<div id="win-header"><i class="fa fa-comments-o"></i><span> Chatting with ...</span><div class="float-right"><span style="color: ' + color + '">' + name + ' <i class="fa ' +  icon +'"></i></span></div></div>')
    }
}

$(document).ready(function(){
    getContacts();
    getChatWindow();
});

var socket = io();

socket.on('broadcast announcement', function(data) {
    if (panelHeading.getAttribute('tab') == '0') {
        $('#messages').prepend(formatAnnouncement(data));
        $('#chat-window').scrollTop(0);
    }
});

function tabClicked(id) {
    panelHeading.setAttribute('tab', id);
    getChatWindow();
}

$('#contacts').on('click', '#btn-announce', function() {
    panelHeading.setAttribute('tab', '0');
    getChatWindow();
});

$('#textarea').on('click', '#sendButton', function() { 
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
        socket.emit('post announcement', { 
                    sender_id: localStorage['ID'], 
                    message: message, 
                    latitude: localStorage['latitude'],
                    longitude: localStorage['longitude']
                });
        $('#text').val('');
    }
});
