function Socket(scene) {
	this.scene = scene;
	this.boardResponse = null;
	this.colorsResponse = [];
};

var validPositions = null;
Socket.prototype = Object.create(Object.prototype);
Socket.prototype.constructor = Socket;


Socket.prototype.sendRequest = function(requestString, type){
	if(type == 'board')
		this.postGameRequest(requestString, type);
	else if(type == 'colors')
		this.postGameRequest(requestString, type);
	else
		this.postGameRequest(requestString, type);
};

Socket.prototype.postGameRequest = function(requestString, type){
	var request = new XMLHttpRequest();
	request.open('POST', '../../game', true);
	var socket = this;
	if(type == 'board')
		request.onload = function(data){
									var message = data.target.response.split(";");
									var board = JSON.parse(message);
									socket.boardResponse = board.slice(',');
									console.log(socket.boardResponse);
								};

	request.onerror = function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('requestString='+encodeURIComponent(requestString));			
};

Socket.prototype.handleReply = function(data){
	console.log('reply');

	var message = data.target.response.split(";");

	console.log(message);
};

Socket.prototype.handleBoardReply = function(data){
	var message = data.target.response.split(";");
	var board = JSON.parse(message);
	return board.slice(',');

};

Socket.prototype.handleColorsReply = function(data){

	var message = data.target.response.split(";");
	var board = JSON.parse(message);
	this.colorsResponse = board.slice();
	console.log(this.colorsResponse);
};

Socket.prototype.processBoardToString = function(){
	var result = "[";

	for(var i = 1; i < this.scene.stateMachine.game.board.board.length; i++)
	{
		var line = '[';

		for(var j = 1; j < this.scene.stateMachine.game.board.board[i].length; j++)
		{
			line += this.scene.stateMachine.game.board.board[i][j].info;

			if(j != this.scene.stateMachine.game.board.board[i].length - 1)
				line += ',';
		}

		line += ']';
		if(i != this.scene.stateMachine.game.board.board.length - 1)
			line += ',';

		result += line;
	}

	return result + "]";
}