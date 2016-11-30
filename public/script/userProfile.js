var lastPageId = 0;
var hasMorePages = true;
var isLoadingPages = false;
var limit = 10;
var count = 1;
var loadMoreButton = $('<button class="btn btn-default btn-block loadmore" id="loadMoreButton" onclick="loadMoreUsers()"> Load More </button>');

$(document).ready(function(){
    loadMoreUsers();
});

function loadMoreUsers(){
    if (hasMorePages){
       $.get('/administer/user?page='+(lastPageId+1)+'&limit='+limit, function(data) {
            $.each(data.users, function(index, element) {           
                var iconPath;
                var password = '******';
                var id = element.id;
                var username = element.user_name;
                var account = (element.is_active == 1 ? 'Active' : 'Inactive');
                var privilageLevel = (element.privilage == 2 ? 'Administer' : (element.privilage == 1 ? 'Coordinator' : 'Citizen'));
                $('.directorytable').append($('<tr class="user-' + id + '"><td>' + username + '</td><td class="text-center">' + account + '</td> <td class="text-center">' + privilageLevel + '</td> <td class="text-center">' + password + '</td> <td class="text-center"> <a href="#" class="editProfile" privilage="' + element.privilage + '" account="' + element.is_active + '" username="' + username + '" userId="' + id + '"><i class="fa fa-wrench"></i></a></td></tr>'));
            });
            lastPageId = data.meta.page;
            if (lastPageId >= data.meta.page_count) {
                hasMorePages = false;
            }
            if (hasMorePages) {
                $('.loadMoreSpan').append(loadMoreButton);
            }
            else {
                loadMoreButton.remove();
            }
        });
    }
}

$('#userProfile').on('click', '.editProfile', function() {
    var id = this.getAttribute('userId');
    var username = this.getAttribute('username');
    var account = this.getAttribute('account');
    var role = this.getAttribute('privilage');
    var is_active = '<td><div class="btn-group open"><button style="font-size: 12px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default btn-xs dropdown-toggle"><span class="caret"></span><span id="account-option-'+id+'" option="'+account+'"> '+ (account == 1 ? 'Active' : 'Inactive') +'</span></button>';
    is_active += '<ul style="font-size: 12px;" class="dropdown-menu"><li><a class="account-option" userId="'+id+'" option="1"> Active</a></li><li><a class="account-option" userId="'+id+'" option="0"> Inactive</a></li></ul></div></td>';
    var privilage = '<td><div class="btn-group open"><button style="font-size: 12px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default btn-xs dropdown-toggle"><span class="caret"></span><span id="role-option-'+id+'" option="'+role+'"> '+ (role == 2 ? 'Administer' : (role == 1 ? 'Coordinator' : 'Citizen')) +'</span></button>';
    privilage += '<ul style="font-size: 12px;" class="dropdown-menu"><li><a class="role-option" userId="'+id+'" option="2"> Administer</a></li><li><a class="role-option" userId="'+id+'" option="1"> Coordinator</a></li><li><a class="role-option" userId="'+id+'" option="0"> Citizen</a></li></ul></div></td>';
    var input = '<input style="width: 60px; font-size: 12px;" type="text" placeholder="username" id="username-' + id + '">';
    var html = '<td>' + input +'</td>' + is_active + privilage + '<td><input style="width: 60px; font-size: 12px;" type="text" placeholder="password" id="password-' + id + '"></td>' + '<td class="text-center"><a class="saveProfile" userId="' + id + '"><i style="font-size: 15px;" class="fa fa-floppy-o"></i></a></td>';
    $('.user-'+id).html(html);
    $('#username-'+id).val(username);
});

$('#userProfile').on('click', '.account-option', function() {
    var id = this.getAttribute('userId');
    var option = this.getAttribute('option');
    var target = $('#account-option-'+id);
    target.attr('option', option);
    target.html(this.text);
});

$('#userProfile').on('click', '.role-option', function() {
    var id = this.getAttribute('userId');
    var option = this.getAttribute('option');
    var target = $('#role-option-'+id);
    target.attr('option', option);
    target.html(this.text);
});

$('#userProfile').on('click', '.saveProfile', function() {
    var id = this.getAttribute('userId');
    var username = $('#username-'+id).val();
    var password = $('#password-'+id).val();
    var is_active = $('#account-option-'+id).attr('option');
    var account = ( is_active == '1' ? 'Active' : 'Inactive');
    var privilage = $('#role-option-'+id).attr('option');
    $.ajax({
        type: 'PUT',
        data: {
            user_name: username,
            is_active: is_active,
            privilage: privilage,
            password: password
        },
        url: '/administer/user/' + id,
        dataType: "json",
        statusCode: {
            200: function(data) {
                socket.emit('profile update', { user_id: id});
                password = '******';
                var role = (privilage == '2' ? 'Administer' : (privilage == '1' ? 'Coordinator' : 'Citizen'));
                var html = '<td>' + username + '</td><td class="text-center"> ' + account + '</td> <td class="text-center"> ' + role + '</td> <td class="text-center">' + password + '</td> <td class="text-center"> <a href="#" class="editProfile" privilage="' + privilage + '" account="' + is_active + '" username="' + username + '" userId="' + id + '"><i class="fa fa-wrench"></i></a></td>';
                $('.user-'+id).html(html);
            },
            400: function(err) {
                var msg = err.responseJSON.message;
                if (msg == 'UpdateError.PasswordIsUnderMinimumQuality')
                    alert('Invalid password.');
                else if (msg == 'UpdateError.InvalidUserInfor')
                    alert('Invalid User Information.');
                else
                    alert('Unknown error.');
            }
        }
    });
});
