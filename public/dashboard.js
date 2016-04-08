var socket = io.connect();
var pages = {};
var btnclicks = {};

var lastPageId = 0;
var lastBtnId = 0;

socket.on('connect', function () {
    console.log('Socket connected');
    socket.on('pageview', function (msg) {
        $('#connections').html(msg.connections);
        if (msg.url) {
            if ($('#visits tr').length > 10) {
                $('#visits tr:last').remove();
            }
            $('#visits tbody').prepend('<tr><td>' + msg.url + '</td><td>' + msg.ip + '</td><td>' + msg.port + '</td><td>' + msg.timestamp + '</td></tr>');
            if (pages[msg.url]) {
                pages[msg.url].views = pages[msg.url].views + 1;
                $('#page' + pages[msg.url].pageId).html(pages[msg.url].views);
            } else {
                pages[msg.url] = {views: 1, pageId: ++lastPageId};
                $('#pageViews tbody').append('<tr><td>' + msg.url + '</td><td id="page' + lastPageId + '">1</td></tr>');
            }
        }
    });

socket.on('btn click', function(data){
        if(btnclicks[data.button]){
            console.log("already presented");
            btnclicks[data.button].clicks+=1;
            console.log(btnclicks[data.button].clicks);
            $('#btn' + btnclicks[data.button].btnid).html(btnclicks[data.button].clicks);            
        }
        else{
            console.log("not presented");
            btnclicks[data.button] = {clicks : 1, btnid : ++lastBtnId};
            $('#btnClicks tbody').append('<tr><td>' + data.button + '</td><td id = "btn' + lastBtnId + '">1</td></tr>');
        }
    });
});