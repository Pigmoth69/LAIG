function Game(scene) {
	this.scene = scene;
	this.animation = false;
	this.pickedStone = null;
	this.pickedBoardTile = null;
	this.boardValidPositions = null;
	this.roundMove = 'drop';
	this.roundNumber = 1;
};


Game.prototype = Object.create(Object.prototype);
Game.prototype.constructor = Game;


Game.prototype.display = function(){
	this.scene.drawNode(this.scene.graph.root['Gameplay'], 'null', 'clear');
};

Game.prototype.picking = function(obj){
	var requestString = "";
	var ID = obj[1];
	if(obj[0] instanceof MyStone)
	{
		//se pickedStone ja estiver atribuido a alguma pedra
		if(this.pickedStone != null)
		{
			//se a pickedStone for a mesma que a peça selecionada, elimina-se a seleçao e termina se a execuçao da funcao
			if(this.pickedStone.picked && obj[0].picked) 
			{
				this.pickedStone.standByAnimationHeight = 0;
				this.pickedStone.standByAnimationVelocity = 0.13;
				this.pickedStone.picked = false;
				this.pickedStone = null;

				return;
			}

			//se uma pedra diferente da que esta marcada for seleciona-se, execuçao é trocada para a nova stone
			this.pickedStone.picked = false;
			this.pickedStone = null;
		}
		

		//registando peça selecionada no picking
		{
			obj[0].picked = true;
			this.pickedStone = obj[0];

			if(this.roundMove == 'drop')
			{
				this.scene.graph.leaves['board'].validDropPositions = true;
				this.scene.graph.leaves['board'].validDragPositions = false;
			}
			else
			{
				this.scene.graph.leaves['board'].validDropPositions = false;
				this.scene.graph.leaves['board'].validDragPositions = true;
				var board = this.scene.socket.processBoardToString();
				requestString = "[validDropPositions," + board + ",_Result" + "]";
				if(requestString != "")
					this.scene.socket.sendRequest(requestString, true);
			}
		}
	}
	else if(obj[0] instanceof MyBoardTile)
	{
		if(this.pickedStone != null && obj[0].info == 0)
		{
			this.animation = true;
			this.dropStone(obj[0]);	
		}
	}

	
	//this.cameraAnimation.startCameraOrbit(1500, vec3.fromValues(0,1,0), -2*Math.PI/4);
};

Game.prototype.handler = function(){

	if(this.animation)
	{
		this.pickedStone.movementAnimation();
	}
	else if(this.pickedStone != null)
	{
		if(this.boardValidPositions == null && this.pickedStone.picked)
		{
			if(this.roundMove == 'drag' && this.scene.socket.boardResponse != null)
			{
				this.boardValidPositions = this.scene.socket.boardResponse;
				this.scene.graph.leaves['board'].validDropPositions = false;
				this.scene.graph.leaves['board'].validDragPositions = true;
			}
			else if(this.roundMove == 'drop')
			{
				this.scene.graph.leaves['board'].validDropPositions = true;
				this.scene.graph.leaves['board'].validDragPositions = false;
			}
		}
	}
	else 
	{
		this.scene.graph.leaves['board'].validDropPositions = false;
		this.scene.graph.leaves['board'].validDragPositions = false;
		this.scene.socket.boardResponse = null;
		this.boardValidPositions = null;
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
	this.scene.graph.leaves['board'].validDropPositions = false;
}