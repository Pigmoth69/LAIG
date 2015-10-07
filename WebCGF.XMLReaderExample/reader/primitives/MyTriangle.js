/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);

 	

 	this.vertices = [
 		args[0], args[1], args[2], //p1
 		args[3], args[4], args[5], //p2
 		args[6], args[7], args[8]  //p3
 		];

 		this.indices = [
 		0, 1, 2
 		];

 		var Nx,Ny,Nz;
 		var p1 = [args[0], args[1], args[2]];
 		var p2 = [args[3], args[4], args[5]];
 		var p3 = [args[6], args[7], args[8]];

 		var A = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
 		var B = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

 		var result = [A[1]*B[2] - A[2]*B[1], A[2]*B[0] - A[0]*B[2], A[0]*B[1] - A[1]*B[0]];


 		this.normals = [
		result[0], result[1], result[2],
		result[0], result[1], result[2],
		result[0], result[1], result[2]
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