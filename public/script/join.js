$('#content').on('click', '#joinButton',function() { 
    var userName = $('#username').val();
    var password = $('#password').val(); 
    $.ajax({
        type: "POST",
        data: {
            user_name: userName,
            password: password
        },
        url: "/join",
        dataType: "json",
        statusCode: {
            200: function(data) {
                localStorage.setItem('ID', data.id);
                localStorage.setItem('USER_NAME', data.user_name);
                localStorage.setItem('STATUS', data.status);
                window.location = '/userDirectory'
            },
            204: function() {
                var text = '<p><span style="color: green; font-weight: bold;">' + userName +'</span> does not exist. Do you want to sign up with the username/password you just entered?</p>' + '<p id="hiddenName" hidden="true">' + userName +'</p><p id="hiddenPwd" hidden="true">' + password + '</p>';
                $('#glass').replaceWith('<div id="glass" class="form center-block glass"><div><p class="label">Create New Account?</p></div><br><div>'+text+'</div><br><div class="button-holder"><div class="confirm"><button id="confirmButton" class="btn btn-primary btn-block">Confirm</button></div><div class="cancel"><button id="cancelButton" class="btn btn-primary btn-block">Cancel</button></div></div></div>');
            },
            400: function(data) {
                let message = data.responseJSON.message;
                let errMessage = 'Invalid username or password';
                switch (message) {
                    case 'JoinError.IncorrectPassword':
                        errMessage = 'Invalid password. Reenter username/password!'
                        break;
                    case 'JoinError.UserNameIsUnderMinimumQuality':
                        errMessage = 'Username is under quality. Please provide another username!'
                        break;                    
                    case 'JoinError.PasswordIsUnderMinimumQuality':
                        errMessage = 'Password is under quality. Please provide another password!'
                        break;
                    case 'JoinError.UnknownError':
                        errMessage = 'Ups! Something wrong!'
                        break;
                }
                $('#warningMessage').replaceWith('<p id="warningMessage" style="color: red"><span class="fa fa-exclamation-triangle"></span>' + errMessage + '</p>');
            },
            500: function() {
                $('#warningMessage').replaceWith('<p id="warningMessage" style="color: red"><span class="fa fa-exclamation-triangle"></span> Ups! Something wrong!</p>');  
            }
        }
    });
});

$('#content').on('click', '#confirmButton', function(){
    var userName = $('#hiddenName').text();
    var password = $('#hiddenPwd').text();
    $.ajax({
        type: "POST",
        data: {
            user_name: $('#hiddenName').text(),
            password: $('#hiddenPwd').text()
        },
        url: "join/confirm",
        dataType: "json",
        success: function(data) {
            localStorage.setItem('ID', data.id);
            localStorage.setItem('USER_NAME', data.user_name);
            localStorage.setItem('STATUS', data.status);
            window.location = '/welcome'
        }
    });
});

$('#content').on('click', '#cancelButton', function(){
    $('#glass').replaceWith('<div id="glass" class="form center-block glass"><div><p class="label">Join us</p></div><br><form><div class="form-group"><input name="username" type="text" placeholder="username" id="username" class="form-control"></div><div class="form-group"><input name="password" type="password" placeholder="password" id="password" class="form-control"></div><input type="button" value="Submit" id="joinButton" class="btn btn-primary btn-block"></form></div>');
});