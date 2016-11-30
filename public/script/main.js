months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
statusType = [
    {
        text: 'Undefined',
        html: '<i class="fa fa-minus"> </i>',
        color: '#000000',
        border_color: '#1b809e',
    },
    {
        text: 'OK',
        html: '<i style="color: #9ccb19" class="fa fa-check-circle"></i>',
        color: '#9ccb19',
        border_color: '#9ccb19'
    },
    {
        text: 'Help',
        html: '<i style="color: #fcd116" class="fa fa-exclamation-triangle"></i>',
        color: '#fcd116',
        border_color: '#fcd116'
    },
    {
        text: 'Emergency',
        html: '<i style="color: #ce4844" class="fa fa-plus-square"></i>',
        color: '#ce4844',
        border_color: '#ce4844'
    }
]
var textarea = document.querySelector('textarea');

if (textarea) {
    textarea.addEventListener('keydown', autosize);
}
             
function autosize(){
  var el = this;
  setTimeout(function(){
    el.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    // el.style.cssText = '-moz-box-sizing:content-box';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
}

function reformatTime(date) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(date);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = '0' + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = '0' + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = months[date.getMonth()] + '. ' + date.getDate() + ' '
                        + date.getFullYear() + ' '
                        + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
};

function reformatTime2(date) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(date);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = '0' + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = '0' + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = date.getMonth() + '/' + date.getDate() + '/'
                        + date.getFullYear() + ' '
                        + hours + ':' + minutes.substr(-2);
    return formattedTime;
};
