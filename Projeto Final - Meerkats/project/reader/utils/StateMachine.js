function StateMachine(scene) {
	this.scene = scene;
	this.currentState = 'Main Menu';
};


StateMachine.prototype = Object.create(Object.prototype);
StateMachine.prototype.constructor = StateMachine;


StateMachine.prototype.displayHandler = function(){

	switch(this.currentState){
		case 'Main Menu':
			this.scene.interface.camera.close();
			this.scene.drawNode(this.scene.graph.root['Main Menu'], 'null', 'clear');
			break;
		case 'Main Menu to Gameplay':
			this.scene.interface.camera.open();
			this.scene.drawNode(this.scene.graph.root['Main Menu'], 'null', 'clear');
			this.scene.drawNode(this.scene.graph.root['Gameplay'], 'null', 'clear');
			break;
		case 'Gameplay':
			this.scene.drawNode(this.scene.graph.root['Gameplay'], 'null', 'clear');
			break;
		default: break;

	}
};


StateMachine.prototype.pickingHandler = function(ID)
{
	switch(this.currentState){
		case 'Main Menu':
			this.mainMenuPicking(ID);
			break;
		case 'Gameplay':
			this.gameplayPicking(ID);
			break;
		default: break;
	}

	/*else if(this.cameraAnimation.Rotation)
		this.cameraAnimation.startCameraOrbit(1500, vec3.fromValues(0,1,0), -2*Math.PI/4);
	*/				

};


StateMachine.prototype.mainMenuPicking = function(ID){

	switch(ID){
		case 1:
			this.scene.cameraAnimation.startCameraAnimation(1500, vec3.fromValues(0, 30, 33), vec3.fromValues(0,0,0));
			this.currentState = 'Main Menu to Gameplay';
			break;
		default: break;
	}				

};

StateMachine.prototype.gameplayPicking = function(ID){
	var requestString = "[play," + "1" + ", " + "[[1,1,1],[0,0,0],[2,2,2]]" + "," + "1-1" + "," + "_NP" + "," + "_NB" + "," + "_M" + "]";
	switch(ID){
		default: 
			this.scene.socket.sendRequest(requestString);
			break;
	}

	
	//this.cameraAnimation.startCameraOrbit(1500, vec3.fromValues(0,1,0), -2*Math.PI/4);
};