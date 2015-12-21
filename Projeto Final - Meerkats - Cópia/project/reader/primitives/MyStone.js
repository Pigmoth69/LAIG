/**
 * MyStone
 * @constructor
 */
function MyStone(scene, colorTexture) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.colorTexture = colorTexture;
	this.makeStone();
};

MyStone.prototype = Object.create(CGFobject.prototype);
MyStone.prototype.constructor = MyStone;

MyStone.prototype.makeStone = function() {

	topControlPoints= 
	[
		[
			[0,0,0.9,1],[0.8,0,1,1],[0.8,0,2,1],[0,0,2.1,1]
		],
		[
			[0,0,0.9,1],[0.3,0.5,1,1],[0.3,0.5,2,1],[0,0,2.1,1]
		],
		[	
			[0,0,0.9,1],[-0.3,0.5,1,1],[-0.3,0.5,2,1],[0,0,2.1,1]
		],
		[	
			[0,0,0.9,1],[-0.8,0,1,1],[-0.8,0,2,1],[0,0,2.1,1]
		]
	];

	backControlPoints= 
	[
		[	
			[0,0,0.9,1],[-0.8,0,1,1],[-0.8,0,2,1],[0,0,2.1,1]
		],
		[	
			[0,0,0.9,1],[-0.3,0,1,1],[-0.3,0,2,1],[0,0,2.1,1]
		],
		[
			[0,0,0.9,1],[0.3,0,1,1],[0.3,0,2,1],[0,0,2.1,1]
		],
		[
			[0,0,0.9,1],[0.8,0,1,1],[0.8,0,2,1],[0,0,2.1,1]
		]
	];


	

	this.top = new MyPatch(this.scene,3,3,32,32,topControlPoints);
	this.back = new MyPatch(this.scene,3,3,32,32,backControlPoints);
};

MyStone.prototype.display = function(){
	this.displayStone();
}

MyStone.prototype.displayStone = function(){
this.scene.graph.textures[this.colorTexture].bind();
	this.scene.pushMatrix();
	this.scene.translate(0,0,-1.5);
	this.top.display();
	this.back.display();
	this.scene.popMatrix();
	this.scene.graph.textures[this.colorTexture].unbind();
};





MyStone.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};

	