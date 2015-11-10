function LinearAnimation(id, span, controlpoints) {
	this.id = id;
	this.span = span;
	this.controlpoints = [];
	this.totalDistance = 0;

	for(var j = 0; j < controlpoints.length - 1; j++){
		var A = vec3.fromValues(controlpoints[j][0], controlpoints[j][1], controlpoints[j][2]);
		var B = vec3.fromValues(controlpoints[j+1][0], controlpoints[j+1][1], controlpoints[j+1][2]);
		var AB = vec3.create();
		vec3.sub(AB, B, A);

		this.totalDistance += vec3.length(AB);
	}

};
 
LinearAnimation.prototype = Object.create(Object.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.updateNodeMatrix = function(matrix, milliseconds){
	var newMatrix = mat4.create();

	if(milliseconds == 0)

	
};