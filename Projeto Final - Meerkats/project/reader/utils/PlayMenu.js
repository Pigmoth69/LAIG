function PlayMenu(scene) {
	this.scene = scene;
	this.playerNumber = 0;
	//this.dice = new MyDice(this.scene);
	//this.playButton = new MyButton(this.scene);
	//this.sortButton = new Button(this.scene);
};


PlayMenu.prototype = Object.create(Object.prototype);
PlayMenu.prototype.constructor = PlayMenu;


PlayMenu.prototype.display = function(){
	this.scene.register(this.scene.graph.nodes['button']);
	this.scene.pushMatrix();
	this.scene.applyViewMatrix();
	this.scene.drawNode(this.scene.graph.root['Main Menu'], 'null', 'clear');
	this.scene.popMatrix();
};

PlayMenu.prototype.picking = function(obj){
	var ID = obj[1];
	switch(ID){
		case 1:
			var requestString = '[sortColors,["' + this.scene.Humans + '"],["' + this.scene.Bots +'"],_Result]';
			this.scene.socket.sendRequest(requestString, 'colors');
			this.scene.cameraAnimation.startCameraAnimation(1500, vec3.fromValues(0, 30, 33), vec3.fromValues(0,0,0));
			this.scene.stateMachine.currentState = 'Main Menu to Gameplay';
			break;
		default: break;
	}				

};
