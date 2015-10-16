/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, args) {
	CGFobject.call(this,scene);
	
	this.args = args;

	this.vertices = [];
	
	this.indices = [];
	
	this.normals = [];

	this.texCoords = [];
	
	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {

	this.vertices = [
	this.args[0], this.args[1], 0,	//upper-left
	this.args[0], this.args[3], 0,	//lower-left
	this.args[2], this.args[3], 0,	//lower-right
	this.args[2], this.args[1], 0 	//upper-right
	];

	this.indices = [
	0, 1, 2,
	0, 2, 3
	];

	this.normals = [
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1
	];

	this.texCoords = [
	0, 0,
	0, 1,
	1, 1,
	1, 0
	];


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.updateTextCoords = function(ampS,ampT){

	this.texCoords=[
		0,0,
		0,1/ampT,
		1/ampS,1/ampT,
		1/ampS,0
	];

	//console.log(this.texCoords);
	this.updateTexCoordsGLBuffers();
};