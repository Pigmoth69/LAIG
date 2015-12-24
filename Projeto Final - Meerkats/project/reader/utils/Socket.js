function Socket(scene) {
	this.scene = scene;
	this.response = null;
	this.portEnabled = true;
};


Socket.prototype = Object.create(Object.prototype);
Socket.prototype.constructor = Socket;


Socket.prototype.sendRequest = function(requestString){

	this.postGameRequest(requestString, this.handleReply);
};

Socket.prototype.postGameRequest = function(requestString, onSuccess, onError){
	var request = new XMLHttpRequest();
	request.open('POST', '../../game', true);

	request.onload = onSuccess;
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('requestString='+encodeURIComponent(requestString));			
};

Socket.prototype.handleReply = function(data){

	var message = data.target.response.split(";");

	this.response = message;

	console.log(message);
};