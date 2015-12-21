
function CameraAnimation(scene) {
	this.scene = scene;
	this.animationSteps = 0;
	this.movementStep = vec3.fromValues(0,0,0);
	this.targetStep = vec3.fromValues(0,0,0);
};

CameraAnimation.prototype.startCameraAnimation = function(time, finalPosition, finalTarget)
{
	this.animationSteps = time / this.scene.MILLISECONDS_TO_UPDATE;
	
	var moveX = (finalPosition[0] - this.scene.camera.position[0])/this.animationSteps;
	var moveY = (finalPosition[1] - this.scene.camera.position[1])/this.animationSteps;
	var moveZ = (finalPosition[2] - this.scene.camera.position[2])/this.animationSteps;

	this.movementStep = vec3.fromValues(moveX, moveY, moveZ);

	var targetX = (finalTarget[0] - this.scene.camera.target[0])/this.animationSteps;
	var targetY = (finalTarget[1] - this.scene.camera.target[1])/this.animationSteps;
	var targetZ = (finalTarget[2] - this.scene.camera.target[2])/this.animationSteps;

	this.targetStep = vec3.fromValues(targetX, targetY, targetZ);

};

CameraAnimation.prototype.animateCamera = function(){
	var newPosition = vec3.fromValues(this.scene.camera.position[0] + this.movementStep[0], this.scene.camera.position[1] + this.movementStep[1], this.scene.camera.position[2] + this.movementStep[2]);
	this.scene.camera.setPosition(newPosition);
	var newTarget = vec3.fromValues(this.scene.camera.target[0] + this.targetStep[0], this.scene.camera.target[1] + this.targetStep[1], this.scene.camera.target[2] + this.targetStep[2]);
	this.scene.camera.setTarget(newTarget);
	
	this.animationSteps--;
};