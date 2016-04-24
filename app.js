/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var cfenv = require('cfenv');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//  LESS stylesheets
var lessMiddleware = require('less-middleware');

//info for client side stuff
//emit a 'join' with the room as a parameter to join a room
//emit a 'leave' with the room as a parameter to leave the room
//emit a 'message' to send a message to the room
//listen for a 'broadcast_message' for new messages in the current room
//listen for a 'broadcast_action' for a new action from another client
//listen for a 'broadcast_update' for a server version of the room state


var redis = require('redis');
var redisclient = redis.createClient();
var uuid = require('node-uuid');

app.set('view engine', 'ejs');

app.set('views', __dirname + '/public');

app.use(lessMiddleware({
    src: __dirname + "/public",
    compress: true
}));
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.render('index');
});

app.get('/room/:roomId', function(req, res) {
    var roomId = req.params.roomId;
    res.render('index');
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

var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!'  );
});

io.listen(server);

io.sockets.on('connection', function(socket) {
    console.log("Connected");

    //request to join a room
    socket.on('join', function(param) {
        var roomid = param.roomId;
        socket.join(roomid);
        console.log('Joined room ' + roomid);
        socket.emit('joinroom', {roomId: roomid});
    });

    //request to create a new room
    socket.on('create', function() {
        console.log('creating room...');
        var roomid = uuid.v4();
        initRoom(roomid); 
        socket.join(roomid);
        console.log('Created room ' + roomid);
        socket.emit('createroom', {roomId: roomid});
        socket.emit('joinroom', {roomId: roomid});
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

});
