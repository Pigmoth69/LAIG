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
	var lights = this.gui.addFolder('Lights');
    lights.open();

    var scene = this.scene;

	for(id in this.scene.graph.lightsStateValue)
	{
		//adiciona as opcoes com o id das luzes da scene
	    var listener = lights.add(this.scene.graph.lightsStateValue, id);
	    
	    //handler que le a acao do utilizador e atualiza a informaçao das luzes na scene
	    listener.onChange(function(bool) 
	    {
	    	scene.updateLightsState(this.property, bool);
	    });
	}
};

Interface.prototype.setScene = function(scene) {
    this.scene = scene;
};