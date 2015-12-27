/**
 * MyStone
 * @constructor
 */
function MyStone(scene, id, colorMaterial, position) {
	CGFobject.call(this,scene);
	this.id = id;
	this.scene = scene;
	this.position = position;
	this.colorMaterial = colorMaterial;
	this.makeStone();
	this.tile = null;
	this.picked = false;

	this.standByAnimationVelocity = 0.13;
	this.standByAnimationOrientation = 'up';
	this.standByAnimationHeight = 0;

	this.dropAnimationTimer = 0;
	this.dropAnimationCenter = null;
	this.dropAnimationInitial = null;
	this.dropAnimationRadius = 0;
	this.dropAnimationVector = null;
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
	this.scene.pushMatrix();
	this.scene.graph.materials[this.colorMaterial].apply();

	if(this.picked)
		this.standByAnimation();

	this.top.display();
	this.back.display();
	this.scene.popMatrix();
};


MyStone.prototype.standByAnimation = function(){
	var matrix = new mat4.create();
	if(this.standByAnimationOrientation == 'up')
	{
	this.standByAnimationHeight+=this.standByAnimationVelocity * ((1.7-Math.abs(this.standByAnimationHeight))/1.7);
	mat4.translate(matrix, matrix, [0,this.standByAnimationHeight,0]);

		if(this.standByAnimationHeight >= 1.5)
			this.standByAnimationOrientation = 'down';
	}
	else
	{
	this.standByAnimationHeight-=this.standByAnimationVelocity * ((1.7-Math.abs(this.standByAnimationHeight))/1.7);
	mat4.translate(matrix, matrix, [0,this.standByAnimationHeight,0]);
		if(this.standByAnimationHeight <= 0)
			this.standByAnimationOrientation = 'up';
	}
	this.scene.multMatrix(matrix);
};


MyStone.prototype.dropStone = function(destination){
	this.dropAnimationCenter = vec3.create();
	this.dropAnimationInitial = vec3.fromValues(this.position.x,this.position.y,this.position.z);
	var destination = vec3.fromValues(destination.x, destination.y, destination.z);
	vec3.sub(this.dropAnimationCenter, this.dropAnimationInitial, destination);
	vec3.scale(this.dropAnimationCenter, this.dropAnimationCenter, 0.5);
	vec3.add(this.dropAnimationCenter, destination, this.dropAnimationCenter);


	this.dropAnimationVector = vec3.create();
	vec3.sub(this.dropAnimationVector, this.dropAnimationInitial, this.dropAnimationCenter);

	this.dropAnimationTimer = this.scene.milliseconds + 1500;

};

MyStone.prototype.movementAnimation = function(){
	var fraction = Math.cos(((this.dropAnimationTimer-this.scene.milliseconds)/1500) * Math.PI);
	var inc = vec3.create();
	vec3.scale(inc, this.dropAnimationVector, fraction);
	if(this.scene.milliseconds >= this.dropAnimationTimer)
	{
		fraction = -1;
		this.scene.stateMachine.game.animation = false;
		this.scene.stateMachine.game.pickedStone = null;

		if(!this.scene.stateMachine.game.undo && this.scene.stateMachine.game.playedStone == null)
			this.scene.stateMachine.game.playedStone = this;
		else if(this.scene.stateMachine.game.undo && this.scene.stateMachine.game.roundMove == 'drag')
			this.scene.stateMachine.game.playedStone = this.scene.stateMachine.game.undoRegister['drag']['playedStone'];

		this.scene.socket.boardResponse = null;
		this.dropAnimationTimer = 0;


		this.scene.stateMachine.game.undo = false;
	}
	
	this.position = new Coords(this.dropAnimationCenter[0] - inc[0], 1-Math.abs(fraction), this.dropAnimationCenter[2] - inc[2]);
};


MyStone.prototype.updateTextCoords = function(ampS,ampT){
	//this.updateTexCoordsGLBuffers();
};

	