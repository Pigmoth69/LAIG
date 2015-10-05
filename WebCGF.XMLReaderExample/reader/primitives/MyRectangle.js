/**
 * MyRectangle
 * @constructor
 */
 function MyRectangle(scene, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);

    this.minS = minS||0;
 	this.maxS = maxS||1;
 	this.minT = minT||0;
 	this.maxT = maxT||1;
 		
 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];

 	this.initBuffers();


 	
 	
 };

 MyRectangle.prototype = Object.create(CGFobject.prototype);
 MyRectangle.prototype.constructor = MyRectangle;

 MyRectangle.prototype.initBuffers = function() {
 

 	this.texCoords = [
      this.minS,this.maxT,
      this.maxS,this.maxT,
      this.minS,this.minT,
      this.maxS,this.minT
	];


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };