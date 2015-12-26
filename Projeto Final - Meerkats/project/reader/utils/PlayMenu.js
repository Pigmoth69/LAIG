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
	this.scene.drawNode(this.scene.graph.root['Main Menu'], 'null', 'clear');
};

PlayMenu.prototype.picking = function(obj){
	var ID = obj[1];
	switch(ID){
		case 1:
			if(!this.generatePlayersList())
				break;
			var requestString = '[sortColors,["' + this.scene.Humans + '"],["' + this.scene.Bots +'"],_Result]';
			console.log(requestString);
			this.scene.socket.sendRequest(requestString, 'colors');
			while(this.scene.socket.colorsResponse.size == 0){}
			this.scene.cameraAnimation.startCameraAnimation(1500, vec3.fromValues(0, 30, 33), vec3.fromValues(0,0,0));
			this.scene.stateMachine.currentState = 'Main Menu to Gameplay';
			break;
		default: break;
	}				

};

PlayMenu.prototype.generatePlayersList = function(){
	var humans = this.scene.Humans;
	var bots = this.scene.Bots;
	if(humans + bots > 4)
		return false;

	for(var i = 0; i < humans; i++)
	{
		var Human = 'Player' + i;
		this.scene.stateMachine.game.players.push(Human);
	}

	for(var i = 1; i < bots; i++)
	{
		var Bot = 'Bot' + i;
		this.scene.stateMachine.game.players.push(Bot);
	}

	return true;
};