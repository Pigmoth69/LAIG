/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);

 	/*var p1 = vec3.fromValues(args[0],args[1],args[2]);
	var p2 = vec3.fromValues(args[3],args[4],args[5]);
	var p3 = vec3.fromValues(args[6],args[7],args[8]);

 	this.vertices = [
    	p1[0], p1[1], p1[2],
    	p2[0], p2[1], p2[2],
    	p3[0], p3[1], p3[2]
    ];

    this.indices = [0,1,2];

	var p1p2 = vec3.create();
	vec3.sub(p1p2, this.p2, this.p1);
	var p1p3 = vec3.create();
	vec3.sub(p1p3, this.p3, this.p1);
	var p2p3 = vec3.create();
	vec3.sub(p2p3, this.p3, this.p2);

	var Normal = vec3.create();
	vec3.cross(Normal, p1p2, p2p3);
	vec3.normalize(Normal, Normal);

	this.normals = [
		Normal[0], Normal[1], Normal[2],
		Normal[0], Normal[1], Normal[2],
		Normal[0], Normal[1], Normal[2],
    ];

    //alterar isto!!
	var tC = (vec3.sqrLen(AB) + vec3.sqrLen(AC) - vec3.sqrLen(BC))/ (2 * vec3.length(AB));
	var sC = Math.sqrt(vec3.sqrLen(AC) - tC * tC);
	this.nonScaledTexCoords = [
		sC, tC,
		0, 0,
		vec3.length(AB), 0
	];

	this.texCoords = this.nonScaledTexCoords.slice(0);*/
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

	this.initBuffers();

};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.updateTextCoords = function(ampS,ampT){
	/*this.textCoords=[
		0,0,
		
	];*/

	this.updateTexCoordsGLBuffers();
}
MyTriangle.prototype.initBuffers = function() {

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};