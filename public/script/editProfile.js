
$(document).ready(function(){
	loadUserEmail();
    $('#submit').click(function(){
    	updateEmail();
    })
});

function loadUserEmail() {
	$.ajax({
    	type: "GET",
        url: "directory/user_email",
        dataType: "json"
    }).done( function (data, status) {
    	$('#email').val(data.email);
     });
}

function updateEmail() {
	var email = $('#email').val();
	if (email) {
		$.ajax({
	    	type: "PUT",
	        url: "directory/user/email",
	        dataType: "json",
	        data: {
	            email: email
	        },
	    }).done( function (data, status) {
	    	showSuccessDialog();
	     })
	     .fail( function (data, status) {
	     	if (data.status === 400) {
	     		showInvalidEmailDialog();
	     	} else {
	     		showFailedDialog();
	     	}
	     });
 	}
}

function showSuccessDialog() {
	$('#successDialog').modal('show');
}

function showFailedDialog() {
	$('#failedDialog').modal('show');
}

function showInvalidEmailDialog() {
	$('#invalidEmail').modal('show');
}
