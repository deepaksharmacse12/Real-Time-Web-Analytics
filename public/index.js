var btnclicks = 0;
var url = window.location;	//url of the website

var socket = io.connect();

socket.on('connect', function () {
	socket.send(url);
});

window.onhashchange = function () {
	socket.send(window.location.href);
};

$(document).ready(function(){
	$('#btn1').click(function(){
		socket.emit('btn click', { 'button' : 'btn1'});
	});

	$('#btn2').click(function(){
		socket.emit('btn click', { 'button' : 'btn2'});
	});	
})