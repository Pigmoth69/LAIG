function Socket(scene) {
	this.scene = scene;
	this.response = [];
	this.colorsResponse = [];
	this.boardResponse = [];
};


Socket.prototype = Object.create(Object.prototype);
Socket.prototype.constructor = Socket;


Socket.prototype.sendRequest = function(requestString, type){
	if(type == 'board')
		this.postGameRequest(requestString, this.handleBoardReply);
	else if(type == 'colors')
		this.postGameRequest(requestString, this.handleColorsReply);
	else
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
	console.log('reply');

	var message = data.target.response.split(";");

	console.log(message);
};

Socket.prototype.handleBoardReply = function(data){

	var message = data.target.response.split(";");
	var board = JSON.parse(message);
	this.boardResponse = board.slice(',');
	console.log(this.boardResponse);
};

Socket.prototype.handleColorsReply = function(data){

	var message = data.target.response.split(";");
	var board = JSON.parse(message);
	this.colorsResponse = board.slice();
	console.log(this.colorsResponse);
};

Socket.prototype.processBoardToString = function(){
	var result = "[";

	for(var i = 1; i < this.scene.stateMachine.game.board.length; i++)
	{
		var line = '[';

		for(var j = 1; j < this.scene.stateMachine.game.board[i].length; j++)
		{
			line += this.scene.stateMachine.game.board[i][j].info;

			if(j != this.scene.stateMachine.game.board[i].length - 1)
				line += ',';
		}

		line += ']';
		if(i != this.scene.stateMachine.game.board.length - 1)
			line += ',';

		result += line;
	}

	return result + "]";
}