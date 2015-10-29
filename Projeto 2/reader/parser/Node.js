
function Node(id, material, texture, matrix, descendants, animations) {
	this.id = id;
	this.material = material;
	this.texture = texture;
	this.matrix = matrix; // matriz de transformação do nó
	this.descendants = descendants;
	this.animations = animations;
}

Node.prototype.constructor = Node;
Node.prototype = Object.create(Object.prototype);

Node.prototype.applyAnimations = function (scene) {
	for(var i = 0; i < this.animations.length; i++){
		//if(scene.graph.animations[this.animations[i]] instanceof LinearAnimation)
			//console.log(scene.graph.animations[this.animations[i]].totalDistance);
	}
}