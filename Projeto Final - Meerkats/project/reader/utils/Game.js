var ROUND_TIME = 60000;

function Game(scene) {

	this.scene = scene;
	this.players = [];
	this.roundMove = 'drop';
	this.roundNumber = 1;
	this.score = [0, 0, 0, 0];
	this.winner = null;

	this.board = new MyBoard(scene);
	this.scoreBoard = new MyScoreBoard(scene);
	this.movePannel = new MyScreen(scene, 'iluminated', 'drop', false);
	this.timer = new MyMarker(scene, 'iluminated');
	this.timer.first = 6;
	this.timer.second = 0;
	this.roundTime = 0;

	this.stones = [];
	this.remainingStones = [];
	this.prepareStones();

	this.animation = false;
	this.updateScore = false;
	this.validDragPositions = false;

	this.pickedStone = null;
	this.playedStone = null;
	this.pickedBoardTile = null;

	this.undo = false;
	this.undoRegister = [];

	this.currentPlayer = null;
	//vê se é a vez do bot jogar
	this.isBotTurn=false;
	//quando já tem a resposta fica a true para o bot poder jogar
	this.botCanPlay=false;
	this.botCanDrag=false;
	this.moveHasFinished=false;
	this.canPass = false;
};


Game.prototype = Object.create(Object.prototype);
Game.prototype.constructor = Game;


Game.prototype.picking = function(obj){
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

	//se for o bot a jogar, passar a vez dele para o próximo

	if(this.players.length != 0)
		if(this.currentPlayerIsBOT()){
			if(this.roundNumber== 1 && this.canPass==true && this.moveHasFinished == true){
				this.canPass=false;
				this.moveHasFinished = false;
				this.passTurn();
			}else if(this.roundNumber>1 && this.canPass==true  && this.moveHasFinished == true){
				this.canPass=false;
				this.moveHasFinished = false;
				this.passTurn();
			}
		}
		


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
		this.moveHasFinished=false;
		//se não for a primeira ronda fazer o pedido de drag
		//console.log("buscar o draag!1");
		this.makeDropBOT();
		if(this.roundNumber !=1){
		//console.log("buscar o draag!2");
		var board = this.scene.socket.processBoardToString();
		var XplayedStone = this.scene.socket.botResponseDROP[1];
		var YplayedStone = this.scene.socket.botResponseDROP[2];
		var requestString = "[stoneDragBOT,"+ board+",[\""+ XplayedStone +"\"],[\""+YplayedStone+ "\"],_Xinicial,_Yinicial,_Xfinal,_Yfinal]";
		this.scene.socket.sendRequest(requestString, 'botdrag');
	//	console.log("buscar o draag!3");
		}
		this.botCanDrag=true;
	}
	if(this.roundNumber == 1 && this.botCanDrag && this.moveHasFinished==true){
		this.botCanDrag = false;
		this.canPass = true;
	}
	else if(this.botCanDrag && this.scene.socket.botResponseDRAG!= null && this.moveHasFinished==true){
		console.warn("era suposto o movimento acabar!!");
		this.moveHasFinished = false;
		this.botCanDrag=false;
		console.warn("entrei");
		this.makeDragBOT();
		this.canPass=true;
	}


if(this.endGame && this.winner != null && !this.animation)
	{
		var screenTexture = null;
		var screenMaterial = null;

		if(this.winner.length == 0)
		{
			screenTexture = 'draw';
			screenMaterial = 'orange';
		}
		else{
			screenTexture = this.winner[0] + "Won";
			switch(this.winner[1]){
				case 1:
					screenMaterial = 'blueMarker';
					this.animateStones('blueStone');
					break;
				case 2:
					screenMaterial = 'redMarker';
					this.animateStones('redStone');
					break;
				case 3:
					screenMaterial = 'greenMarker';
					this.animateStones('greenStone');
					break;
				case 4:
					screenMaterial = 'yellowMarker';
					this.animateStones('yellowStone');
					break;
				default: break;
			}
		}

		this.scene.stateMachine.endScreen = new MyScreen(this.scene, screenMaterial, screenTexture, true);
		this.scene.stateMachine.currentState = 'EndScreen';
		return;
	}

	//se as rondas do jogo forem superiores a 15, poderá ocorrer uma situação de vitoria
	var groupOf15 = this.score.indexOf(5) + 1;
	if(groupOf15 != 0)
		if((this.colorAssigned(groupOf15) || this.roundNumber == 61) && !this.endGame)
		{
			this.endGame = true;

			var stringBoard = this.scene.socket.processBoardToString();
			var requestString = "[checkWinner," + stringBoard + ",_Result]";
			this.scene.socket.sendRequest(requestString, 'winner');
			return;
		}

	this.updateTimer();

	//recolhe a informaçao relativa a cores sorteadas para cada jogador
	if(this.scene.socket.colorsResponse != null)
		this.generatePlayersList();

	//se o socket contiver informação respetiva ao arrasto de uma peça, o tabuleiro é alterado
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
};



