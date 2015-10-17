/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);

 	this.p1 = vec3.fromValues(args[0],args[1],args[2]);
	this.p2 = vec3.fromValues(args[3],args[4],args[5]);
	this.p3 = vec3.fromValues(args[6],args[7],args[8]);

	this.vertices = [];
	this.indices = [];
	this.normal = [];
	this.originalTexCoords = [];
	this.texCoords = [];

	this.initBuffers();

};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.updateTextCoords = function(ampS,ampT){
	this.texCoords=[
		this.originalTexCoords[0]/ampS, this.originalTexCoords[1]/ampT,
		0, 0,
		this.originalTexCoords[4]/ampS, 0
	];

	this.updateTexCoordsGLBuffers();
};

MyTriangle.prototype.initBuffers = function() {
	
	this.vertices = [
    	this.p1[0], this.p1[1], this.p1[2],
    	this.p2[0], this.p2[1], this.p2[2],
    	this.p3[0], this.p3[1], this.p3[2]
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

   
   	var cosB = (vec3.sqrLen(p1p3) - vec3.sqrLen(p1p2) + vec3.sqrLen(p2p3)) / (2 * vec3.length(p1p3) * vec3.length(p2p3));
	var sinB = Math.sqrt(vec3.sqrLen(p1p3) - Math.pow(vec3.length(p1p3) * cosB, 2));
	var sCoords = (vec3.length(p2p3) - vec3.length(p1p3) * cosB) / vec3.length(p2p3);
	var tCoords = (vec3.length(p1p3)*sinB) / vec3.length(p2p3);
	
	this.originalTexCoords = [
		sCoords, tCoords,
		0, 0,
		1, 0
	];

	this.texCoords = this.originalTexCoords;

	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};