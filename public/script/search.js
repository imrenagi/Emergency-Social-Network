queryType = {
    'opt-user': 'user_name', 
    'opt-ann': 'announcement', 
    'opt-stat': 'user_status',
    'opt-pri-msg': 'private_message',
    'opt-pub-msg': 'public_message'
};
var limit = 10;
function searchInfo(type, query, pn) {
    $.ajax({
        type: 'GET',
        data: {
            query: query,
            limit: limit,
            page: pn
        },
        url: '/search/' + type,
        dataType: "json",
        success: function(data) {
            $('#query-data').attr('type', type);
            $('#query-data').attr('query', query);
            $('#query-data').attr('pn', pn);
            $('#search-textarea').val('');
            var list = $('#result-list');
            list.html('');
            var result = data.results;
            switch(type) {
                case 'user_name': {
                    var noColCls = 'col-md-1', nameColCls = 'col-md-4', onlineColCls='col-md-3', statusColCls='col-md-4';
                    list.append('<li class="list-group-item text-center text-bold"><div class="row"><div class="' + noColCls + '">#</div><div class="' + nameColCls + '">Name</div><div class="' +  onlineColCls + '">Online</div><div class="' + statusColCls + '">Status</div></div></li>')
                    for (var i = 0; i < result.length; i++) {
                        var id = result[i].id;
                        var name = result[i].user_name;
                        var online=result[i].online;
                        var status = statusType[result[i].status];
                        list.append('<li class="list-group-item text-center"><div class="row"><div class="' + noColCls + ' text-bold">' + (i+1) + '</div><div class="' + nameColCls + '">' + name + '</div><div class="' +  onlineColCls + '">' + (online == 1 ? 'Y' : 'N') + '</div><div class="' + statusColCls + '">' + status.html + '</div></div></li>');
                    }
                    break;
                }
                case 'announcement': {
                    break;
                }
                case 'user_status': {
                    break;
                }
                case 'private_message': {
                    break;
                }
                case 'public_message': {
                    break;
                }
            }
        }
    });
}
$('#search-btn').click(function() {
    var option = $('#search-option').attr('option')
    query = $('#search-textarea').val();
    if (query && query != '') {
        searchInfo(queryType[option], query, 1);
    }
});

$('#dropdown-list a').click(function() {
    var option = $('#search-option');
    option.text(' ' + $(this).text());
    option.attr('option', this.id);
});
