
function Node(id, material, texture, matrix, descendants, animations) {
	this.id = id;
	this.material = material;
	this.texture = texture;
	this.matrix = matrix; // matriz de transformação do nó
	this.descendants = descendants;
	this.animations = animations;
};

Node.prototype.constructor = Node;
Node.prototype = Object.create(Object.prototype);

Node.prototype.applyAnimations = function (scene) {
	var stackingSpan = 0;
	for(var i = 0; i < this.animations.length; i++){
		console.log('oi ' +  scene.milliseconds + '   ' + scene.graph.animations[this.animations[i]].span);
		if(scene.milliseconds < scene.graph.animations[this.animations[i]].span + stackingSpan){
			var newMatrix = scene.graph.animations[this.animations[i]].updateNodeMatrix(this.matrix, scene.milliseconds - stackingSpan);
			if(newMatrix != null){
				this.matrix = newMatrix;
				break;
			}
		}
		else if(scene.milliseconds == this.animations[i].span + stackingSpan)
			stackinSpan += this.animations[i].span;
	}
};