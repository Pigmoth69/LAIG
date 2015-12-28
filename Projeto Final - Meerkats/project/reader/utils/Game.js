function Game(scene) {
	this.board = new MyBoard(scene);


	this.scene = scene;
	this.players = [];
	this.roundMove = 'drop';
	this.roundNumber = 1;
	this.score = [0, 0, 0, 0];
	this.endGame = false;

	this.animation = false;
	this.updateScore = false;
	this.validDragPositions = false;

	this.pickedStone = null;

	this.playedStone = null;

	this.pickedBoardTile = null;

	this.undo = false;
	this.undoRegister = [];
};


Game.prototype = Object.create(Object.prototype);
Game.prototype.constructor = Game;


Game.prototype.display = function(){
	this.board.display();
	//this.scene.drawNode(this.scene.graph.root['Gameplay'], 'null', 'clear');
};

Game.prototype.picking = function(obj){
	if(obj[0] instanceof MyStone)
		this.pickingStone(obj);
	else if(obj[0] instanceof MyBoardTile)
		this.pickingTile(obj);

};



/** Controla as principais açoes durante a excuçao do jogo
 *
 */
Game.prototype.handler = function(){

	//recolhe a informaçao relativa a cores sorteadas para cada jogador
	if(this.scene.socket.colorsResponse != null){
		this.generatePlayersList();
	}

	//executa a animacao da peça a ser movimentada
	if(this.animation)
		this.pickedStone.movementAnimation();

	//se o socket contiver informação respetiva ao arrasto de uma peçça, o tabuleiro é alterado
	if(this.validDragPositions && this.scene.socket.boardResponse != null)
	{
		this.board.highlightDragPositions(this.scene.socket.boardResponse);
		this.validDragPositions = false;
		this.scene.socket.boardResponse = null;
	}

	//se o socket contiver informaçao respetiva a novos valores de score, o array de scores é atualizado
	if(this.updateScore && this.scene.socket.scoreResponse != null)
	{
		this.updateGameScore();
		this.updateScore = false;
		this.scene.socket.scoreResponse = null;
	}

	//se as rondas do jogo forem superiores a 15, poderá ocorrer uma situação de vitoria
	if(this.roundNumber >= 15 && this.roundNumber <= 60){

		//primeira condiçao de vitoria: um grupo de cores tiver dimensao de 15
		var groupOf15 = this.score.indexOf(15);
		if(groupOf15 != -1 && this.colorAssigned(groupOf15))
		{
			console.log('alguem ganhou');
			this.endGame = true;
		}
	}
	else if(this.roundNumber == 61)
			this.endGame = true;
};




Game.prototype.generatePlayersList = function(){
	var totalPlayers = this.scene.Humans + this.scene.Bots;
	var index = this.scene.socket.colorsResponse.length -1;
	for(var i = 1; i <= this.scene.Humans; i++, index--)
	{
		var Human = 'Player' + i;
		var player = [Human, this.scene.socket.colorsResponse[index][1]];
		this.players.push(player);
	}

	for(var i = 1; i <= this.scene.Bots; i++, index--)
	{
		var Bot = 'Bot' + i;
		var player = [Bot, this.scene.socket.colorsResponse[index][1]];
		this.players.push(player);
	}

	this.scene.socket.colorsResponse = null;
	console.log(this.players);
	console.log(this.colorAssigned(1));
};


Game.prototype.dropStone = function(tile){

	switch(this.pickedStone.colorMaterial){
		case 'blueStone':
			tile.info = 1;
			break;
		case 'redStone':
			tile.info = 2;
			break;
		case 'greenStone':
			tile.info = 3;
			break;
		case 'yellowStone':
			tile.info = 4;
			break;
		default: break;
	}

	this.pickedStone.standByAnimationHeight = 0;
	this.pickedStone.standByAnimationVelocity = 0.17;
	this.pickedStone.picked = false;
	this.pickedStone.dropStone(tile.position);
	this.board.validDropPositions = false;
}

