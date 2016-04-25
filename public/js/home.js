var socket = io();
$(window).on('beforeunload', function(){
	console.log("Unloading");
    socket.close();
});

var room = '';
var name = '';
socket.on('createroom', function(param) {
	console.log("Created room " + param.roomId);
	history.pushState({}, 'MultiSand', 'room/' + param.roomId);
	socket.emit('join', {roomId: param.roomId});

});

socket.on('joinroom', function(param) {
	console.log("Joined room " + param.roomId);
	name = param.username;
	room = param.roomId;
	showPlayArea();
});

socket.on('updated_messages', function(param) {
	console.log("Messages:" + param.messagelist);
	$('#chatlist').html($('<li>').text(""));
	for(message in param.messagelist){

		console.log(param.messagelist[message].msg);
 		$('#chatlist').append($('<li>').text(param.messagelist[message].user + ": " + param.messagelist[message].msg));
	}
	var objDiv = document.getElementById("chatlist");
	objDiv.scrollTop = objDiv.scrollHeight;

});

var index = window.location.href.indexOf('/room/');
if (index > -1) {
	$('#newroom').hide();
	var joinRm = window.location.href.substring(index + 6);
	console.log("Join room " + joinRm);
	socket.emit('join', {roomId: joinRm});
}

function newRoom() {
	console.log("New room request");
	socket.emit('create', {});
}

function showPlayArea() {
	$('#newroom').hide();
	$('#play').show();
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "/js/game.js";
	$("body").append(s);
}

$('#chat').submit(function(){
	socket.emit('message', $('#m').val(),name);
	$('#m').val('');
	return false;
});