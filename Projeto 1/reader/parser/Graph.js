function Graph() {
	this.rootID = 'root';
	this.initials = new Initials();
	this.illumination = new Illumination();
	this.lights = [];
    this.materials = [];
    this.textures = [];
    this.leaves = [];
	this.nodes = [];
	this.lightsStateValue = [];
};


Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;

