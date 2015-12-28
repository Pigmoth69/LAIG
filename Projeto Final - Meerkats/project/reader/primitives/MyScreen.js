function MyScreen(scene, texture) {
	CGFobject.call(this,scene);
	this.quad = new MyQuad(scene);
	this.scallingTime = 1000; //milliseconds
	this.initialTime = scene.milliseconds;
	this.texture = texture;
	console.log(this.texture);
};

MyScreen.prototype = Object.create(CGFobject.prototype);
MyScreen.prototype.constructor = MyScreen;

MyScreen.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.graph.materials['endScreen'].apply();
	//this.scene.graph.materials['endScreen'].setTexture(this.texture);
	if(this.initialTime + this.scallingTime > this.scene.milliseconds)
		this.scene.scale((this.scene.milliseconds-this.initialTime)/this.scallingTime, (this.scene.milliseconds-this.initialTime)/this.scallingTime, 1);
	this.quad.display();
	this.scene.popMatrix();

};


MyScreen.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};