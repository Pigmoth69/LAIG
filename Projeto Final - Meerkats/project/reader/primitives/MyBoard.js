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
 	
 	this.boardTiles=[];
	this.boardPos = []; 	//posições onde se colocam as peças no board
	this.boardStones = [];  //peças 
	this.makeBoard();
	this.makeBoardTiles(scene,tileTopTexture,tileMidTexture,tileBotTexture);
};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

/*
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
		this.boardPos[y] = [];
		this.boardStones[y]=[];
		for(var x=1; x<=9; x++) {
			if(y >=5)
				side = 1;

			switch(y){
				case 9:
				case 1:
				if(x <=5){
					this.boardPos[y][x] = new Coords((x+1)*2,0,side*6.8);
					this.boardStones[y][x] = null;
				}
				break;
				case 8:
				case 2:
				if(x <=6){
					this.boardPos[y][x] = new Coords((x+0.5)*2,0,side*5.1);
					this.boardStones[y][x] = null;
				}
				break;
				case 7:
				case 3:
				if(x <=7){
					this.boardPos[y][x] = new Coords((x)*2,0,side*3.4);
					this.boardStones[y][x] = null;
				}
				break;
				case 6:
				case 4:
				if(x <=8){
					this.boardPos[y][x] = new Coords((x-0.5)*2,0,side*1.7);
					this.boardStones[y][x] = null;
				}
				break;
				case 5:
				if(x <=9){
					this.boardPos[y][x] = new Coords((x-1)*2,0,side*0);
					this.boardStones[y][x] = null;
				}
				break;
				default:
			}
		}
	}
};

MyBoard.prototype.makeBoardTiles = function(scene,top,mid,bot) {
	for(var i = 1 ; i <= 61; i++){
		this.boardTiles[i] = new MyBoardTile(scene,top,mid,bot);
	}
}

MyBoard.prototype.playStone = function(id,color) {
	var tile = 1;

	for(var y = 1 ; y <=9; y++){
		for(var x = 1; x < this.boardPos[y].length;x++){
			if(tile == id)
			{
				switch(color){
					case 1:
					this.boardStones[y][x] = this.stone1;
					break;
					case 2:
					this.boardStones[y][x] = this.stone2;
					break;
					case 3:
					this.boardStones[y][x] = this.stone3;
					break;
					case 4:
					this.boardStones[y][x] = this.stone4;
					break;
					default:
				}
				return;
			}
			tile++;
		}

	}
}

MyBoard.prototype.removeStone = function(xPos,yPos) {
	this.boardStones[yPos][xPos]= null;
}

MyBoard.prototype.displayBoard = function(){
	var tile = 1;
	for(var y = 1 ; y <= 9; y++){
		for(var x = 1; x < this.boardPos[y].length;x++){
			this.scene.registerForPick(this.scene.graph.pickID,this.boardTiles[tile]);
			this.scene.pushMatrix();
			this.scene.translate(this.boardPos[y][x].x,this.boardPos[y][x].y,this.boardPos[y][x].z),
			this.boardTiles[tile].display();
			this.scene.graph.pickID++;
			tile++;
			this.scene.popMatrix();
		}
	}
}


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


MyBoard.prototype.display = function(){
	this.displayBoard();
	this.displayStones();
}

MyBoard.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};


