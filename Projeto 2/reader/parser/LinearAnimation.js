function LinearAnimation(animation, controlpoints) {
	this.animation = animation;
	this.controlpoints = controlpoints;
	this.totalDistance = 0;

	console.log(controlpoints.length);

	for(var j = 0; j < controlpoints.length - 1; j++){
		var A = vec3.fromValues(controlpoints[j][0], controlpoints[j][1], controlpoints[j][2]);
		var B = vec3.fromValues(controlpoints[j+1][0], controlpoints[j+1][1], controlpoints[j+1][2]);
		var AB = vec3.create();
		vec3.sub(AB, B, A);

//	console.log(AB);
		this.totalDistance += vec3.length(AB);
	}

	//console.log(this.totalDistance);
};
 
LinearAnimation.prototype = Object.create(Object.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;