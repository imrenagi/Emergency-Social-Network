var notification = document.getElementById('notification')

function showStatus() {
    var status = '<i id="status" style="color: #000" class="fa fa-minus"></i>';
    switch(localStorage['STATUS']) {
        case '1':
        status = '<i id="status" style="color: #9ccb19" class="fa fa-check-circle"></i>';
        break;
        case '2':
        status = '<i id="status" style="color: #fcd116" class="fa fa-exclamation-triangle"></i>';
        break;
        case '3':
        status = '<i id="status" style="color: #ce4844" class="fa fa-plus-square"></i>';
    }
    $('#status').replaceWith(status);
}

$(document).ready(function(){
    $('#user-setting').append(' ' + localStorage['USER_NAME'] + ' &nbsp<i id="status"></i> <span class="caret"></span>');
    showStatus();
});

function updateBell(n, increase) {
    var bell = notification.innerHTML;
    bell = (bell == '' ? 0 : Number(bell));
    bell = (increase ? bell+n : bell-n);
    notification.innerHTML = (bell == 0 ? '' : bell);
}

function updateUserStatus(status) {
    $.ajax({
        type: "PUT",
        data: {
            status: status
        },
        url: '/directory/user/'+localStorage['ID']+'/status',
        success: function() {
            localStorage['STATUS'] = status;
            showStatus();
        }
    })
}

var socket = io();

socket.emit('new socket', {
    user_id: localStorage['ID'],
    user_name: localStorage['USER_NAME']
});

socket.on('notification', function() {
    if (document.getElementById('contacts') == undefined) {
        var unread = notification.innerHTML;
        notification.innerHTML = (unread == '' ? 0 : Number(unread)) + 1;
    }
})

$.ajax({
    type: 'GET',
    data: {},
    url: '/message/private/conversation/' + localStorage['ID'],
    dataType: "json",
    async: false,
    statusCode: {
        200: function(data) {
            var cnt = 0;
            for (var i = 0; i < data.conversations.length; i++) {
                cnt += data.conversations[i].unread_count;
            }
            updateBell(cnt, true);
        }
    }
});

$('#navbar-right').on('click', '#status-ok', function(event){
    updateUserStatus(1);
});

$('#navbar-right').on('click', '#status-help', function(event){
    updateUserStatus(2);
});

$('#navbar-right').on('click', '#status-emergency', function(event){
    updateUserStatus(3);
});

$('#navbar-right').on('click', '#logout', function(event) {
     $.ajax({
        type: "DELETE",
        data: {},
        url: "/logout",
        dataType: "json",
        success: function() {
            localStorage.removeItem('STATUS');
            localStorage.removeItem('USER_NAME');
            localStorage.removeItem('ID');
            localStorage.removeItem('PRIVILAGE');
            window.location = '/'
        }
    });
});

$('#navbar-right').on('click', '#edit-profile', function(event){
    window.location = '/editProfile'
});

