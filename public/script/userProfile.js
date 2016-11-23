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
       $.get('/directory?page='+(lastPageId+1)+'&limit='+limit, function(data) {
            $.each(data.users, function(index, element) {           
                var iconPath;
                var status = element.status;
                var id = count;
                var username = element.user_name;
                var account = 'Active';
                var privilegeLevel = 'Citizen';
                switch(status) {
                    case 0: iconPath = '<i class="fa fa-minus"></i>'; break;
                    case 1: iconPath = '<i style="color: #9ccb19" class="fa fa-check-circle"></i>'; break;
                    case 2: iconPath = '<i style="color: #fcd116" class="fa fa-exclamation-triangle"></i>'; break;
                    case 3: iconPath = '<i style="color: #ce4844" class="fa fa-plus-square"></i>'; break;
                    default: iconPath = '<i class="fa fa-minus"></i>';
                }
                $('.directorytable').append($('<tr userId="' + id + '"><th>' + id +'</th>  <td class="text-center">' + username + '</td><td class="text-center">' + account + '</td> <td class="text-center">' + privilegeLevel + '</td> <td class="text-center statusTableIcon">'+  iconPath  + '</td> <td class="text-center"> <a href="#" class="editProfile" userId="' + id + '"><i class="fa fa-wrench"></i></a></td></tr>'));
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
