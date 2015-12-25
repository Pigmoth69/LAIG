function Socket(scene) {
	this.scene = scene;
	this.response = [];
	this.boardResponse = [];
};


Socket.prototype = Object.create(Object.prototype);
Socket.prototype.constructor = Socket;


Socket.prototype.sendRequest = function(requestString, expectedBoardResult){

	if(expectedBoardResult)
		this.postGameRequest(requestString, this.handleBoardReply);
	else this.postGameRequest(requestString, this.handleReply);
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

	this.response = data.target.response.split(";");

	console.log(JSON.parse(message));
	console.log(this.response);
};

Socket.prototype.handleBoardReply = function(data){

	var message = data.target.response.split(";");
	var board = JSON.parse(message);
	this.boardResponse = board.slice();
	console.log(this.boardResponse);
};

Socket.prototype.processBoardToString = function(){
	var result = "[";

	for(var i = 1; i < this.scene.graph.leaves['board'].board.length; i++)
	{
		var line = '[';

		for(var j = 1; j < this.scene.graph.leaves['board'].board[i].length; j++)
		{
			line += this.scene.graph.leaves['board'].board[i][j].info;

			if(j != this.scene.graph.leaves['board'].board[i].length - 1)
				line += ',';
		}

		line += ']';
		if(i != this.scene.graph.leaves['board'].board.length - 1)
			line += ',';

		result += line;
	}

	return result + "]";
}