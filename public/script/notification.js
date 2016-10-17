var inputArea = '<div id="textarea" class="input-group"><textarea rows="1" style="resize:none;" placeholder="Share something..." class="form-control custom-control"></textarea><span class="input-group-addon btn btn-default"><span class="glyphicon glyphicon-send"></span></span></div>';
var panelHeading = document.getElementById('panel-heading');

var limit = 10;
var btnCls = ['contact-normal', 'contact-ok', 'contact-warning', 'contact-danger']

function isCoordinator() {
    return true;
}


function getUsrInfo(id) {
    var usrinfo = '';
    $.ajax({
        type: 'GET',
        data: {},
        url: '/directory/user/' + id,
        dataType: "json",
        async: false,
        success: function(data) {
            usrinfo = data;
        }
    });
    return usrinfo;
}

function loadMoreMessages(convId){
    if (convId == 0) {
        retrieveAnnouncement();
    }
    else {
        retrievePreviousMsgHistory(convId, lastId, limit);
    }
}


function getContacts() {
    data = [
        {
            "id" : 123,
            "target" : {
                "id" : 123,
                "user_name" : "imre"
            },
            "unread_count" : 10
        },
        {
            "id" : 124,
            "target" : {
                "id" : 12123,
                "user_name" : "jhon"
            },
            "unread_count" : 10
        }
    ];
    var tab = panelHeading.getAttribute('tab');
    if (tab != '0') {
        var usrinfo = getUsrInfo(tab);
        if (usrinfo && usrinfo.id != localStorage['ID']) {
            $('#contacts').append('<button id="btn-' + usrinfo.id +'" user="' + usrinfo.user_name + '" onclick="tabClicked(' + usrinfo.id + ')" class="btn btn-default text-left"><div class="float-right"><div class="badge badge-contact">' + '' +  '</div></div><span> ' + usrinfo.user_name + '</span></button>');
        }
    }
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == tab) 
            continue;
        $('#contacts').append('<button id="btn-' + data[i].id +'" user="' + data[i].target.user_name + '" onclick="tabClicked(' + data[i].id + ')" class="btn btn-default text-left"><div class="float-right"><div class="badge badge-contact">' + ((data[i].unread_count > 0) ? data[i].unread_count : '') +  '</div></div><span> ' + data[i].target.user_name + '</span></button>');
    }
}

function formatPrivateMessage(data) {
    var cls = (data.id.sender_id == localStorage['ID']) ? 'message-s' : 'message-r';
    var html = '<div class="message ' + cls + '"><p>' + data.text + '</p></div>';
    return html;
}

function retrievePreviousMsgHistory(convId, lastId, limit){
    $.get('/messages/private/'+(convId)+'?last_id='+lastId+'&limit='+(limit), function(data) {
            var messages = '';
            for (var i = 0; i < data.length; i++) {
                messages += formatPrivateMessage(data[i]);
            }
            $('#messages').append(messages);
            var loadMoreButton = $('<button class="btn btn-default btn-block loadmore" id="loadMoreButton" onclick="loadMoreMessages('+convId+')"> Load More </button>');
            if (data.length == limit) {
                $('.loadmore').append(loadMoreButton);
            } else {
                loadMoreButton.remove();
            }
        });
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
            var loadMoreButton = $('<button class="btn btn-default btn-block loadmore" id="loadMoreButton" onclick="loadMoreMessages(0)"> Load More </button>');
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
        console.log();
        var name = button.getAttribute('user');
        var color = '#';
        var icon = 'fa-minus';
        switch(button.getAttribute('status')) {
            case '1': color = '#9ccb19'; icon = 'fa-check-circle'; break;
            case '2': color = '#fcd116'; icon = 'fa-exclamation-triangle'; break;
            case '3': color = '#ce4844'; icon = 'fa-plus-square';
        }
        $('#win-header').replaceWith('<div id="win-header"><i class="fa fa-comments-o"></i><span> Chatting with ...</span><div class="float-right"><span style="color: ' + color + '">' + name + ' <i class="fa ' +  icon +'"></i></span></div></div>');
    }
}

$(document).ready(function(){
    getContacts();
    getChatWindow();
});

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
    var convId = panelHeading.getAttribute('convId');
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
        if (convId == '0') {
            socket.emit('post announcement', { 
                sender_id: localStorage['ID'], 
                message: message, 
                latitude: localStorage['latitude'],
                longitude: localStorage['longitude']
            });
        }
        else  {
            socket.emit('send private chat', {
                sender_id: localStorage['ID'],
                receiver_id: panelHeading.getAttribute('tab'),
                conversation_id: convId,
                message: message;
                status: localStorage['STATUS'],
                lat: localStorage['latitude'],
                long: longitude['longitude']
            });
        }
        $('#text').val('');
    }
});
