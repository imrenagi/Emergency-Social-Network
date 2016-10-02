$('#navbar-right').on('click', function(event) {
     $.ajax({
        type: "DELETE",
        data: {},
        url: "logout",
        dataType: "json",
        success: function() {
            window.location = '/'
        }
    });
});