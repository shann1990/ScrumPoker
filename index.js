var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, function(){
	console.log("App is listening on port 3000");
});

var users = { player1: {id:null,name:null}, 
					player2: {id:null,name:null},
					player3: {id:null,name:null},
					player4: {id:null,name:null},
					player5: {id:null,name:null},
					player6: {id:null,name:null},
					player7: {id:null,name:null},
					player8: {id:null,name:null} };

var userCount= 0;

var poker = io.of('/poker');
var dashboard = io.of('/dashboard');

poker.on('connection',function(socket){
	console.log(socket.id + ' : (Poker) A user has connection Hurraayyyy!!!');
	userCount ++;
	socket.on('disconnect',function(){		
		console.log(socket.id + ' : (Poker) User has left');
		removeUserSeat(socket.id);
		userCount--;
		dashboard.emit('user-count',userCount);
		dashboard.emit('users',users);
	})
	socket.on('user-data',function(data){	
		allocateUserSeat(socket.id, data.name);
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
	socket.emit('user-count', userCount);
	socket.emit('users', users);
});


function removeUserSeat(socketid){
	for(var key in users){
		if(users[key].id == socketid){
			users[key].id = null;
			users[key].name = null;
			break;
		}
	}
}

function allocateUserSeat(socketid, username){
	for(var key in users){
		if(users[key].id == null){
			users[key].id = socketid;
			users[key].name = username;
			break;
		}
	}
}