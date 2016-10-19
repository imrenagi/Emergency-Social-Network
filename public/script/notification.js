var inputArea = '<div id="textarea" class="input-group"><textarea rows="1" style="resize:none;" placeholder="Share something..." class="form-control custom-control"></textarea><span class="input-group-addon btn btn-default"><span class="glyphicon glyphicon-send"></span></span></div>';
var panelHeading = document.getElementById('panel-heading');
var lastId = '';
var limit = 0;
var btnCls = ['contact-normal', 'contact-ok', 'contact-warning', 'contact-danger']

function isCoordinator() {
    return true;
}


function getUsrInfo(id, async) {
    var usrinfo = '';
    $.ajax({
        type: 'GET',
        data: {},
        url: '/directory/user/' + id,
        dataType: "json",
        async: async,
        success: function(data) {
            usrinfo = data;
        }
    });
    return usrinfo;
}

function loadMoreMessages(convId){
    $('#loadMoreButton').remove();
    if (convId == 0) {
        retrieveAnnouncement();
    }
    else {
        retrievePreviousMsgHistory(convId, limit);
    }
}

function getContacts() {
    var tab = panelHeading.getAttribute('tab');
    if (tab != '0') {
        var usrinfo = getUsrInfo(tab, false);
        if (usrinfo && usrinfo.id != localStorage['ID']) {
            $('#contacts').append('<button id="btn-' + usrinfo.id +'" user="' + usrinfo.user_name + '" convId="0" onclick="tabClicked(' + usrinfo.id + ')" class="btn btn-default text-left"><div class="float-right"><div id="badge-' + tab +'" class="badge badge-contact">' + '' +  '</div></div><span> ' + usrinfo.user_name + '</span></button>');
        }
        else {
            tab = '0';
        }
    }
    $.ajax({
        type: 'GET',
        data: {},
        url: '/message/private/conversation/' + localStorage['ID'],
        dataType: "json",
        async: false,
        statusCode: {
            200: function(data) {
                console.log(data);
                for (var i = 0; i < data.conversations.length; i++) {
                    if (data.conversations[i].target.id == tab) {
                        document.getElementById('btn-'+data.conversations[i].target.id).setAttribute('convId', data.conversations[i].id)
                        panelHeading.setAttribute('convId', data.conversations[i].id);
                        document.getElementById('badge-'+data.conversations[i].target.id).innerHTML=((data.conversations[i].unread_count > 0) ? data.conversations[i].unread_count : '');
                        continue;
                    }
                    $('#contacts').append('<button id="btn-' + data.conversations[i].target.id +'" user="' + data.conversations[i].target.user_name + '" convId="' + data.conversations[i].id + '" onclick="tabClicked(' + data.conversations[i].target.id + ')" class="btn btn-default text-left"><div class="float-right"><div id="badge-' + data.conversations[i].target.id +'" class="badge badge-contact">' + ((data.conversations[i].unread_count > 0) ? data.conversations[i].unread_count : '') +  '</div></div><span> ' + data.conversations[i].target.user_name + '</span></button>');
                }
            }
        }
    });
}

