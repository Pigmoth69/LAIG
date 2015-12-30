function Socket(scene) {
	this.scene = scene;
	this.boardResponse = null;
	this.scoreResponse = null;
	this.colorsResponse = null;	
	this.winnerResponse = null;
	this.botResponseDROP = null;
	this.botResponseDRAG = null;
};

var validPositions = null;
Socket.prototype = Object.create(Object.prototype);
Socket.prototype.constructor = Socket;


Socket.prototype.sendRequest = function(requestString, type){
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
									//console.log(socket.boardResponse);
								};
	else if(type == 'score')
		request.onload = function(data){
									var message = data.target.response.split(";");
									var board = JSON.parse(message);
									socket.scoreResponse = board.slice(',');
									//console.log(socket.scoreResponse);
								};
	else if(type == 'colors')
		request.onload = function(data){

									var message = data.target.response.split(";");
									var array = JSON.parse(message);
									socket.colorsResponse = array.slice(',');
									console.warn(socket.colorsResponse);
								};
	else if(type == 'winner')
		request.onload = function(data){
									var message = data.target.response.split(";");
									var array = JSON.parse(message);
									socket.winnerResponse = array.slice(',');

									if(socket.winnerResponse.length == 0)
										socket.scene.stateMachine.game.winner = 0;
									else socket.scene.stateMachine.game.winner = socket.winnerResponse[0];
								};
	else if(type == 'botdrop')
		request.onload = function(data){
									var message = data.target.response.split(";");
									console.warn(message);
									socket.botResponseDROP = [parseInt(message[0]),parseInt(message[1]),parseInt(message[2])];
									console.warn(socket.botResponseDROP);
								};
	else if(type == 'botdrag')
		request.onload = function(data){
									var message = data.target.response.split(";");
									socket.botResponseDRAG = [parseInt(message[0]),parseInt(message[1]),parseInt(message[2]),parseInt(message[3])];
									console.warn(socket.botResponseDRAG);
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

Socket.prototype.processRemainingStonesToString = function(){
	var result = this.scene.stateMachine.game.board.remainingStones;
	return "["+result+"]";
}

Socket.prototype.processPlayedStonesToString = function(){
	var result = this.scene.stateMachine.game.board.playedStones;
	return "["+result+"]";
}