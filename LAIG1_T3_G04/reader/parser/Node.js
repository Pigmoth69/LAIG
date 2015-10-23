
function Node(id, material, texture, matrix, descendants) {
	this.id = id;
	this.material = material;
	this.texture = texture;
	this.matrix = matrix; // matriz de transformação do nó
	this.descendants = descendants;
}

Node.prototype.constructor = Node;
Node.prototype = Object.create(Object.prototype);