function formatHistoryMessage(data) {
    var cls = (data.sender.id == localStorage['ID']) ? 'message-s' : 'message-r';
    var date = new Date(moment(data.timestamp*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC');
    var html = '<div class="message ' + cls + '"><div class="stamp"><span class="fa fa-map-marker"></span> ('+ data.location.lat + ', ' + data.location.long + ')&nbsp | <span class="fa fa-clock-o"></span> ' + reformatTime(date) + '</div><p>' + data.text + '</p></div>';
    return html;
}

function formatPrivateMessage(data) {
    var cls = (data.sender_id == localStorage['ID']) ? 'message-s' : 'message-r';
    var date = new Date(moment(data.created_at*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC');
    var html = '<div class="message ' + cls + '"><div class="stamp"><span class="fa fa-map-marker"></span> ('+ data.location.lat + ', ' + data.location.long + ')&nbsp | <span class="fa fa-clock-o"></span> ' + reformatTime(date) + '</div><p>' + data.message + '</p></div>';
    return html;
}

function retrievePreviousMsgHistory(convId, limit){
    $.get('/message/private/'+(convId)+'?last_id='+'&limit='+(limit), function(data) {
        var messages = '';
        var read = [];
        for (var i = 0; i < data.messages.length; i++) {
            messages += formatHistoryMessage(data.messages[i]);
            lastId = data.messages[i].id;
        }

        $('#messages').append(messages);
        var loadMoreButton = $('<button class="btn btn-default btn-block loadmore" id="loadMoreButton" onclick="loadMoreMessages('+convId+')"> Load More </button>');
        if (data.messages.length == limit) {
            $('.loadmore').append(loadMoreButton);
        } else {
            loadMoreButton.remove();
        }
        var badge = document.getElementById('badge-'+panelHeading.getAttribute('tab'));
        var unread = Number(badge.innerHTML);
        badge.innerHTML = ''
        // if (unread >= 0 && unread <= limit) {
        //     badge.innerHTML = '';
        // } else {
        //     badge.innerHTML = unread-limit;
        // }
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
    $('#loadMoreButton').remove();
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
        switch(getUsrInfo(tab, false).status) {
            case 1: color = '#9ccb19'; icon = 'fa-check-circle'; break;
            case 2: color = '#fcd116'; icon = 'fa-exclamation-triangle'; break;
            case 3: color = '#ce4844'; icon = 'fa-plus-square';
        }
        $('#win-header').replaceWith('<div id="win-header" recevierName="' + name + '"><i class="fa fa-comments-o"></i><span> Chatting with ...</span><div class="float-right"><span style="color: ' + color + '">' + name + ' <i class="fa ' +  icon +'"></i></span></div></div>');
        retrievePreviousMsgHistory(panelHeading.getAttribute('convId'), limit);
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

socket.on('receive private message', function(data) {
    var tab = panelHeading.getAttribute('tab');
    if (tab == data.sender_id) {
        $('#messages').prepend(formatPrivateMessage(data));
        return;
    }
    var badge = document.getElementById('badge-'+data.sender_id);
    if (badge == undefined) {
        $('#contacts').append('<button id="btn-' + data.sender_id +'" user="' + data.sender_name + '" convId="' + data.conversation_id + '" onclick="tabClicked(' + data.sender_id + ')" class="btn btn-default text-left"><div class="float-right"><div id="badge-' + data.sender_id +'" class="badge badge-contact">1</div></div><span> ' + data.sender_name + '</span></button>');
    } else { 
        var unread = 1 + (badge.innerHTML == '' ? 0 : Number(badge.innerHTML));
        badge.innerHTML = unread;
    }
});

function tabClicked(id) {
    panelHeading.setAttribute('tab', id);
    convId = document.getElementById('btn-'+id).getAttribute('convId');
    panelHeading.setAttribute('convId', convId);
    getChatWindow();
}

$('#contacts').on('click', '#btn-announce', function() {
    panelHeading.setAttribute('tab', '0');
    getChatWindow();
});

$('#textarea').on('click', '#sendButton', function() { 
    var message = $('#text').val();
    var tab = panelHeading.getAttribute('tab');
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
        if (tab == '0') {
            socket.emit('post announcement', { 
                sender_id: localStorage['ID'], 
                message: message, 
                lat: localStorage['latitude'],
                long: localStorage['longitude']
            });
        }
        else  {
            data = {
                sender_id: localStorage['ID'],
                receiver_id: tab,
                receiver_name: document.getElementById('win-header').getAttribute('recevierName'),
                message: message,
                status: localStorage['STATUS'],
                latitude: localStorage['latitude'],
                longitude: localStorage['longitude']
            }
            if (convId != '0') {
                data['conversation_id'] = convId;
            }
            socket.emit('send private message', data, function(conversation_id) {
                console.log(conversation_id);
                document.getElementById('btn-'+tab).setAttribute('convId', conversation_id)
                panelHeading.setAttribute('convId', conversation_id);
            });
            $('#messages').prepend(formatPrivateMessage({
                sender_id: localStorage['ID'], 
                message: message, 
                location: {
                    lat: Number(localStorage['latitude']).toPrecision(6), 
                    long: Number(localStorage['longitude']).toPrecision(6)
                }, 
                created_at: new Date().getTime() / 1000
            }));
        }
        $('#text').val('');
    }
});