Game.prototype.pickingStone = function(obj){

	//registando peça selecionada no picking dependendo da jogada
	if((this.roundMove == 'drop' && obj[0].settledTile == null) || (this.roundMove == 'drag' && obj[0].settledTile != null && obj[0].id != this.playedStone.id))
	{
		//se pickedStone ja estiver atribuido a alguma pedra
		if(this.pickedStone != null)
		{
			//se a pickedStone for a mesma que a peça selecionada, elimina-se a seleçao e termina se a execuçao da funcao
			if(this.pickedStone.id == obj[0].id)
			{
				this.pickedStone.picked = false;
				this.pickedStone = null;
				this.board.resetHighlight();
				return;
			}
			else
			{
				this.pickedStone.picked = false;
				this.pickedStone = null;
			}
		}
		obj[0].picked = true;
		this.pickedStone = obj[0];

		if(this.roundMove == 'drop')
			this.board.highlightDropPositions();
		else if(this.roundMove == 'drag')
		{
			this.validDragPositions = true;

			var stringBoard = this.scene.socket.processBoardToString();
			var requestString = "[validDragPositions," + this.pickedStone.settledTile.row + ',' + this.pickedStone.settledTile.col + ',' + stringBoard + ",_Result" + "]";
			console.warn(requestString);
			this.scene.socket.sendRequest(requestString, 'board');
		}
	}
};



Game.prototype.pickingTile = function(obj){
	if(this.pickedStone != null && obj[0].highlight)
	{
		if(this.roundMove == 'drag')
			this.pickedStone.settledTile.info = 0;

		this.saveUNDO();
		//guardar na stone o tile onde ela vai ficar
		this.pickedStone.settledTile = obj[0];
		this.animation = true;
		this.moveStone(obj[0]);
		this.board.resetHighlight();

		this.updateScore = true;
		var stringBoard = this.scene.socket.processBoardToString();
		var requestString = "[checkScore," + stringBoard + ",_Result]";
		console.warn(requestString);
		this.scene.socket.sendRequest(requestString, 'score');
	}
};



//updategamescore
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
//updategamemarkers
Game.prototype.updateMarkers = function(){
    if(this.score[0] > 9)
            this.scoreBoard.blueMarker.first = 1;
        else this.scoreBoard.blueMarker.first = 0;

        this.scoreBoard.blueMarker.second = this.score[0] % 10;

    if(this.score[1] > 9)
            this.scoreBoard.redMarker.first = 1;
        else this.scoreBoard.redMarker.first = 0;

        this.scoreBoard.redMarker.second = this.score[1] % 10;

    if(this.score[2] > 9)
            this.scoreBoard.greenMarker.first = 1;
        else this.scoreBoard.greenMarker.first = 0;

        this.scoreBoard.greenMarker.second = this.score[2] % 10;

    if(this.score[3] > 9)
            this.scoreBoard.yellowMarker.first = 1;
        else this.scoreBoard.yellowMarker.first = 0;

        this.scoreBoard.yellowMarker.second = this.score[3] % 10;
};


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
		this.undoRegister['drag']['tile'] = this.pickedStone.settledTile;
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
		this.undoRegister['drop']['stone'].settledTile.info = 0;
		this.undoRegister['drop']['stone'].settledTile = null;
		this.playedStone = null;
		this.pickedStone = this.undoRegister['drop']['stone'];
		this.animation = true;
		this.undoRegister['drop']['stone'].moveStone(this.undoRegister['drop']['initialPosition']);

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
		this.undoRegister['drag']['stone'].settledTile.info = 0;
		this.undoRegister['drag']['stone'].settledTile = this.undoRegister['drag']['tile'];
		this.undoRegister['drag']['stone'].standByAnimationHeight = 0;
		this.undoRegister['drag']['stone'].standByAnimationVelocity = 0.17;
		this.animation = true;
		this.pickedStone = this.undoRegister['drag']['stone'];
		this.undoRegister['drag']['stone'].moveStone(this.undoRegister['drag']['initialPosition']);

		this.score[0] = this.undoRegister['drag']['score'][0];this.score[1] = this.undoRegister['drag']['score'][1];
		this.score[2] = this.undoRegister['drag']['score'][2];this.score[3] = this.undoRegister['drag']['score'][3];
	}

	this.updateMarkers();
};


