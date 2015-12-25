
 function MyDice(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
 	this.rectangle = new MyQuad(this.scene);
};

MyDice.prototype = Object.create(CGFobject.prototype);
MyDice.prototype.constructor = MyDice;

MyDice.prototype.display = function(){
	
	this.scene.pushMatrix();
	//front
	this.scene.pushMatrix();
	this.scene.graph.materials['purple'].apply();
	this.scene.translate(0, 0, 0.5);
	this.rectangle.display();
	this.scene.popMatrix();

	//back
	this.scene.pushMatrix();
	this.scene.graph.materials['white'].apply();
	this.scene.translate(0, 0, -0.5);
	this.scene.rotate(Math.PI, 1, 0, 0);
	this.rectangle.display();
	this.scene.popMatrix();

	//top
	this.scene.pushMatrix();
	this.scene.graph.materials['blue'].apply();
	this.scene.rotate(Math.PI/2, 1, 0, 0);
	this.scene.translate(0, 0, 0.5);
	this.rectangle.display();
	this.scene.popMatrix();

	//bot
	this.scene.pushMatrix();
	this.scene.graph.materials['red'].apply();
	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	this.scene.translate(0, 0, 0.5);
	this.rectangle.display();
	this.scene.popMatrix();

	//right
	this.scene.pushMatrix();
	this.scene.graph.materials['yellow'].apply();
	this.scene.rotate(Math.PI/2, 0, 1, 0);
	this.scene.translate(0, 0, 0.5);
	this.rectangle.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.graph.materials['green'].apply();
	this.scene.rotate(-Math.PI/2, 0, 1, 0);
	this.scene.translate(0, 0, 0.5);
	this.rectangle.display();
	this.scene.popMatrix();

	this.scene.popMatrix();
};

