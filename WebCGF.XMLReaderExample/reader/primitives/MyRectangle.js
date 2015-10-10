/**
 * MyRectangle
 * @constructor
 */
 function MyRectangle(scene, args) {
 	CGFobject.call(this,scene);
 	

 	this.vertices = [
 		args[0], args[1], 0,	//upper-left
 		args[0], args[3], 0,	//lower-left
 		args[2], args[3], 0,	//lower-right
 		args[2], args[1], 0 	//upper-right
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
 	
 	this.initBuffers();


 	
 	
 };

 MyRectangle.prototype = Object.create(CGFobject.prototype);
 MyRectangle.prototype.constructor = MyRectangle;

 MyRectangle.prototype.initBuffers = function() {
 
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };