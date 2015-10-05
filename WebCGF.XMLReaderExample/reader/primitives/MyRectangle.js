/**
 * MyRectangle
 * @constructor
 */
 function MyRectangle(scene, args) {
 	CGFobject.call(this,scene);
 		
 	console.log(args);

 	this.vertices = [
 		args[0], args[1], 0,
 		args[1], args[2], 0,
 		args[2], args[3], 0,
 		args[0], args[3], 0
 	];
 	
 	this.indices = [
		0, 3, 1,
		1, 3, 2
 	];
 	
 	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
 	];
	
	this.texCoords = [
      0, 0,
      1, 0,
      1, 1,
      0, 1
	];
 	
 	this.initBuffers();


 	
 	
 };

 MyRectangle.prototype = Object.create(CGFobject.prototype);
 MyRectangle.prototype.constructor = MyRectangle;

 MyRectangle.prototype.initBuffers = function() {
 
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };