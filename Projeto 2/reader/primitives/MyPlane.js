/**
 * MyPlane
 * @constructor
 */
function MyPlane(scene,args) {
	CGFobject.call(this,scene);
	this.divisions = args[0] || 5;
	var surface = this.makeSurface();
	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};
	this.plane = new CGFnurbsObject(scene,getSurfacePoint,this.divisions,this.divisions);
};
MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;


MyPlane.prototype.makeSurface = function(){
	var degree = this.divisions;
	var knots = [];
	var controlVertexes = [];
	var uVertex = [], vVertex = [];
	var increment = 1 / this.divisions;

	///push knots 1
	for(var i = 0 ; i < this.divisions + 1;i++)
		knots.push(0);
	//push knots 2
	for(var i = 0 ; i < this.divisions + 1;i++)
		knots.push(1);

	//controll controlvertexes
	
	var x=-0.5,z = 0.5;
	for(var uDivs = 0; uDivs < this.divisions + 1;uDivs++){
		uVertex = [];
		for(var vDivs = 0; vDivs < this.divisions + 1; vDivs++){
			vVertex = [];
			vVertex.push(x,0,z,1);
			uVertex.push(vVertex);
			z-=increment;
		}
		controlVertexes.push(uVertex);	
		z= 0.5;
		x+=increment;
	}

	//create surface
	return new CGFnurbsSurface(degree, degree, knots, knots, controlVertexes);

};

MyPlane.prototype.display = function(){
	this.plane.display();
}

MyPlane.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};