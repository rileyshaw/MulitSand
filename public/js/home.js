var socket = io();
$(window).on('beforeunload', function(){
	console.log("Unloading");
    socket.close();
});

socket.on('connection', function(){
    console.log('Connected');
});

socket.on('createroom', function(param) {
	console.log("Created room " + param.roomId);
	history.pushState({}, 'MultiSand', 'room/' + param.roomId);
});

socket.on('joinroom', function(param) {
	console.log("Joined room " + param.roomId);
	showPlayArea();
});

function newRoom() {
	console.log("New room request");
	socket.emit('create', {});
}

var index = window.location.href.indexOf('/room/');
if (index > -1) {
	$('#newroom').hide();
	var joinRm = window.location.href.substring(index + 6);
	console.log("Join room " + joinRm);
	socket.emit('join', {roomId: joinRm});
}

function showPlayArea() {
	$('#newroom').hide();
	$('#play').show();
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "/js/game.js";
	$("body").append(s);
}

