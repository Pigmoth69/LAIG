/**
 * MyInterface
 * @constructor
 */
 
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {

	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

};

MyInterface.prototype.loadInterfaceLigths = function(){
    this.gui.open();

    var scene = this.scene;

	for(checker in this.scene.graph.lightsStateValue)
	{
	    var listener = this.gui.add(this.scene.graph.lightsStateValue, checker);
	    
	    listener.onChange(function(bool) 
	    {
	    	scene.changeLight(this.property, bool);
	    });
	}
};

MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
};