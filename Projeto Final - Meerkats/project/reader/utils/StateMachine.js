function StateMachine(scene) {
	this.scene = scene;
	this.playMenu = new PlayMenu(this.scene);
	this.game = new Game(this.scene);
	this.currentState = 'Main Menu';
};


StateMachine.prototype = Object.create(Object.prototype);
StateMachine.prototype.constructor = StateMachine;


StateMachine.prototype.displayHandler = function(){

	switch(this.currentState){
		case 'Main Menu':
			this.scene.interface.camera.close();
			this.playMenu.display();
			break;
		case 'Main Menu to Gameplay':
			this.scene.interface.camera.open();
			this.scene.interface.players.close();
			this.playMenu.display();			
			this.scene.drawNode(this.scene.graph.root['Gameplay'], 'null', 'clear');
			break;
		case 'Gameplay':
			this.scene.interface.players.close();
			this.game.handler();
			this.game.display();
			break;
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



