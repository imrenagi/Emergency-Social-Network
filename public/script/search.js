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
            console.log(data);
            var results = data.results,
                meta = data.meta;
            $('#query-data').attr('type', type);
            $('#query-data').attr('query', query);
            $('#query-data').attr('pn', meta.page);
            $('#query-data').attr('tpn', meta.page_count);
            $('#search-textarea').val('');
            var list = $('#result-list');
            list.html('');
            switch(type) {
                case 'user_name':
                case 'user_status': {
                    var noColCls = 'col-md-1', nameColCls = 'col-md-4', onlineColCls='col-md-3', statusColCls='col-md-4';
                    list.append('<li class="list-group-item text-center text-bold"><div class="row"><div class="' + noColCls + '">#</div><div class="' + nameColCls + '">Name</div><div class="' +  onlineColCls + '">Online</div><div class="' + statusColCls + '">Status</div></div></li>')
                    for (var i = 0; i < results.length; i++) {
                        var id = results[i].id,
                            name = results[i].user_name,
                            online=results[i].online,
                            status = statusType[results[i].status];
                        list.append('<li class="list-group-item text-center"><div class="row"><div class="' + noColCls + ' text-bold">' + (i+1) + '</div><div class="' + nameColCls + '">' + name + '</div><div class="' +  onlineColCls + '">' + (online == 1 ? 'Y' : 'N') + '</div><div class="' + statusColCls + '">' + status.html + '</div></div></li>');
                    }
                    break;
                }
                case 'announcement': {
                    for (var i = 0; i < results.length; i++) {
                        var text = results[i].text,
                            sender = results[i].sender.user_name,
                            location = '(' + results[i].location.lat + ', ' + results[i].location.long + ')',
                            time = reformatTime(new Date(moment(results[i].timestamp*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC')),
                            html = '<li class="list-group-item">';
                        html += '<div class="float-right"><span class="fa fa-clock-o"></span> ' + time + '  | <span class="fa fa-map-marker"></span> ' + location + '</div></div>';
                        html += '<div class="message-header"><span class="glyphicon glyphicon-user"></span> ' + sender + '</div>';
                        html += '<p>' + text + '</p>';
                        html += '</li>';
                        list.append(html);
                    }
                    break;
                }
                case 'private_message': {
                    for (var i = 0; i < results.length; i++) {
                        var text = results[i].text,
                            sender = results[i].sender.user_name,
                            status = statusType[results[i].status],
                            location = '(' + results[i].location.lat + ', ' + results[i].location.long + ')',
                            time = reformatTime(new Date(moment(results[i].timestamp*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC')),
                            html = '<li class="list-group-item border" style="border-left-color:' + status.border_color + ';">';
                        html += '<div class="float-right" style="color: ' + status.color + ';"><span class="fa fa-clock-o"></span> ' + time + '  | <span class="fa fa-map-marker"></span> ' + location + '</div></div>';
                        html += '<div class="message-header">' + status.html + ' ' + sender + '</div>';
                        html += '<p>' + text + '</p>';
                        html += '</li>';
                        list.append(html);
                    }
                    break;
                }
                case 'public_message': {
                    break;
                }
            }
            addPagination(pn, meta.page_count);
        }
    });
}

function addPagination(curPN, totalPN) {
    if (totalPN <= 1) {
        return;
    }

    var startPN, endPN;
    if (curPN - 4 <= 0) {
        startPN = 1;
        endPN = Math.min(10, totalPN);
    }
    else if (curPN + 5 > totalPN) {
        startPN = Math.max(1, totalPN-9);
        endPN = totalPN;
    }
    else {
        startPN = curPN - 4;
        endPN = Math.min(curPN + 5, totalPN);
    }

    $('.pagination').html('');

    var html = (curPN == 1 ? '' : '<li><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a></li>');
    for (var i = startPN; i <= endPN; i++)
        html += '<li' + (curPN == i ? ' class="active">' : '>') + '<a href="#" aria-label="' + i + '">' + i + (curPN == i ? ' <span class="sr-only">(current)</span>' : '') + '</a></li>';
    html += (curPN == totalPN ? '' : '<li><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></li>');
    $('.pagination').append(html);
}

$('#search-btn').click(function() {
    var option = $('#search-option').attr('option')
    query = $('#search-textarea').val();
    if (query && query != '') {
        searchInfo(queryType[option], query, 1);
    }
});

$('.pagination').on('click', 'a', function() {
    var label = this.getAttribute('aria-label');
    var pn = Number($('#query-data').attr('pn'));
    if (label == 'Previous') {
        pn--;
    } else if (label == 'Next') {
        pn++;
    } else {
        pn = Number(label);
    }
    searchInfo($('#query-data').attr('type'), $('#query-data').attr('query'), pn);
});

$('#dropdown-list a').click(function() {
    var option = $('#search-option');
    option.text(' ' + $(this).text());
    option.attr('option', this.id);
});
