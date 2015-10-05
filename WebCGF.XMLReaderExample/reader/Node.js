
function Node() {
	this.materials = null;
	this.texture = null;
	this.matrix = null; // matriz de transformação do nó
	this.descendents = [];
}

Node.prototype.constructor = Node;


Node.prototype.pushDescendents = function(nodeId){
	this.descendents.push(nodeId);
}

Node.prototype.setMaterial = function(material){
	this.material= material;
}

Node.prototype.setMatrix = function(matrix){
	this.matrix = matrix;
}

Node.prototype.translateMatrix = function(matrix){
	mat4.translate(this.matrix,this.matrix,matrix);
}

Node.prototype.rotateMatrix = function(degrees, axis){
	mat4.rotate(this.matrix,this.matrix,degrees,axis);
}

Node.prototype.scaleMatrix = function(matrix){
	mat4.scale(this.matrix,this.matrix,matrix);
} 


