var socket = io();
socket.on('connection', function(){
    console.log('user');
});
$(window).on('beforeunload', function(){
    socket.close();
});

function newRoom() {
	console.log("New room request");
}
