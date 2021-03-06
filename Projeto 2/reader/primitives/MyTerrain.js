/**
 * MyTerrain
 * @constructor
 */
function MyTerrain(scene,texture,heightmap, normScale) {
	CGFobject.call(this,scene);
	this.texture = texture;
	this.heightmap = heightmap;
	this.normScale = normScale;
	this.plane = new MyPlane(scene, 128, 128);
};

MyTerrain.prototype = Object.create(CGFobject.prototype);
MyTerrain.prototype.constructor = MyTerrain;

MyTerrain.prototype.display = function(){
	this.plane.display();
}

MyTerrain.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};