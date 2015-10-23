function LinearAnimation(animation, controlpoints) {
	this.animation = animation;
	this.controlpoints = controlpoints;
};
 
LinearAnimation.prototype = Object.create(Object.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;