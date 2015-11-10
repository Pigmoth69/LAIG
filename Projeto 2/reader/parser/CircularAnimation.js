function CircularAnimation(id, span, center, radius, startang, rotang) {
	this.id = id;
	this.span = span;
	this.center = center;
	this.radius = radius;
	this.startang = startang;
	this.rotang = rotang;
};

CircularAnimation.prototype = Object.create(Object.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;