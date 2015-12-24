/**
 * MyBoard
 * @constructor
 */
 function MyBoard(scene,tileTopTexture,tileMidTexture,tileBotTexture,stone1Texture,stone2Texture,stone3Texture,stone4Texture) {
 	CGFobject.call(this,scene);
 	this.scene = scene;

	this.tile = new MyBoardTile(scene,tileTopTexture,tileMidTexture,tileBotTexture);

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
		for(var x=1; x<=9; x++) {
			if(y >=5)
				side = 1;

			switch(y){
				case 9:
				case 1:
				if(x <=5){
					this.boardPositions[y][x] = new Coords((x+1)*2  - 8,0,side*6.8);
				}
				break;
				case 8:
				case 2:
				if(x <=6){
					this.boardPositions[y][x] = new Coords((x+0.5)*2  - 8,0,side*5.1);
				}
				break;
				case 7:
				case 3:
				if(x <=7){
					this.boardPositions[y][x] = new Coords((x)*2  - 8,0,side*3.4);
				}
				break;
				case 6:
				case 4:
				if(x <=8){
					this.boardPositions[y][x] = new Coords((x-0.5)*2  - 8,0,side*1.7);
				}
				break;
				case 5:
				if(x <=9){
					this.boardPositions[y][x] = new Coords((x-1)*2  - 8,0,side*0);
				}
				break;
				default:
			}
		}
	}
};


MyBoard.prototype.prepareStones = function(){
	var radius = 12;
	var angleStep = 2*Math.PI/60;
	var angle = 0;
	for(var i = 0; i < 4; i++)
	{
		for(var j = 0; j < 15; j++)
		{
			var position = new Coords(radius*Math.sin(angle), 0, radius*Math.cos(angle) - 1.5);

			if(i == 0)
				this.stones.push(new MyStone(this.scene, 'blueStone', position));
			else if(i == 1)
				this.stones.push(new MyStone(this.scene, 'redStone', position));
			else if(i == 2)
				this.stones.push(new MyStone(this.scene, 'yellowStone', position));
			else if(i == 3)
				this.stones.push(new MyStone(this.scene, 'greenStone', position));

			angle += angleStep;
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


MyBoard.prototype.displayStones = function(){
	for(var i = 0; i < 60; i++)
	{
		this.scene.pushMatrix();
		this.scene.translate(this.stones[i].position.x,this.stones[i].position.y,this.stones[i].position.z);
		this.stones[i].display();
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


