/**
 * MyBoard
 * @constructor
 */
 function MyBoard(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.board = []
	this.stones = [];  //peças 
	this.validDropPositions = false;
	this.validDragPositions = false;

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
		this.board[y] = [];
		for(var x=1; x<=9; x++) {
			if(y >=5)
				side = 1;
			switch(y){
				case 9:
				case 1:
				if(x <=5){
					this.board[y][x] = new MyBoardTile(this.scene, new Coords((x+1)*2  - 8,0,side*6.8));
				}
				break;
				case 8:
				case 2:
				if(x <=6){
					this.board[y][x] = new MyBoardTile(this.scene, new Coords((x+0.5)*2  - 8,0,side*5.1));
				}
				break;
				case 7:
				case 3:
				if(x <=7){
					this.board[y][x] = new MyBoardTile(this.scene, new Coords((x)*2  - 8,0,side*3.4));
				}
				break;
				case 6:
				case 4:
				if(x <=8){
					this.board[y][x] = new MyBoardTile(this.scene, new Coords((x-0.5)*2  - 8,0,side*1.7));
				}
				break;
				case 5:
				if(x <=9){
					this.board[y][x] = new MyBoardTile(this.scene, new Coords((x-1)*2  - 8,0,side*0));
				}
				break;
				default:
			}
		}
	}
};


MyBoard.prototype.prepareStones = function(){
	var id = 1;
	var radius = 12;
	var angleStep = 2*Math.PI/60;
	var angle = 0;
	for(var i = 0; i < 4; i++)
	{
		for(var j = 0; j < 15; j++)
		{
			var position = new Coords(radius*Math.sin(angle), 0, radius*Math.cos(angle));

			if(i == 0)
				this.stones.push(new MyStone(this.scene, id, 'blueStone', position));
			else if(i == 1)
				this.stones.push(new MyStone(this.scene, id, 'redStone', position));
			else if(i == 2)
				this.stones.push(new MyStone(this.scene, id, 'yellowStone', position));
			else if(i == 3)
				this.stones.push(new MyStone(this.scene, id, 'greenStone', position));

			angle += angleStep;
			id++;
		}
	}
};


MyBoard.prototype.removeStone = function(xPos,yPos) {
	this.boardStones[yPos][xPos]= null;
}


MyBoard.prototype.displayBoard = function(){
	for(var y = 1 ; y <= 9; y++){
		for(var x = 1; x < this.board[y].length;x++){
			this.scene.pushMatrix();
			this.scene.translate(this.board[y][x].position.x,this.board[y][x].position.y,this.board[y][x].position.z);
			if(this.validDropPositions && this.board[y][x].info == 0)
				this.board[y][x].highlight = true;
			else this.board[y][x].highlight = false;
			this.scene.register(this.board[y][x]);
			this.board[y][x].display();
			this.scene.graph.pickID++;
			this.scene.popMatrix();
		}
	}
}


MyBoard.prototype.displayStones = function(){
	for(var i = 0; i < 60; i++)
	{
		this.scene.pushMatrix();
		this.scene.translate(this.stones[i].position.x,this.stones[i].position.y+0.1,this.stones[i].position.z-1.5);
		this.scene.register(this.stones[i]);
		this.stones[i].display();
		this.scene.graph.pickID++;
		this.scene.popMatrix();
	}
}


MyBoard.prototype.display = function(){
	this.displayBoard();
	this.displayStones();
}

MyBoard.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};


