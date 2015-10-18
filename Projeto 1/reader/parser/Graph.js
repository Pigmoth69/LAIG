function Graph() {
	this.rootID = 'root';
	this.initials = new Initials();
	this.illumination = new Illumination();
	this.lights = [];
    this.materials = [];
    this.textures = [];
    this.leaves = [];
	this.nodes = [];
	this.lightsValues={
						Light1:null,
						Light2:null,
						Light3:null,
						Light4:null,
						Light5:null,
						Light6:null,
						Light7:null,
						Light8:null
	};
};


Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;

Graph.prototype.addLightValue = function(position,value){
	switch(position){
		case 1:
			this.lightsValues.Light1=value;
			break;
		case 2:
			this.lightsValues.Light2=value;
			break;
		case 3:
			this.lightsValues.Light3=value;
			break;
		case 4:
			this.lightsValues.Light4=value;
			break;
		case 5:
			this.lightsValues.Light5=value; 
			break;
		case 6:
			this.lightsValues.Light6=value;
			break;
		case 7:
			this.lightsValues.Light7=value;
			break;
		case 8:
			this.lightsValues.Light8=value;
			break;
		default:
	}

};