Game.prototype.passTurn = function(){
	if(this.roundMove == 'pass' && this.animation == false)
	{
		console.log("passa de ronda!");
  		this.scene.socket.botResponseDROP = null;
		this.scene.socket.botResponseDRAG = null;
  		this.roundNumber++;
		this.roundMove = 'drop';
		this.roundTime = this.scene.milliseconds + ROUND_TIME;
		this.movePannel.texture = this.roundMove;
		this.undoRegister = [];
		if(this.pickedStone != null)
			this.pickedStone.picked = false;
		this.board.resetHighlight();
		this.pickedStone = null;
		this.playedStone = null;
		this.pickedBoardTile = null;

		var playerIndex = (this.roundNumber - 1) % this.players.length;
		this.currentPlayer.texture = this.players[playerIndex][0];

		this.scene.cameraAnimation.startCameraOrbit(1000, vec3.fromValues(0,1,0), -2*Math.PI/this.players.length);

		if(this.currentPlayerIsBOT())
			this.isBotTurn=true;
 	} 		
};





  //////////////////////////////////////////////////
 //////			FUNCTION 100% CHECKED		///////
//////////////////////////////////////////////////


Game.prototype.display = function(){

	if(this.scene.stateMachine.currentState == 'Gameplay')
	{
		this.scene.pushMatrix();
		this.scene.translate(-4.5,-2.5,-10);
		this.scene.rotate(Math.PI/6, 0, 1, 0);
		//this.scene.rotate(Math.PI/30, 0, 0, 1);
		this.scene.scale(0.6, 0.6, 0.6);
		this.timer.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-2.5,2.5,-10);
		this.scene.rotate(Math.PI/6, 0, 1, 0);
		this.scene.rotate(Math.PI/30, 0, 0, 1);
		this.scene.scale(0.4, 0.4, 0.4);
		this.scoreBoard.display();
		this.scene.popMatrix();

		if(this.currentPlayer instanceof MyScreen)
		{this.scene.pushMatrix();
		this.scene.translate(4,2.5,-10);
		this.scene.scale(2, 1, 1);
		this.currentPlayer.display();
		this.scene.popMatrix();}

		this.scene.pushMatrix();
		this.scene.translate(4,-2.5,-10);
		this.scene.scale(2, 1, 1);
		this.movePannel.display();
		this.scene.popMatrix();
	}	
	this.scene.pushMatrix();
	this.scene.applyViewMatrix();
	this.board.display();
	this.displayStones();
	this.scene.popMatrix();
};



Game.prototype.saveWinner = function(color){

	this.winner = [];
	for(var i = 0; i < this.players.length; i++)
		if(this.players[i][1] == color){
			this.winner = this.players[i];
			return;
		}
}


Game.prototype.prepareStones = function(){
	var id = 1;
	var radius = 12;
	var angleStep = 2*Math.PI/60;
	var angle = 0;
	for(var i = 0; i < 4; i++)
	{
		for(var j = 0; j < 15; j++)
		{
			var position = new Coords(radius*Math.sin(angle), 0, radius*Math.cos(angle));

			if(i == 0){
				this.stones.push(new MyStone(this.scene, id, 'blueStone', position));
				this.remainingStones.push(id);
			}
			else if(i == 1){
				this.stones.push(new MyStone(this.scene, id, 'redStone', position));
				this.remainingStones.push(id);
			}		
			else if(i == 2){
				this.stones.push(new MyStone(this.scene, id, 'yellowStone', position));
				this.remainingStones.push(id);
			}
			else if(i == 3){
				this.stones.push(new MyStone(this.scene, id, 'greenStone', position));
				this.remainingStones.push(id);
			}

			angle += angleStep;
			id++;
		}
	}
};


Game.prototype.displayStones = function(){
	for(var i = 0; i < this.stones.length; i++)
	{
		this.scene.pushMatrix();
		this.scene.translate(this.stones[i].position.x,this.stones[i].position.y+0.2,this.stones[i].position.z);
		this.scene.register(this.stones[i]);
		this.stones[i].display();
		this.scene.graph.pickID++;
		this.scene.popMatrix();
	}
};




Game.prototype.colorAssigned = function(color){
	for(var i = 0; i < this.players.length; i++)
		if(this.players[i][1] == color)
			return true;

	return false;
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

	this.currentPlayer = new MyScreen(this.scene, 'iluminated', 'Player1', false);
	//caso seja logo 1 bot a jogar!!
	if(this.currentPlayerIsBOT())
		this.isBotTurn=true;
};


