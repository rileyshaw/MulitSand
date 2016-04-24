var socket = io();
$(window).on('beforeunload', function(){
	console.log("unload");
    socket.close();
});
socket.on('connection', function(){
    console.log('user');
});
function newRoom() {
	console.log("New room request");
}


