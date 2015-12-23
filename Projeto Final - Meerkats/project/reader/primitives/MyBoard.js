/**
 * MyBoard
 * @constructor
 */
 function MyBoard(scene,tileTopTexture,tileMidTexture,tileBotTexture,stone1Texture,stone2Texture,stone3Texture,stone4Texture) {
 	CGFobject.call(this,scene);
 	this.scene = scene;

 	this.blueStone = new MyStone(this.scene, stone1Texture);
 	this.redStone = new MyStone(this.scene, stone2Texture);
 	this.greenStone = new MyStone(this.scene, stone3Texture);
 	this.yellowStone = new MyStone(this.scene, stone4Texture);
	this.tile = new MyBoardTile(scene,tileTopTexture,tileMidTexture,tileBotTexture);
 	
 	this.tiles = [];
	this.boardPositions = []; 	//posições onde se colocam as peças no board
	this.stones = [];  //peças 

	this.makeBoard();
	this.prepareStones();
};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

/**
	Função responsável pela inicialização das posições do tabuleiro. Esta posições acedem-se da mesma forma que que no prolog.
	[
		            [empty, empty, empty, empty, empty],
		         [empty, empty, empty, empty, empty, empty],
		      [empty, empty, empty, empty, empty, empty, empty],
		   [empty, empty, empty, empty, empty, empty, empty, empty],
		[empty, empty, empty, empty, empty, empty, empty, empty, empty],
		   [empty, empty, empty, empty, empty, empty, empty, empty],
		      [empty, empty, empty, empty, empty, empty, empty],
		         [empty, empty, empty, empty, empty, empty],
		            [empty, empty, empty, empty, empty]
	]
*/
MyBoard.prototype.makeBoard = function() {
	var side = -1;
	for(var y=1; y<=9; y++) {
		this.boardPositions[y] = [];
		this.stones[y]=[];
		for(var x=1; x<=9; x++) {
			if(y >=5)
				side = 1;

			switch(y){
				case 9:
				case 1:
				if(x <=5){
					this.boardPositions[y][x] = new Coords((x+1)*2,0,side*6.8);
					this.stones[y][x] = null;
				}
				break;
				case 8:
				case 2:
				if(x <=6){
					this.boardPositions[y][x] = new Coords((x+0.5)*2,0,side*5.1);
					this.stones[y][x] = null;
				}
				break;
				case 7:
				case 3:
				if(x <=7){
					this.boardPositions[y][x] = new Coords((x)*2,0,side*3.4);
					this.stones[y][x] = null;
				}
				break;
				case 6:
				case 4:
				if(x <=8){
					this.boardPositions[y][x] = new Coords((x-0.5)*2,0,side*1.7);
					this.stones[y][x] = null;
				}
				break;
				case 5:
				if(x <=9){
					this.boardPositions[y][x] = new Coords((x-1)*2,0,side*0);
					this.stones[y][x] = null;
				}
				break;
				default:
			}
		}
	}
};


MyBoard.prototype.prepareStones = function(){
	for(var i = 0; i < 4; i++)
	{
		for(var j = 0; j < 15; j++)
		{
			if(i == 1)
				this.stones.push(this.blueStone);
			else if(i == 2)
				this.stones.push(this.redStone);
			else if(i == 3)
				this.stones.push(this.greenStone);
			else if(i == 4)
				this.stones.push(this.yellowStone);
		}
	}
};


MyBoard.prototype.removeStone = function(xPos,yPos) {
	this.boardStones[yPos][xPos]= null;
}


MyBoard.prototype.displayBoard = function(){
	for(var y = 1 ; y <= 9; y++){
		for(var x = 1; x < this.boardPositions[y].length;x++){
			this.scene.registerForPick(this.scene.graph.pickID,this.tile);
			this.scene.pushMatrix();
			this.scene.translate(this.boardPositions[y][x].x,this.boardPositions[y][x].y,this.boardPositions[y][x].z),
			this.tile.display();
			this.scene.graph.pickID++;
			this.scene.popMatrix();
		}
	}
}

/*
MyBoard.prototype.displayStones = function(){
	var stone = 1;
	for(var y = 1 ; y <=9; y++){
		for(var x = 1; x < this.boardStones[y].length;x++){
			if(this.boardStones[y][x] instanceof MyStone){

				this.scene.pushMatrix();
				this.scene.translate(this.boardPos[y][x].x,this.boardPos[y][x].y,this.boardPos[y][x].z);
				if(this.scene.pickMode==false)
				this.boardStones[y][x].display();
				stone++;
				this.scene.popMatrix();
			}
		}
	}
}
*/

MyBoard.prototype.display = function(){
	this.displayBoard();
	//this.displayStones();
}

MyBoard.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};


