/**
 * MyBoardTile
 * @constructor
 */
function MyBoardTile(scene,position, row, col) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.row = row;
	this.col = col;
	this.topTexture = "topTile";
	this.topTextureHighlight = 'topTileHighlight';
	this.midTexture = "botTile";
	this.botTexture = "botTile";
	this.position = position;
	this.info = 0;
	this.topArgs=[0,1,1,6,6];
	this.midArgs=[0.3,1,1,6,6];
	this.botArgs=[1,1,1,6,6];
	this.highlight = false;
	this.topHexagon = new MyCylinder(this.scene, this.topArgs);
	this.midHexagon = new MyCylinder(this.scene, this.midArgs);
	//this.botHexagon = new MyCylinder(this.scene, this.botArgs);
};

MyBoardTile.prototype = Object.create(CGFobject.prototype);
MyBoardTile.prototype.constructor = MyBoardTile;

MyBoardTile.prototype.display = function(){

	this.scene.pushMatrix();
	this.scene.translate(0,-0.2,0);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.scene.rotate(-Math.PI/2,0,0,1);
	
	this.scene.defaultAppearance.apply();
	if(this.highlight)
		this.scene.graph.textures[this.topTextureHighlight].bind();
	else	
		this.scene.graph.textures[this.topTexture].bind();
	this.scene.pushMatrix();
	this.scene.translate(0,0,0.31);
	this.topHexagon.display();
	this.scene.popMatrix();
	this.scene.graph.textures[this.topTexture].unbind();

	this.scene.graph.textures[this.midTexture].bind();
	this.scene.pushMatrix();
	this.midHexagon.display();
	this.scene.popMatrix();
	this.scene.graph.textures[this.midTexture].unbind();

/*
	this.scene.graph.textures[this.botTexture].bind();
	this.scene.pushMatrix();
	this.scene.translate(0,0,-1);
	this.botHexagon.display();
	this.scene.popMatrix();
	this.scene.graph.textures[this.botTexture].unbind();	
*/
	this.scene.popMatrix();

};

MyBoardTile.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};