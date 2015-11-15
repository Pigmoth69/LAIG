/**
 * MyVehicle
 * @constructor
 */
function MyVehicle(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.makeVehicle();
};

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.makeVehicle = function() {

	topControlPoints= 
	[
		[
			[0,0,0,1],[1,0,1,1],[1,0,2,1],[0,0,3,1]
		],
		[
			[0,0,0,1],[0.3,0.6,1,1],[0.3,0.6,2,1],[0,0,3,1]
		],
		[	
			[0,0,0,1],[-0.3,0.6,1,1],[-0.3,0.6,2,1],[0,0,3,1]
		],
		[	
			[0,0,0,1],[-1,0,1,1],[-1,0,2,1],[0,0,3,1]
		]
	];

	backControlPoints= 
	[
		[	
			[0,0,0,1],[-1,0,1,1],[-1,0,2,1],[0,0,3,1]
		],
		[	
			[0,0,0,1],[-0.3,-0.6,1,1],[-0.3,-0.6,2,1],[0,0,3,1]
		],
		[
			[0,0,0,1],[0.3,-0.6,1,1],[0.3,-0.6,2,1],[0,0,3,1]
		],
		[
			[0,0,0,1],[1,0,1,1],[1,0,2,1],[0,0,3,1]
		]
	];

	cockpitControlPoints= 
	[
		[	
			[0,0,0,1],[-1,0,1,1],[-1,0,2,1],[0,0,3,1]
		],
		[	
			[0,0,0,1],[-0.3,-0.6,1,1],[-0.3,-0.6,2,1],[0,0,3,1]
		],
		[
			[0,0,0,1],[0.3,-0.6,1,1],[0.3,-0.6,2,1],[0,0,3,1]
		],
		[
			[0,0,0,1],[1,0,1,1],[1,0,2,1],[0,0,3,1]
		]
	];
	

	this.top = new MyPatch(this.scene,3,3,128,128,topControlPoints);
	this.engine = new MyCylinder(this.scene,[2,1,1,1,60]);
	this.flame = new MyCylinder(this.scene,[0,1,0,1,60]);
	this.back = new MyPatch(this.scene,3,3,128,128,backControlPoints);
	this.cockpit = new MyPatch(this.scene,3,3,128,128,backControlPoints);


};

MyVehicle.prototype.display = function(){
this.displayCockpit();
this.displayShipBody();	
this.displayEngines();
}

MyVehicle.prototype.displayShipBody = function(){
this.scene.graph.textures['spaceship'].bind();
	this.scene.pushMatrix();
	this.scene.scale(3,3,3);
	this.top.display();
	this.back.display();
	this.scene.popMatrix();
	this.scene.graph.textures['spaceship'].unbind();
	

};

MyVehicle.prototype.displayCockpit = function(){

}

MyVehicle.prototype.displayEngines =function(){
	this.scene.graph.textures['engine'].bind();
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
	this.scene.graph.textures['engine'].unbind();

	this.scene.graph.textures['flame'].bind();
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
	this.scene.graph.textures['flame'].unbind();
	
};

MyVehicle.prototype.loadVehicleTextures = function(){
	//to-do
}


MyVehicle.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};

	