Game.prototype.moveStone = function(tile){

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

	this.pickedStone.picked = false;
	this.pickedStone.moveStone(tile.position, 'forward');
};


Game.prototype.nextMove = function(stone){
	if(this.roundNumber == 1)
	{
		this.playedStone = stone;
		this.roundMove = 'pass';
		console.log(stone);
	}
	else if(this.roundMove == 'drop')
	{
		this.playedStone = stone;
		this.roundMove = 'drag';
		console.log(stone);
	}
	else this.roundMove = 'pass';

	this.movePannel.texture = this.roundMove;
};


Game.prototype.previousMove = function(stone){
	if(this.roundNumber == 1)
		this.roundMove = 'drop';
	else if(this.roundMove == 'drag')
		this.roundMove = 'drop';
	else if(this.roundMove == 'pass')
		this.roundMove = 'drag';

	this.undo = false;
	this.pickedStone = null;

	this.movePannel.texture = this.roundMove;
};


Game.prototype.updateTimer = function(){

	var time = Math.floor((this.roundTime - this.scene.milliseconds) / 1000);
	this.timer.first = Math.floor(time/10);
	this.timer.second = time % 10;

	if(this.timer.first == 0 && this.timer.second == 0)
		{
			this.roundMove = 'pass';
			this.animation = false;
			this.passTurn();
		}
};


Game.prototype.animateStones = function(material){
	for(var i = 0; i < this.stones.length; i++)
		if(this.stones[i].colorMaterial == material)
			this.stones[i].picked = true;
};



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



Game.prototype.makeDragBOT = function(){
	var response = this.scene.socket.botResponseDRAG;

	var Xinicial = response[0];
	var Yinicial = response[1];
	var Xfinal = response[2];
	var Yfinal = response[3];
	//pedra que se vai mover
	var movingStone = this.getRegistedStoneFromPos(Xinicial,Yinicial);
	var tileToMove = this.board.getRegistedBoard(Xfinal,Yfinal);

	var cena = this;

	cena.pickingStone(movingStone);
	//cena.pickingTile(tileToMove);
	setTimeout(function(){ 
		//coloca a peça selecionada pelo bot na posição por ele definida passado 1 segundo
   		cena.pickingTile(tileToMove);
		},500);
}

Game.prototype.makeDropBOT = function(){
	var response = this.scene.socket.botResponseDROP;

	//resultados da resposta do prolog que vem num array deste genero [2,5,6]
	var stoneID = response[0];
	var Xpos = response[1];
	var Ypos = response[2];
	//funções responsáveis por irem buscar os obj para enviar ao picking
	var stone = this.getRegistedStone(stoneID);
	var position = this.board.getRegistedBoard(Xpos,Ypos);

	var cena = this;
	//vai fazer o picking e a animação da pedra selecionada pelo bot

	cena.pickingStone(stone);
	// cena.pickingTile(position);
	setTimeout(function(){ 
		//coloca a peça selecionada pelo bot na posição por ele definida passado 1 segundo
   		cena.pickingTile(position);
		},500);
	this.updateStones(stoneID);
}

/*Vê se o jogador atual é um bot! Se for retorna true senão retorna false*/

Game.prototype.currentPlayerIsBOT = function(){
	var playerIndex = (this.roundNumber - 1) % this.players.length;
	var res = (this.players[playerIndex][0]).search("Bot");
	if(res == -1)
		return false;
	else
		return true;
}



Game.prototype.getRegistedStone = function(stoneID){
	for(var i = 0 ; i < this.stones.length;i++){
		if(this.stones[i].id == stoneID)
			return [this.stones[i],this.stones[i].id];
	}
}

Game.prototype.updateStones = function(stoneID){
	this.removeRemainingStones(stoneID);
}


Game.prototype.removeRemainingStones = function(stoneID){
	var index = this.remainingStones.indexOf(stoneID);
	if(index > -1)
		this.remainingStones.splice(index,1);
}

//função que através das coordenadas X, Y vao buscar a pedra que se encontra na posição X Y do tabuleiro
Game.prototype.getRegistedStoneFromPos = function(Xpos,Ypos){
	for(var i = 0 ; i < this.stones.length;i++){
		if(this.stones[i].settledTile!=null){
			if(this.board.board[Xpos][Ypos].id == this.stones[i].settledTile.id){
				var stone = this.getRegistedStone(this.stones[i].id);
				return stone;
			}
		}
	}
}