function Graph() {
	this.rootID = 'root';
	this.LSXinitials = new Initials();
	this.LSXillumination = new Illumination();
	this.LSXlights = new Array();
    this.materials = new Array();
    this.textures = new Array();
    this.leaves = new Array();
	this.nodes = new Array();
};


Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;