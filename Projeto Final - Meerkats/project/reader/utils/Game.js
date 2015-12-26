function Game(scene) {
	this.board = new MyBoard(scene);


	this.scene = scene;
	this.players = [];
	this.animation = false;
	this.pickedStone = null;
	this.playedStone = null;
	this.pickedBoardTile = null;
	this.roundMove = 'drop';
	this.roundNumber = 1;
};


Game.prototype = Object.create(Object.prototype);
Game.prototype.constructor = Game;


Game.prototype.display = function(){
	this.board.display();
	//this.scene.drawNode(this.scene.graph.root['Gameplay'], 'null', 'clear');
};

Game.prototype.picking = function(obj){
	var ID = obj[1];
	if(obj[0] instanceof MyStone)
	{
		this.pickingStone(obj);
	}
	else if(obj[0] instanceof MyBoardTile)
	{
		this.pickingTile(obj);
	}

};

Game.prototype.handler = function(){
	if(this.validDragPositions && this.scene.socket.boardResponse != null)
	{
		this.board.highlightDragPositions(this.scene.socket.boardResponse);
		this.validDragPositions = false;
		this.scene.socket.boardResponse = null;
	}

	if(this.animation)
	{
		this.pickedStone.movementAnimation();
	}

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
	this.pickedStone.standByAnimationVelocity = 0.13;
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
			this.pickedStone.standByAnimationVelocity = 0.13;
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
	if((this.roundMove == 'drop' && obj[0].tile == null) || (this.roundMove == 'drag' && obj[0].tile != null && obj[0].id != this.playedStoneID))
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
	if(this.pickedStone != null && obj[0].info == 0 && obj[0].highlight)
	{
		if(this.roundMove == 'drag')
			this.pickedStone.tile.info = 0;

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
	}
};