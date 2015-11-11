function LinearAnimation(id, span, controlpoints) {
	this.id = id;
	this.span = span;
	this.controlpoints = [];
	this.totalDistance = 0;

	var originalOrientation = vec3.fromValues(0,0,1);
	var distances = [];
	for(var j = 0; j < controlpoints.length; j++){
		var point = vec3.fromValues(controlpoints[j][0], controlpoints[j][1], controlpoints[j][2]);
		
		if(j < controlpoints.length - 1){
			//gets the next controlpoint coordinates to calculate orientation of the object
			var nextPoint = vec3.fromValues(controlpoints[j+1][0], controlpoints[j+1][1], controlpoints[j+1][2]);
			//gets the vector between the current controlpoint and the next one
			var vectorOrientation = vec3.create();
			vec3.sub(vectorOrientation, nextPoint, point);
			var distance = vec3.length(vectorOrientation);
			this.totalDistance += distance;
			vec3.normalize(vectorOrientation, vectorOrientation);
			distances.push(distance);
			//calculates the rotation to apply to the object in the start of the controlpoint
			var orientation = Math.acos(vec3.dot(vectorOrientation, originalOrientation)/(vec3.length(vectorOrientation) * vec3.length(originalOrientation)));

			this.controlpoints[j] = new ControlPoint(point, orientation);
		}
		else this.controlpoints[j] = new ControlPoint(point, this.controlpoints[j-1].orientation);
		
	}


	console.log('numero de controlpoints : ' + controlpoints.length);
	console.log(this.controlpoints[0].point3D);
	console.log(this.controlpoints[0].orientation);
	console.log(this.controlpoints[0].distance);


	var distance = 0;
	for(var j = 1; j < this.controlpoints.length; j++){
		distance += distances[j - 1];
		this.controlpoints[j].distance = distance;
		this.controlpoints[j].rotationStep = (this.controlpoints[j].orientation - this.controlpoints[j-1].orientation) / (this.controlpoints[j].distance - this.controlpoints[j-1].distance);
		
		if(j < this.controlpoints.length-1){

			var normal = vec3.create();
			var AB = vec3.create();
			var BC = vec3.create();
			vec3.sub(AB, this.controlpoints[j].point3D, this.controlpoints[j-1].point3D);
			vec3.sub(BC, this.controlpoints[j+1].point3D, this.controlpoints[j].point3D);
			vec3.cross(this.controlpoints[j].rotationAxis, AB, BC);
		}


		console.log(this.controlpoints[j].point3D);
		console.log(this.controlpoints[j].orientation);
		console.log(this.controlpoints[j].distance);
		if(this.controlpoints[j].rotationAxis != null)
		console.log(this.controlpoints[j].rotationAxis);

	}

};
 
LinearAnimation.prototype = Object.create(Object.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.updateNodeMatrix = function(matrix, milliseconds){
	var newMatrix = mat4.create();
	var currDistance = milliseconds * this.totalDistance / this.span;

	for(var j = 1; j < this.controlpoints.length; j++){
		if(currDistance <= this.controlpoints[j].distance)
		{
			var fractionDistance = (currDistance - this.controlpoints[j-1].distance) / (this.controlpoints[j].distance - this.controlpoints[j-1].distance);
			var position = vec3.create();
			vec3.scale(position, this.controlpoints[j-1].point3D, fractionDistance);

			mat4.translate(newMatrix, newMatrix, position);
			
			var currRotation = this.controlpoints[j].rotationStep * (currDistance - this.controlpoints[j-1].distance);

			mat4.rotate(newMatrix, newMatrix, currRotation, this.controlpoints[j].rotationAxis);

			return newMatrix;
		}
	}

	return null;
};