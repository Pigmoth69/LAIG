/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);

 	var p1 = vec3.fromValues(args[0],args[1],args[2]);
	var p2 = vec3.fromValues(args[3],args[4],args[5]);
	var p3 = vec3.fromValues(args[6],args[7],args[8]);

 	this.vertices = [
    	p1[0], p1[1], p1[2],
    	p2[0], p2[1], p2[2],
    	p3[0], p3[1], p3[2]
    ];

    this.indices = [0,1,2];

	var p1p2 = vec3.create();
	vec3.sub(p1p2, p2, p1);
	var p1p3 = vec3.create();
	vec3.sub(p1p3, p3, p1);
	var p2p3 = vec3.create();
	vec3.sub(p2p3, p3, p2); 

	var Normal = vec3.create();
	vec3.cross(Normal, p1p2, p2p3);
	vec3.normalize(Normal, Normal);

	this.normals = [
		Normal[0], Normal[1], Normal[2],
		Normal[0], Normal[1], Normal[2],
		Normal[0], Normal[1], Normal[2],
    ];

    //alterar isto!!
	var tCoords = (vec3.sqrLen(p1p2) + vec3.sqrLen(p1p3) - vec3.sqrLen(p2p3))/ (2 * vec3.length(p1p2));
	var sCoords = Math.sqrt(vec3.sqrLen(p1p3) - tCoords * tCoords);
	this.nonScaledTexCoords = [
		sCoords, tCoords,
		0, 0,
		vec3.length(p1p2), 0
	];

	this.texCoords = this.nonScaledTexCoords.slice(0);
	

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