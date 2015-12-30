function Game(scene) {
	this.board = new MyBoard(scene);


	this.scene = scene;
	this.players = [];
	this.roundMove = 'drop';
	this.roundNumber = 1;
	this.score = [0, 0, 0, 0];
	this.winner = null;

	this.animation = false;
	this.updateScore = false;
	this.validDragPositions = false;

	this.pickedStone = null;

	this.playedStone = null;

	this.pickedBoardTile = null;

	this.undo = false;
	this.undoRegister = [];

	this.currentPlayer = 1;
	//vê se é a vez do bot jogar
	this.isBotTurn=false;
	//quando já tem a resposta fica a true para o bot poder jogar
	this.botCanPlay=false;
	this.botCanDrag=false;
};


Game.prototype = Object.create(Object.prototype);
Game.prototype.constructor = Game;


Game.prototype.display = function(){
	this.board.display();
	//this.scene.drawNode(this.scene.graph.root['Gameplay'], 'null', 'clear');
};
Game.prototype.picking = function(obj){
	console.warn(obj);
		if(!this.currentPlayerIsBOT()){
			if(obj[0] instanceof MyStone)
				this.pickingStone(obj);
			else if(obj[0] instanceof MyBoardTile)
				this.pickingTile(obj);
		}

	};



/** Controla as principais açoes durante a excuçao do jogo
 *
 */
