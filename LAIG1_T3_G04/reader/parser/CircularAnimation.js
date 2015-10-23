function CircularAnimation(animation, center, radius, startang, rotang) {
	this.animation = animation;
	this.center = center;
	this.radius = radius;
	this.startang = startang;
	this.rotang = rotang;
};

CircularAnimation.prototype = Object.create(Object.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;