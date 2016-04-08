var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser())
    app.use(express.static(path.join(__dirname, '/public')));
});

app.get('/', function(req,res){
	res.render('index');
});

var server = http.createServer(app);
io = io.listen(server,{
    'authorization' : function (handshakeData, callback) {
        if (handshakeData.xdomain) {
            callback('Cross-domain connections are not allowed');
        } else {
            callback(null, true);
        }
    }
});

// io.configure(function () {
//     io.set('authorization', function (handshakeData, callback) {
//         if (handshakeData.xdomain) {
//             callback('Cross-domain connections are not allowed');
//         } else {
//             callback(null, true);
//         }
//     });
// });

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {

    socket.on('btn click', function (data) {
        io.sockets.emit('btn click', {'button' : data.button});
    });


    socket.on('message', function (message) {
        console.log("Got message: " + message);
        ip = socket.handshake.address.address;
        port = socket.handshake.address.port;        
        url = message;
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': ip, 'port' : port,'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
    });

    socket.on('disconnect', function () {
        console.log("Socket disconnected");
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
    });

});