
exports.onListening = function(socket) {

	socket.on('disconnect', function(){

 	 });

  	socket.on('new login', function(username){
  		socket.username = username;
  	});

  	socket.on('send message', function(data) {
  		
  		io.emit('broadcast message', newMessage);
  	});

}