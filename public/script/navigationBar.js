function updateStatus() {
    switch(localStorage['STATUS']) {
        case 1:
        return '<i id="status" style="color: #9ccb19" class="fa fa-check-circle"></i>';
        case 2:
        return '<i id="status" style="color: #9ccb19" class="fa fa-exclamation-triangle"></i>';
        case 3:
        return '<i id="status" style="color: #9ccb19" class="fa fa-plus-square"></i>';
    }
    return '<i id="status" style="color: #000" class="fa fa-minus"></i>';
}
$(document).ready(function(){
    $('#user-setting').append(' ' + localStorage['USER_NAME'] + ' &nbsp<i id="status"></i> <span class="caret"></span>');
    $('#status').replaceWith(updateStatus());
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
