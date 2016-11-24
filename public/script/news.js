var limit = 30;
var lastNewsId;
function initMap() {
  var data = 
             [
              {
                  "id" : 1,
                  "reporter" : {
                      "id" : 2,
                      "user_name" : "Shicheng"
                  },
                  "timestamp" : 1476871883,
                  "status" : 3,
                  "location" : {
                      "lat" : 30.0,
                      "long" : 20.0
                  },
                  "message" : "Something bad is happening!",
                  "image_url" : "https://upload.wikimedia.org/wikipedia/commons/3/36/Large_bonfire.jpg"
              },
              {
                  "id" : 2,
                  "reporter" : {
                      "id" : 2,
                      "user_name" : "Shicheng"
                  },
                  "timestamp" : 1476871883,
                  "status" : 1,
                  "location" : {
                      "lat" : 20.0,
                      "long" : 30.0
                  },
                  "message" : "Yoga is happening!",
                  "image_url" : "http://www.w3schools.com/css/img_fjords.jpg"
              }

            ];
        
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('displayMap'), {
          zoom: 4,
          center: uluru
        });
  var news =updateNews(data[0], map);
  $('#newsItems').prepend(news);
   var news =updateNews(data[1], map);
  $('#newsItems').prepend(news);
 /* $.ajax({
      type: "GET",
      data: {},
      url: "/message/news",
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
  });  */
  
}

function updateNews(data, map)
{
  var senderName= data.reporter.user_name;
  var text = data.message;
  var date = new Date(moment(data.timestamp*1000).format('MM/DD/YYYY hh:mm:ss A') + ' UTC');
  var time = reformatTime(date);
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
  var newsItem = '<div class="newsItems pin pin-' + color + '" id=' + newsId + '><div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  &nbsp &nbsp <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ') &nbsp &nbsp <a href="/privateChat/' + data.reporter.id + '">' + (data.reporter.id == localStorage['ID'] ? '' : '<i class="fa fa-comment-o"></i>') + '</a> </div><div class="pin-heading pin-heading-' + color + '"> <i class="fa ' + icon + '"></i> ' + senderName + ' </div><p>' + (text==''?'':text) + '</p>'+(img==''?'':'<p><a href='+img+'><img class="textImage" src='+img+'></a></p>')+'</div>';
  insertIntoMap(newsItem, lat, long, map);
  var sentNewsItem = '<div class="newsItems btn pin-' + color + '" id='+newsId+' repid="'+data.reporter.id+'" reporter="'+senderName+'"lat = "'+lat+'" long="'+long+'" colour="'+color+'" status="'+status+'" icon="'+icon+'" time="'+time+'" onClick="createModal('+newsId+')"><div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  &nbsp &nbsp <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ') &nbsp &nbsp <a href="/privateChat/' + data.reporter.id + '">' + (data.reporter.id == localStorage['ID'] ? '' : '<i class="fa fa-comment-o"></i>') + '</a> </div><div id ="newsHead" class="pin-heading pin-heading-' + color + '"> Report No:'+newsId+' &nbsp Status:<i class="fa ' + icon + '"></i> &nbspReporter:' + senderName + ' </div><div id="panelText" text="'+ text + '"></div> <div id="panelImg" imgURL="'+img+'"></div></div>';
  lastNewsId = newsId;
  return sentNewsItem;
}

function insertIntoMap(newsItem, latitude, longitude, map)
{
  var location = {lat: latitude, lng: longitude}
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  var infowindow = new google.maps.InfoWindow({
    content: newsItem
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
  map.panTo(location);
}

function createModal(newsId)
{
  var sentNewsItem = document.getElementById(newsId);
  var reporterId= sentNewsItem.getAttribute('repid');
  var reporter = sentNewsItem.getAttribute('reporter');
  var lat = sentNewsItem.getAttribute('lat');
  var long = sentNewsItem.getAttribute('long');
  var color = sentNewsItem.getAttribute('color');
  var status = sentNewsItem.getAttribute('status');
  var icon = sentNewsItem.getAttribute('icon');
  var time = sentNewsItem.getAttribute('time');
  var text = document.getElementById(newsId).children[2].getAttribute('text');
  var imgUrl = document.getElementById(newsId).children[3].getAttribute('imgURL');
  document.getElementById('newsModalTitle').innerHTML='<div class="info pin-heading-' + color + '"> <span class="fa fa-clock-o"></span> '+ time + '  &nbsp &nbsp <span class="fa fa-map-marker"></span> ('+ lat + ', ' + long + ') &nbsp &nbsp <a href="/privateChat/' + reporterId + '">' + (reporterId == localStorage['ID'] ? '' : '<i class="fa fa-comment-o"></i>') + '</a> </div><div class="pin-heading pin-heading-' + color + '"> <i class="fa ' + icon + '"></i> ' + reporter + ' </div>';
  document.getElementById('newsModalBody').innerHTML=((text==''?'':('<p>'+text+'</p>'))+(imgUrl==''?'':('<span class="img-responsive center-block"><a href='+imgUrl+'><img style= "max-height: 400px; max-width: 400px;" src='+imgUrl+'></a></span>')));
  $('#newsModal').modal('show');
  console.log(text);
}

