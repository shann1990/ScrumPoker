var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, function(){
	console.log("App is listening on port 3000");
});

var users = {};
var userCount= 0;

var poker = io.of('/poker');
var dashboard = io.of('/dashboard');


poker.on('connection',function(socket){
	console.log(socket.id + ' : (Poker) A user has connection Hurraayyyy!!!');
	userCount ++;
	socket.on('disconnect',function(){		
		console.log(socket.id + ' : (Poker) User has left');
		delete users[socket.id];
		userCount--;
		dashboard.emit('user-count',userCount);
		dashboard.emit('users',users);
	})
	socket.on('user-data',function(data){		
		users[socket.id] = data.name;
		socket.emit('user-count',userCount);
		dashboard.emit('user-count',userCount);
		dashboard.emit('users',users);
	});
});

dashboard.on('connection',function(socket){
	console.log(socket.id + ' : (Dashboard) A user has connection Hurraayyyy!!!');
	socket.on('disconnect',function(){		
		console.log(socket.id + ' : (Dashboard) User has left');
	})
	console.log(userCount);
	socket.emit('user-count', userCount);
	socket.emit('users', users);
});