Game.prototype.handler = function(){


	//caso seja um bot a jogar, é preciso ir fazer um pedido ao prolgo para saber onde se vai jogar
	if(this.isBotTurn && this.scene.socket.botResponseDROP == null) {
		this.isBotTurn=false;
		//fazer o pedido ao prolog para que o bot possa ter a resposta para  -->DROP
		var board = this.scene.socket.processBoardToString();
		var remainingStones =  this.scene.socket.processRemainingStonesToString();
		var requestString = "[stoneDropBOT,"+ board+","+ remainingStones + ",_IDstone,_Xpos,_Ypos]";
		this.scene.socket.sendRequest(requestString, 'botdrop');
		this.botCanPlay=true;
		//fazer o pedido ao prolog para que o bot possa ter a resposta para  -->DRAG

	}
	if(this.botCanPlay && this.scene.socket.botResponseDROP != null){
		this.botCanPlay=false;
		//se não for a primeira ronda fazer o pedido de drag
		if(this.roundNumber !=1){
		var board = this.scene.socket.processBoardToString();
		var XplayedStone = this.scene.socket.botResponseDROP[1];
		var YplayedStone = this.scene.socket.botResponseDROP[2];
		var requestString = "[stoneDragBOT,"+ board+",[\""+ XplayedStone +"\"],[\""+YplayedStone+ "\"],_Xinicial,_Yinicial,_Xfinal,_Yfinal]";
		this.scene.socket.sendRequest(requestString, 'botdrag');
		}
		this.botCanDrag=true;
	}
	if(this.botCanDrag && this.scene.socket.botResponseDRAG!= null){
		this.botCanDrag=false;
		this.makePlayBOT();
	}


	if(this.endGame && this.winner != null)
	{
		this.scene.stateMachine.currentState = 'EndScreen';
		var endScreenTexture = 'draw';

		switch(this.winner)
		{
			case 1: 
				endScreenTexture = 'blueWon';
				break;
			case 2:
				endScreenTexture = 'redWon';
				break;
			case 3:
				endScreenTexture = 'greenWon';
				break;
			case 4:
				endScreenTexture = 'yellowWon';
				break;
			default: break;
		}

		this.scene.stateMachine.endScreen = new MyScreen(this.scene, endScreenTexture);
		winner = null;
	}

	//recolhe a informaçao relativa a cores sorteadas para cada jogador
	if(this.scene.socket.colorsResponse != null){
		this.generatePlayersList();
		this.currentPlayer = 1;
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
	if(this.roundNumber >= 3 && this.roundNumber <= 60){

		//primeira condiçao de vitoria: um grupo de cores tiver dimensao de 15
		var groupOf15 = this.score.indexOf(3);
		if(groupOf15 != -1 && this.colorAssigned(groupOf15 + 1))
		{
			console.log('alguem ganhou');
			this.roundNumber = 61;
		}
	}
	
	if(this.roundNumber == 61 && !this.endGame && !this.animation)
	{
		var stringBoard = this.scene.socket.processBoardToString();
		var requestString = "[checkWinner," + stringBoard + ",_Result]";
		this.scene.socket.sendRequest(requestString, 'winner');
		this.endGame = true;
	}
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

	//caso seja logo 1 bot a jogar!!
	if(this.currentPlayerIsBOT())
		this.isBotTurn=true;
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
		{console.log("selecionada");
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
			console.warn(requestString);
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
		//guardar na stone o tile onde ela vai ficar
		this.pickedStone.settledTile = obj;
		this.animation = true;
		this.dropStone(obj[0]);
		console.warn("pick");
		console.warn(obj);
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
		console.warn(requestString);
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
	//console.warn(this.board.boardRegisterID);
	//console.warn(this.board.stonesRegisterID);


	/*var res = this.board.getRegistedStone(60);
	var res2 = this.board.getRegistedBoard(1,3);
	var t = this.scene.stateMachine;
	var e = this;
	this.pickingStone(res);

	setTimeout(function(){  //Beginning of code that should run AFTER the timeout
   		e.pickingTile(res2);
    	//lots more code
		},5000);*/
	
	

	/* Pedido de DROPSTONE
	var board = this.scene.socket.processBoardToString();
	var remainingStones =  this.scene.socket.processRemainingStonesToString();
	var requestString = "[stoneDropBOT,"+ board+","+ remainingStones + ",_IDstone,_Xpos,_Ypos]";
	console.warn(requestString);
	this.scene.socket.sendRequest(requestString, 'bot');
	*/

			//pedido dragstone
		/*var board = this.scene.socket.processBoardToString();
		var XplayedStone = 2;
		var YplayedStone = 4;
		var requestString = "[stoneDragBOT,"+ board+",[\""+ XplayedStone +"\"],[\""+YplayedStone+ "\"],_Xinicial,_Yinicial,_Xfinal,_Yfinal]";
		console.warn(requestString);
		this.scene.socket.sendRequest(requestString, 'botdrag');*/






	if(this.roundMove == 'pass' && this.pickedStone == null)
  		{
  			console.log("passa de ronda!");
  			this.roundNumber++;
  			this.nextPlayer();
			this.roundMove = 'drop';
			this.undoRegister = [];
			this.pickedStone = null;
			this.animation = false;
			this.playedStone = null;
			this.pickedBoardTile = null;	
			//this.scene.cameraAnimation.startCameraOrbit(1500, vec3.fromValues(0,1,0), -2*Math.PI/this.players.length);
			// o erro está aqui. Enquanto a câmara estiver a orbitar não rodar isto. E também por causa de ainda não ter acabado a animação de meter a peça no sitio.
			if(this.currentPlayerIsBOT())
				this.isBotTurn=true;
	 	} 		
}
Game.prototype.makePlayBOT = function(){
	//se é a primeira jogada faz uma merda
	if(this.roundNumber == 1){
		this.makeDropBOT();
		this.passTurn();
	}
	else{
		this.makeDropBOT();
		this.makeDragBOT();
		this.passTurn();
	}

	//no final fazer reset das respostas
	this.scene.socket.botResponseDROP = null;
	this.scene.socket.botResponseDRAG = null;
}

Game.prototype.makeDragBOT = function(){
	var response = this.scene.socket.botResponseDRAG;

	var Xinicial = response[0];
	var Yinicial = response[1];
	var Xfinal = response[2];
	var Yfinal = response[3];

	//pedra que se vai mover
	var movingStone = this.board.getRegistedStoneFromPos(Xinicial,Yinicial);
	var tileToMove = this.board.getRegistedBoard(Xfinal,Yfinal);

	var cena = this;

	cena.pickingStone(movingStone);
	setTimeout(function(){ 
		//coloca a peça selecionada pelo bot na posição por ele definida passado 1 segundo
   		cena.pickingTile(tileToMove);
		},1000);
}

Game.prototype.makeDropBOT = function(){
	var response = this.scene.socket.botResponseDROP;

	//resultados da resposta do prolog que vem num array deste genero [2,5,6]
	var stoneID = response[0];
	var Xpos = response[1];
	var Ypos = response[2];

	//funções responsáveis por irem buscar os obj para enviar ao picking
	var stone = this.board.getRegistedStone(stoneID);
	var position = this.board.getRegistedBoard(Xpos,Ypos);

	var cena = this;
	//vai fazer o picking e a animação da pedra selecionada pelo bot

	cena.pickingStone(stone);
	setTimeout(function(){ 
		//coloca a peça selecionada pelo bot na posição por ele definida passado 1 segundo
   		cena.pickingTile(position);
		},1000);
	this.board.updateStones(stoneID);
}

Game.prototype.nextPlayer = function(){
	if(this.currentPlayer +1 > this.players.length)
		this.currentPlayer=1;
	else
		this.currentPlayer++;
}
/*Vê se o jogador atual é um bot! Se for retorna true senão retorna false*/

Game.prototype.currentPlayerIsBOT = function(){
	var res = (this.players[this.currentPlayer-1][0]).search("Bot");
	if(res == -1)
		return false;
	else
		return true;
}