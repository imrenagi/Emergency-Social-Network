var limit = 30;
var lastNewsId;
function initMap() {
        
  var cmu = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('displayMap'), {
          zoom: 4,
          center: cmu
        });
  $.ajax({
      type: "GET",
      data: {},
      url: "/emergencyNews",
      dataType: "json",
      statusCode: {
          200: function(data) {
              var news = '';
              for (var i = 0; i < data.length; i++) {
                  news += updateNews(data[i],map);
              }
              $('#newsItems').prepend(news);
          }
      }
  });  
  
}

function updateNews(data, map)
{
  var senderName= data.reporter.user_name;
  var title = data.title;
  var text = data.message;
  var date = new Date(moment(data.timestamp*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC');
  var time = reformatTime2(date);
  var newsStatus = data.status;
  var lat = data.location.lat;
  var long = data.location.long;
  var newsId = data.id;
  var color ='normal'
  var icon = 'fa-minus'
  var img= data.image_url;
  switch (newsStatus) {
        case 1:  {
            color = 'ok';
            icon = 'fa-check-circle';
        };
        break;
        case 2: {
            color = 'warning';
            icon = 'fa-exclamation-triangle';
        }
        break;
        case 3: {
            color = 'danger';
            icon = 'fa-plus-square';
        }
    }
  var newsItem = '<div class="newsItems pin pin-' + color + '" id=' + newsId + '><div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  &nbsp &nbsp <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ') &nbsp &nbsp <a href="/privateChat/' + data.reporter.id + '">' + (data.reporter.id == localStorage['ID'] ? '' : '<i class="fa fa-comment-o"></i>') + '</a> </div><div class="pin-heading pin-heading-' + color + '"> <i class="fa ' + icon + '"></i> ' + senderName + ' </div>' + (text==null?'':'<p>'+ text+ '</p>') +(img==null?'':'<p><a href='+img+'><img class="textImage" style= "max-height: 100px; max-width: 100px;" src='+img+'></a></p>')+'</div>';
  insertIntoMap(newsItem, lat, long, map);
  lat = Number(lat).toPrecision(5);
  long = Number(long).toPrecision(5);
  var sentNewsItem = '<div class="newsItems pin pin-' + color + '" title="' + title + '" id='+newsId+' repid="'+data.reporter.id+'" reporter="'+senderName+'"lat = "'+lat+'" long="'+long+'" color="'+color+'" status="'+status+'" icon="'+icon+'" time="'+time+'" onClick="createModal('+newsId+')"><div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  &nbsp &nbsp <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ') </div><div id ="newsHead" class="pin-heading pin-heading-' + color + '">' + title + '</div><div id="panelText" text="'+ text + '"></div> <div id="panelImg" imgURL="'+img+'"></div></div>';
  lastNewsId = newsId;
  return sentNewsItem;
}

function insertIntoMap(newsItem, latitude, longitude, map)
{
  var loc = {lat: latitude, lng: longitude}
  var marker = new google.maps.Marker({
    position: loc,
    map: map
  });
  var infowindow = new google.maps.InfoWindow({
    content: newsItem
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
  map.panTo(loc);
}

function createModal(newsId)
{
  var sentNewsItem = document.getElementById(newsId);
  var title = sentNewsItem.getAttribute('title');
  var reporterId= sentNewsItem.getAttribute('repid');
  var reporter = sentNewsItem.getAttribute('reporter');
  var lat = sentNewsItem.getAttribute('lat');
  var long = sentNewsItem.getAttribute('long');
  lat = Number(lat).toPrecision(5);
  long = Number(long).toPrecision(5);
  var color = sentNewsItem.getAttribute('color');
  var status = sentNewsItem.getAttribute('status');
  var icon = sentNewsItem.getAttribute('icon');
  var time = sentNewsItem.getAttribute('time');
  var text = document.getElementById(newsId).children[2].getAttribute('text');
  var imgUrl = document.getElementById(newsId).children[3].getAttribute('imgURL');
  document.getElementById('newsModalBody').innerHTML=('<div class="pin pin-' + color + '"><div style="font-size: 14px;" class="info pin-heading-' + color + '">' + reporter +' <br><span class="fa fa-clock-o"></span> '+ time + ' &nbsp <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ') &nbsp &nbsp <a href="/privateChat/' + reporterId + '">' + (reporterId == localStorage['ID'] ? '' : '<i class="fa fa-comment-o"></i>') + '</a> </div><div style="font-size: 20px;" class="pin-heading pin-heading-' + color + '">' + title + ' </div>' + (text=='null'?'':('<p>'+text+'</p>'))+(imgUrl=='null'?'':('<span class="img-responsive center-block"><a href='+imgUrl+'><img style= "max-height: 75%; max-width: 75%;" src='+imgUrl+'></a></span>')) + '</div>');
  $('#newsModal').modal('show');
  console.log(text);
}

