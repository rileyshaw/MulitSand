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

var port = (process.env.VCAP_APP_PORT || 1337);

var redis = require('redis');
var credentials;
var redisclient;
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    credentials = env['redis-2.6'][0]['credentials'];
    redisclient = redis.createClient(credentials.port, credentials.host);
    if (credentials.password != '') {
        redisclient.auth(credentials.password);
    }
} else {
    redisclient = redis.createClient();
}

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


var adj = ["Adorable","Alluring","Green","Red","Yellow","Hairy","Wild","Eager","Energetic","Brave",
"Clumsy","Black","Ambitious","Jolly","Witty","Grumpy","Sad","Unhappy","Bright","Orange"];

var obj = ["Elephant","Alligator","Antelope","Baboon","Beaver","Bison","Bear","Buffalo","Camel","Cobra","Dog",
"Iguana","Coyote","Horse","Lemur","Zebra","Yak","Wolverine","Leopard","Tiger","Turtle"];

function getNewRoom(){
    //need to return the starting state of a room
    return 0;
}

function initRoom(roomID){
    var data = getNewRoom();
    //redisclient.hmset(roomID,{'data': data,'numofplayers':0});

    //initialze redis information for the room
}

function Message(message,user) {
    this.message = message;
    this.user = user;
}



var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!'  );
});

redisclient.on('connect', function() {
    console.log('connected to redis');
});

io.listen(server);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


io.sockets.on('connection', function(socket) {
    console.log("Connected");

    //request to join a room
    socket.on('join', function(param) {
        var rand1 = getRandomInt(0,adj.length);
        name = adj[rand1];
        rand1 = getRandomInt(0,obj.length);
        name = name + obj[rand1];
        var roomid = param.roomId;
        socket.join(roomid);
        console.log('Joined room ' + roomid);
        socket.emit('joinroom', {roomId: roomid, username: name});
        var clients = io.sockets.adapter.rooms[roomid].sockets;   





       redisclient.get(roomid, function(err, reply) {
                console.log(reply);
                var messages;
                if (reply == null){
                    console.log("empty");
                    return;
                }else{
                    var messages = JSON.parse(reply);
                }

                 io.in(roomid).emit('updated_messages', {messagelist: messages});
            });




        socket.to(roomid).on('message', function(msg,user) {
            redisclient.get(roomid, function(err, reply) {
                console.log(reply);
                var messages;
                if (reply == null){
                    console.log("empty");
                    var messages = new Array();
                }else{
                    var messages = JSON.parse(reply);
                }
                var message = {msg:msg , user:user};
                console.log("added");
                messages.push(message);

                var string = JSON.stringify(messages);
                 redisclient.set(roomid,string);

                 io.in(roomid).emit('updated_messages', {messagelist: messages});
            });
        });

        socket.to(roomid).on('world', function(param) {
            socket.broadcast.to(roomid).emit('worlddata', param);
        });

        socket.to(roomid).on('blockspawn', function(param) {
            socket.broadcast.to(roomid).emit('blockcreate', param);
        });

        //to get the number of clients
        var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
        for (var clientId in clients ) {
            var clientSocket = io.sockets.connected[clientId];
            clientSocket.emit('requestworld');
            break;  //  We only want one client to send us their world
        }
    });

    //request to create a new room
    socket.on('create', function() {
        console.log('creating room...');
        var roomId = uuid.v4();
        initRoom(roomId); 
        socket.join(roomId);
        console.log('Created room ' + roomId);
        socket.emit('createroom', {roomId: roomId});
       // socket.emit('joinroom', {roomId: roomId});
    });

    //request to send a message to the room
});