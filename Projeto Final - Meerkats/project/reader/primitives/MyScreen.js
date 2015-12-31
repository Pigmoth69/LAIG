function MyScreen(scene, material, texture, animation) {
	CGFobject.call(this,scene);
	this.rect = new MyRectangle(scene, [-0.5,0.5, 0.5,-0.5]);
	this.scallingTime = 1000; //milliseconds
	this.initialTime = scene.milliseconds;
	this.material = material;
	this.texture = texture;
	this.animation = animation;


	console.log(this.texture);
};

MyScreen.prototype = Object.create(CGFobject.prototype);
MyScreen.prototype.constructor = MyScreen;

MyScreen.prototype.display = function() {
	this.scene.graph.materials[this.material].setTexture(this.scene.graph.textures[this.texture]);
	this.scene.graph.materials[this.material].apply();
	this.scene.pushMatrix();
	if(this.initialTime + this.scallingTime > this.scene.milliseconds && this.animation)
		this.scene.scale((this.scene.milliseconds-this.initialTime)/this.scallingTime, (this.scene.milliseconds-this.initialTime)/this.scallingTime, 1);
	this.rect.display();
	this.scene.graph.textures[this.texture].unbind();

	this.scene.popMatrix();

};


MyScreen.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};