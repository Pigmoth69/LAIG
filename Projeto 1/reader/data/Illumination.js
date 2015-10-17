function Illumination() {
    this.ambient = [0, 0, 0, 0];
    this.background = [0, 0, 0, 0];
}

Illumination.prototype = Object.create(Object.prototype);
Illumination.prototype.constructor = Illumination;

Illumination.prototype.setAmbient = function(ambient){
	this.ambient = ambient;
};

Illumination.prototype.setBackground = function(background){
	this.background = background;
};