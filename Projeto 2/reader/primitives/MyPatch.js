/**
 * MyPatch
 * @constructor
 */
function MyPatch(scene,order,partsU,partsV,controllpoints) {
	CGFobject.call(this,scene);
	this.order = order;
	this.controllpoints = controllpoints;

	var surface = this.makeSurface();
	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};
	this.patch = new CGFnurbsObject(scene,getSurfacePoint,partsU,partsV);
	console.warn(this.patch);
};
MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;


MyPatch.prototype.makeSurface = function(){
	var degree = this.order;
	var knots = [];
	///push knots 1
	for(var i = 0 ; i < this.order + 1;i++)
		knots.push(0);
	//push knots 2
	for(var i = 0 ; i < this.order + 1;i++)
		knots.push(1);
	return new CGFnurbsSurface(degree, degree, knots, knots, this.controllpoints);

};

MyPatch.prototype.display = function(){
	this.patch.display();
}

MyPatch.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};
