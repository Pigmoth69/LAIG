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
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	 this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	
	// add a group of controls (and open/expand by defult)
	
//	var group=this.gui.addFolder("Luzes");

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
/*	for(var i = 0; i < this.scene.lights.length;i++){
		group.add(this.scene, 'light'+i);
	}
	*/	

	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters
	
	//this.gui.add(this.scene, 'speed', -5, 5);

};

MyInterface.prototype.loadInterfaceLigths = function(){
    var group = this.gui.addFolder('Lights');
    group.open();
    var save = this.scene;
	for(id in this.scene.graph.lightsStateValue){
	    var action = group.add(this.scene.graph.lightsStateValue,id);
	    action.onChange(function(value) {
	    	save.changeLight(id, value);
	    });
	}
};

MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
};