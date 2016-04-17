/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var cfenv = require('cfenv');
var app = express();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);



//info for client side stuff
//emit a 'join' with the room as a parameter to join a room
//emit a 'leave' with the room as a parameter to leave the room
//emit a 'message' to send a message to the room
//listen for a 'broadcast_message' for new messages in the current room
//listen for a 'broadcast_action' for a new action from another client
//listen for a 'broadcast_update' for a server version of the room state


//var redis = require('redis');
//var redisclient = redis.createClient();
//var uuid = require('node-uuid');


app.get('/', function(req, res){
	res.send('Hello World!');
   // res.render('/index.html');
});
function getNewRoom(){
	//need to return the starting state of a room
	return 0;
}

function initRoom(roomID){
	
	var data = getNewRoom();
	//redisclient.hmset(roomID,{'data': data,'numofplayers':0});
	
	//initialze redis information for the room
}

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!');
});

/*
io.sockets.on('connection', function(socket) {
	
  //request to join a room
  socket.on('join', function(channel) {
    socket.get('room', function() {
    	
      socket.set('room', channel, function() {
        socket.join(channel);
      });
      
    });
  });
  
  
  //request to create a new room
  
   socket.on('create', function() {
	  var roomid = uuid.v4();
	  initRoom(roomid); 
      socket.set('room', roomid, function() {
        socket.join(roomid);
      });

  });
  
  
  
  //request to send a message to the room
   socket.on('message', function(msg,user) {
    socket.get('room', function(err, room) {
      if (err) {
        socket.emit('error', err);
      } else if (room) {
        socket.broadcast.to(room).emit('broadcast_message', msg,user);
      } else {
        socket.emit('error', 'no room');
      }
    });
  });
  
  
  
  
  //request to update a room state 
  socket.on('new_action', function(msg,user) {
    socket.get('channel', function(err, room) {
      if (err) {
        socket.emit('error', err);
      } else if (room) {
        socket.broadcast.to(room).emit('broadcast', msg,user);
      } else {
        socket.emit('error', 'no room');
      }
    });
  });
  
  
});*/