Game.prototype.pickingStone = function(obj){
	
	//se pickedStone ja estiver atribuido a alguma pedra
	if(this.pickedStone != null)
	{
		//se a pickedStone for a mesma que a peça selecionada, elimina-se a seleçao e termina se a execuçao da funcao
		if(this.pickedStone.id && obj[0].id) 
		{
			this.pickedStone.standByAnimationHeight = 0;
			this.pickedStone.standByAnimationVelocity = 0.17;
			this.pickedStone.picked = false;
			this.pickedStone = null;
			this.board.resetHighlight();
			return;
		}

		//se uma pedra diferente da que esta marcada for seleciona-se, execuçao é trocada para a nova stone
		this.pickedStone.picked = false;
		this.pickedStone = null;
	}
	

	//registando peça selecionada no picking
	if((this.roundMove == 'drop' && obj[0].tile == null) || (this.roundMove == 'drag' && obj[0].tile != null && obj[0].id != this.playedStone.id))
	{
		obj[0].picked = true;
		this.pickedStone = obj[0];

		if(this.roundMove == 'drop')
			this.board.highlightDropPositions();
		else if(this.roundMove == 'drag')
		{
			this.validDragPositions = true;
			var stringBoard = this.scene.socket.processBoardToString();
			var requestString = "[validDragPositions," + this.pickedStone.tile.row + ',' + this.pickedStone.tile.col + ',' + stringBoard + ",_Result" + "]";
			this.scene.socket.sendRequest(requestString, 'board');
		}
	}
};

Game.prototype.pickingTile = function(obj){
	if(this.pickedStone != null && obj[0].highlight)
	{
		if(this.roundMove == 'drag')
			this.pickedStone.tile.info = 0;

		this.saveUNDO();

		this.pickedStone.tile = obj[0];
		this.animation = true;
		this.dropStone(obj[0]);
		this.board.resetHighlight();

		if(this.roundMove == 'drop')
			if(this.roundNumber == 1 )
				this.roundMove = 'pass';
			else this.roundMove = 'drag';
		else if(this.roundMove == 'drag')
			this.roundMove = 'pass';

		this.updateScore = true;
		var stringBoard = this.scene.socket.processBoardToString();
		var requestString = "[checkScore," + stringBoard + ",_Result]";
		this.scene.socket.sendRequest(requestString, 'score');
	}
};

Game.prototype.updateGameScore = function(){
	var max = 0;
	if(this.scene.socket.scoreResponse[0][1].length > 0)
	{
		max = Math.max.apply(null, this.scene.socket.scoreResponse[0][1]);
		this.score[0] = max;
	}

	if(this.scene.socket.scoreResponse[1][1].length > 0)
	{
		max = Math.max.apply(null, this.scene.socket.scoreResponse[1][1]);
		this.score[1] = max;
	}

	if(this.scene.socket.scoreResponse[2][1].length > 0)
	{
		max = Math.max.apply(null, this.scene.socket.scoreResponse[2][1]);
		this.score[2] = max;

	}

	if(this.scene.socket.scoreResponse[3][1].length > 0)
	{
		max = Math.max.apply(null, this.scene.socket.scoreResponse[3][1]);
		this.score[3] = max;
	}

	this.updateMarkers();
};


Game.prototype.updateMarkers = function(){
	if(this.score[0] > 9)
			this.scene.scoreBoard.blueMarker.first = 1;
		else this.scene.scoreBoard.blueMarker.first = 0;

		this.scene.scoreBoard.blueMarker.second = this.score[0] % 10;

	if(this.score[1] > 9)
			this.scene.scoreBoard.redMarker.first = 1;
		else this.scene.scoreBoard.redMarker.first = 0;

		this.scene.scoreBoard.redMarker.second = this.score[1] % 10;

	if(this.score[2] > 9)
			this.scene.scoreBoard.greenMarker.first = 1;
		else this.scene.scoreBoard.greenMarker.first = 0;

		this.scene.scoreBoard.greenMarker.second = this.score[2] % 10;

	if(this.score[3] > 9)
			this.scene.scoreBoard.yellowMarker.first = 1;
		else this.scene.scoreBoard.yellowMarker.first = 0;

		this.scene.scoreBoard.yellowMarker.second = this.score[3] % 10;
}



