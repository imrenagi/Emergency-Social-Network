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

function updateUserStatus(status) {
    $.ajax({
        type: "PUT",
        data: {
            status: status
        },
        url: 'directory/user/'+localStorage['ID']+'/status',
        success: function() {
            localStorage['STATUS'] = status;
            showStatus();
        }
    })
}

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
        url: "logout",
        dataType: "json",
        success: function() {
            localStorage.removeItem('STATUS');
            localStorage.removeItem('USER_NAME');
            localStorage.removeItem('ID');
            window.location = '/'
        }
    });
});
