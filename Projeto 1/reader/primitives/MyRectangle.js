/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, args) {
	CGFobject.call(this,scene);
	
	this.x1 = args[0];
    this.y1 = args[1];
    
    this.x2 = args[2];
    this.y2 = args[3];

	
	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {

	this.vertices = [
 		this.x1, this.y2, 0,
    	this.x2, this.y2, 0,
    	this.x2, this.y1, 0,
    	this.x1, this.y1, 0
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

	 this.nonScaledTexCoords = [
    	0, this.y1-this.y2,
    	this.x2-this.x1, this.y1-this.y2,
    	this.x2-this.x1, 0,
    	0, 0
    ];

	this.texCoords = this.nonScaledTexCoords.slice(0);
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.updateTextCoords = function(ampS,ampT){

	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.nonScaledTexCoords[i] / ampS;
		this.texCoords[i + 1] = this.nonScaledTexCoords[i+1] / ampT;
	}

	this.updateTexCoordsGLBuffers();
};