Game.prototype.saveUNDO = function(){
	if(this.roundMove == 'drop')
	{
		this.undoRegister['drop'] = [];
		this.undoRegister['drop']['stone'] = this.pickedStone;
		this.undoRegister['drop']['initialPosition'] = this.pickedStone.position;
		
		this.undoRegister['drop']['score'] = [];
		this.undoRegister['drop']['score'][0] = this.score[0];this.undoRegister['drop']['score'][1] = this.score[1];
		this.undoRegister['drop']['score'][2] = this.score[2];this.undoRegister['drop']['score'][3] = this.score[3];
	}
	else if(this.roundMove == 'drag')
	{
		this.undoRegister['drag'] = [];
		this.undoRegister['drag']['stone'] = this.pickedStone;
		this.undoRegister['drag']['playedStone'] = this.playedStone;
		this.undoRegister['drag']['tile'] = this.pickedStone.tile;
		this.undoRegister['drag']['initialPosition'] = this.pickedStone.position;

		this.undoRegister['drag']['score'] = [];
		this.undoRegister['drag']['score'][0] = this.score[0];this.undoRegister['drag']['score'][1] = this.score[1];
		this.undoRegister['drag']['score'][2] = this.score[2];this.undoRegister['drag']['score'][3] = this.score[3];
	}

};

Game.prototype.processUNDO = function(){
	this.undo = true;


	if(this.roundMove == 'drag' || (this.roundMove == 'pass' && this.roundNumber == 1))
	{
		this.undoRegister['drop']['stone'].tile.info = 0;
		this.undoRegister['drop']['stone'].dropStone(this.undoRegister['drop']['initialPosition']);
		this.playedStone = null;

		this.undoRegister['drop']['stone'].tile = null;
		this.undoRegister['drop']['stone'].standByAnimationHeight = 0;
		this.undoRegister['drop']['stone'].standByAnimationVelocity = 0.17;
		this.animation = true;
		this.pickedStone = this.undoRegister['drop']['stone'];
		this.undoRegister['drop']['stone'].dropStone(this.undoRegister['drop']['initialPosition']);

		this.score[0] = this.undoRegister['drop']['score'][0];this.score[1] = this.undoRegister['drop']['score'][1];
		this.score[2] = this.undoRegister['drop']['score'][2];this.score[3] = this.undoRegister['drop']['score'][3];
	}
	else if(this.roundMove == 'pass'){

		switch(this.undoRegister['drag']['stone'].colorMaterial){
			case 'blueStone':
				this.undoRegister['drag']['tile'].info = 1;
				break;
			case 'redStone':
				this.undoRegister['drag']['tile'].info = 2;
				break;
			case 'greenStone':
				this.undoRegister['drag']['tile'].info = 3;
				break;
			case 'yellowStone':
				this.undoRegister['drag']['tile'].info = 4;
				break;
			default: break;
		}

		this.playedStone = this.undoRegister['drag']['playedStone'];
		this.undoRegister['drag']['stone'].tile.info = 0;
		this.undoRegister['drag']['stone'].tile = this.undoRegister['drag']['tile'];
		this.undoRegister['drag']['stone'].standByAnimationHeight = 0;
		this.undoRegister['drag']['stone'].standByAnimationVelocity = 0.17;
		this.animation = true;
		this.pickedStone = this.undoRegister['drag']['stone'];
		this.undoRegister['drag']['stone'].dropStone(this.undoRegister['drag']['initialPosition']);

		this.score[0] = this.undoRegister['drag']['score'][0];this.score[1] = this.undoRegister['drag']['score'][1];
		this.score[2] = this.undoRegister['drag']['score'][2];this.score[3] = this.undoRegister['drag']['score'][3];
	}



	if(this.roundMove == 'pass')
		{
			if(this.roundNumber == 1)
				this.roundMove = 'drop';
			else this.roundMove = 'drag';
		}
	else if(this.roundMove == 'drag')
		this.roundMove = 'drop';

	this.updateMarkers();

};


Game.prototype.colorAssigned = function(color){
	for(var i = 0; i < this.players.length; i++)
		if(this.players[i][1] == color)
			return true;

	return false;
}


Game.prototype.passTurn = function(){
	if(this.roundMove == 'pass' && this.pickedStone == null)
  		{
  			this.roundNumber++;
			this.roundMove = 'drop';
			this.undoRegister = [];
			this.pickedStone = null;
			this.animation = false;
			this.playedStone = null;
			this.pickedBoardTile = null;	
			this.scene.cameraAnimation.startCameraOrbit(1500, vec3.fromValues(0,1,0), -2*Math.PI/this.players.length);
	 	} 		
}