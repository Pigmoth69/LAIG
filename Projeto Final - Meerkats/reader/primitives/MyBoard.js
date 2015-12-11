/**
 * MyBoard
 * @constructor
 */
function MyBoard(scene, topTexture,midTexture,botTexture) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.topTexture = topTexture;
	this.midTexture = midTexture;
	this.botTexture = botTexture;
	this.board = [];
	this.tile = new MyBoardTile(scene,topTexture,midTexture,botTexture);
	//this.makeBoard();
};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;


/*MyBoard.prototype.makeBoard = function() {
	for(var i = 0 ; i < 9 ; i ++){
		this.board[i]
	}
};*/


MyBoard.prototype.display = function(){

	var side = -1;
	for(var x = 0 ; x < 2; x++){

		if(side == 1){
			for(var i = 0 ; i < 9; i ++){
			this.scene.pushMatrix();
			this.scene.translate(i*2,0,0);
			this.tile.display();
			this.scene.popMatrix();
		}
		}

		for(var i = 0 ; i < 8; i ++){
			this.scene.pushMatrix();
			this.scene.translate((i+0.5)*2,0,side*1.7);
			this.tile.display();
			this.scene.popMatrix();
		}
		for(var i = 0 ; i < 7; i ++){
			this.scene.pushMatrix();
			this.scene.translate((i+1)*2,0,side*3.4);
			this.tile.display();
			this.scene.popMatrix();
		}
		for(var i = 0 ; i < 6; i ++){
			this.scene.pushMatrix();
			this.scene.translate((i+1.5)*2,0,side*5.1);
			this.tile.display();
			this.scene.popMatrix();
		}
		for(var i = 0 ; i < 5; i ++){
			this.scene.pushMatrix();
			this.scene.translate((i+2)*2,0,side*6.8);
			this.tile.display();
			this.scene.popMatrix();
		}
		side = 1;
	}

	
	
}
/*
MyBoard.prototype.displayShipBody = function(){
this.scene.graph.textures[this.spaceshipTexture].bind();
	this.scene.pushMatrix();
	this.scene.scale(3,3,3);
	this.top.display();
	this.back.display();
	this.scene.popMatrix();
	this.scene.graph.textures[this.spaceshipTexture].unbind();
};


*/



MyBoard.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};

	