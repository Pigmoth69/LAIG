function StateMachine(scene) {
	this.scene = scene;
	this.playMenu = new PlayMenu(this.scene);
	this.game = new Game(this.scene);
	this.currentState = 'Main Menu';
	this.currentScenario = null;
	this.endScreen = null;
};


StateMachine.prototype = Object.create(Object.prototype);
StateMachine.prototype.constructor = StateMachine;


StateMachine.prototype.displayHandler = function(){


	if(this.currentScenario != null)
		if(this.scene.graph.nodes[this.currentScenario]!=null)
			this.scene.drawNode(this.scene.graph.root[this.currentScenario], 'null', 'clear');
		else{
			this.currentScenario = null;
			console.warn("Nodes for that current scenario does not exist!");
		}
			
	
				
	switch(this.currentState){
		case 'Main Menu':
			this.scene.interface.camera.close();
			this.scene.interface.game.close();
			this.playMenu.display();
			break;
		case 'Main Menu to Gameplay':
			this.scene.interface.game.open();
			this.scene.interface.camera.open();
			this.scene.interface.players.close();
			this.playMenu.display();			
			this.game.display();
			break;
		case 'Gameplay':
			this.scene.interface.players.close();
			this.game.handler();
			this.game.display();
			break;
		case 'EndScreen':
			//this.scene.interface.close();
			this.game.display();
			//this.endScreen.display();
		default: break;

	}
};


StateMachine.prototype.pickingHandler = function(obj)
{

	switch(this.currentState){
		case 'Main Menu':
			this.playMenu.picking(obj);
			break;
		case 'Gameplay':
			this.game.picking(obj);
			break;
		default: break;
	}

};



