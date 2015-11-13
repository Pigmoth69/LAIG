/**
 * MyPlane
 * @constructor
 */
function MyPlane(scene,divisions) {
	CGFobject.call(this,scene);
	this.divisions = divisions || 5;
	var surface = this.makeSurface();
	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};
	this.plane = new CGFnurbsObject(scene,getSurfacePoint,this.divisions,this.divisions);
};
MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;


MyPlane.prototype.makeSurface = function(){
	var degree = 1;
	var knots = [0,0,1,1];
	var controlVertexes = [];
	controlVertexes.push([[0.5,0,-0.5,1],[0.5,0,0.5,1]]);
	controlVertexes.push([[-0.5,0,-0.5,1],[-0.5,0,0.5,1]]);
	
	return new CGFnurbsSurface(degree, degree, knots, knots, controlVertexes);
};

MyPlane.prototype.display = function(){
	this.plane.display();
}

MyPlane.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};