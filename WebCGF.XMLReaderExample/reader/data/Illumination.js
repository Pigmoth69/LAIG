function Illumination() {
    this.ambient = [0, 0, 0, 0];
    this.background = [0, 0, 0, 0];
}

Illumination.prototype = Object.create(Object.prototype);
Illumination.prototype.constructor = Illumination;

Illumination.prototype.setAmbient = function(ambient){
	this.ambient[0] = ambient[0];
	this.ambient[1] = ambient[1];
	this.ambient[2] = ambient[2];
	this.ambient[3] = ambient[3];
};

Illumination.prototype.setBackground = function(background){
	this.background[0] = background[0];
	this.background[1] = background[1];
	this.background[2] = background[2];
	this.background[3] = background[3];
};