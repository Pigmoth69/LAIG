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
 		console.log("Vertices: "+ this.vertices);

 		this.indices = [
 		0, 1, 2
 		];

 		var U,V,Nx,Ny,Nz;

 		U = [args[3]-args[0], args[4]-args[1], args[5]-args[2]]; 
 		V = [args[6]-args[0], args[7]-args[1], args[8]-args[2]];

 		Nx= U[1]*V[2] - U[2]*V[1];
 		Ny= U[2]*V[0] - U[0]*V[2];
 		Nx= U[0]*V[1] - U[1]*V[0];


 		this.normals = [
		Nx, Ny, Nz,
		Nx, Ny, Nz,
		Nx, Ny, Nz 
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