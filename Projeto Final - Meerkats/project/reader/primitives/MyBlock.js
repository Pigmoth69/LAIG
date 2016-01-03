
function MyBlock(scene, height, width, depth) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.height = height;
	this.width = width;
	this.depth = depth;
};

MyBlock.prototype = Object.create(CGFobject.prototype);
MyBlock.prototype.constructor = MyBlock;



MyBlock.prototype.displayEngines =function(){
	this.scene.graph.textures[this.engineTexture].bind();
	//engine1
	this.scene.pushMatrix();
	this.scene.translate(1,0.75,0.5);
	this.scene.scale(0.5,0.5,0.75);
	this.engine.display();
	this.scene.popMatrix();
	//engine2
	this.scene.pushMatrix();
	this.scene.translate(-1,0.75,0.5);
	this.scene.scale(0.5,0.5,0.75);
	this.engine.display();
	this.scene.popMatrix();
	this.scene.graph.textures[this.engineTexture].unbind();

	this.scene.graph.textures[this.flameTexture].bind();
	//flame1
	this.scene.pushMatrix();
	this.scene.translate(1,0.75,0.49);
	this.scene.scale(0.45,0.45,1);
	this.flame.display();
	this.scene.popMatrix();
	//flame2
	this.scene.pushMatrix();
	this.scene.translate(-1,0.75,0.49);
	this.scene.scale(0.45,0.45,1);
	this.flame.display();
	this.scene.popMatrix();
	this.scene.graph.textures[this.flameTexture].unbind();
};

	