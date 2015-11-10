
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
		if(scene.milliseconds < this.animations[i].span + stackingSpan){
			this.matrix = this.animations[i].updateNodeMatrix(this.matrix, scene.milliseconds - stackingSpan);
			
		}
	}
};