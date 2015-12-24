/**
 * Interface
 * @constructor
 */
 
function Interface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/**	@brief Inicializacao da interface
  */
Interface.prototype.init = function(application) {

	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();
	this.gui.open();
};


/**	@brief Carrega a GUI com os parametros a interagir, criando um handler para controlar o estado das luzes
  */
Interface.prototype.loadInterfaceLigths = function(){
	this.lights = this.gui.addFolder('Lights');
    this.lights.open();

    var scene = this.scene;

	for(id in this.scene.graph.lightsStateValue)
	{
		//adiciona as opcoes com o id das luzes da scene
	    var listener = this.lights.add(this.scene.graph.lightsStateValue, id);
	    
	    //handler que le a acao do utilizador e atualiza a informaçao das luzes na scene
	    listener.onChange(function(bool) 
	    {
	    	scene.updateLightsState(this.property, bool);
	    });
	}
};


Interface.prototype.loadInterfaceBackgroundColor = function(){
    this.color = this.gui.addFolder('Background Color');
    this.color.close();

    var scene = this.scene;

    var listener = this.color.addColor(this.scene, 'BackgroundRGB' );

    listener.onChange(function(color) 
    {
        //scene.gl.clearColor(color[0]/255,color[1]/255,color[2]/255,1);
    });
};


/**	@brief Carrega a GUI com os parametros a interagir, criando um handler para controlar o numero de jogadores
  */
Interface.prototype.loadInterfacePlayers = function(){
	this.players = this.gui.addFolder('Players');
    this.players.open();

    var scene = this.scene;

    this.players.add(this.scene.graph.Players, 'Humans', [ 'None', '1', '2','3','4' ] );
    this.players.add(this.scene.graph.Players, 'Bots', [ 'None', '1', '2','3','4' ] );
};


Interface.prototype.loadInterfaceGameFunctions = function(){
	this.game = this.gui.addFolder('Game');
    this.game.open();

    var scene = this.scene;

    this.game.add(this.scene.graph.gameStatus,'PLAY');
    this.game.add(this.scene.graph.gameStatus,'RESTART');
};


Interface.prototype.loadInterfaceGameCameras = function(){
	this.camera = this.gui.addFolder('Cameras');
    this.camera.open();

    var scene = this.scene;
	this.camera.add(this.scene.cameraAnimation, 'Rotation');

    var listener = this.camera.add(this.scene.cameraAnimation, 'Perspective', ['Player Perspective', 'Upper Perspective']);
    listener.onChange(function(option)
    {
    	var originalOrientation = vec3.fromValues(0,0,1);
    	var vectorOrientation = vec3.fromValues(scene.camera.position[0], 0, scene.camera.position[2]);
    	var angle  = Math.acos(vec3.dot(originalOrientation, vectorOrientation)/(vec3.length(vectorOrientation) * vec3.length(originalOrientation)));

    	if(option == 'Upper Perspective')
    		scene.cameraAnimation.startCameraAnimation(2000, vec3.fromValues(0.5*Math.sin(angle),50,0.5*Math.cos(angle)), vec3.fromValues(0,0,0));
    	else 
    		scene.cameraAnimation.startCameraAnimation(2000, vec3.fromValues(33*Math.sin(angle),25,33*Math.cos(angle)), vec3.fromValues(0,0,0));
    });

};


Interface.prototype.setScene = function(scene) {
    this.scene = scene;
};
