/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);
 		
 	console.log(args);

 	this.vertices = [
 		args[0], args[1], args[2], //p1
 		args[3], args[4], args[5], //p2
 		args[6], args[7], args[8]  //p3
 	];
 	
 	this.indices = [
		1, 2, 3
 	];
 	
 	var U,V;

 	U = [args[5],args[2],args[3]]; 
 	V = [];
 	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
 	];
	
	//isto tem de ser alterado que está errado
	this.texCoords = [
      0, 0,
      1, 0,
      1, 1,
      0, 1
	];
 	
 	this.initBuffers();


 	
 	
 };

 MyTriangle.prototype = Object.create(CGFobject.prototype);
 MyTriangle.prototype.constructor = MyTriangle;

 MyTriangle.prototype.initBuffers = function() {
 
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };