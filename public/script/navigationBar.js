if (localStorage['USER_NAME']) {
    $('#user-setting').append(' ' + localStorage['USER_NAME']);
} else {
    window.location = '/'
}
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
