
function Node() {
	this.id = null;
	this.material = null;
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

Node.prototype.setDescendents = function(descendents){
	this.descendents= descendents;
}

Node.prototype.getDescendents = function(){
	return this.descendents;
}

Node.prototype.setTexture = function(texture){
	this.texture= texture;
}

Node.prototype.setMatrix = function(matrix){
	this.matrix = matrix;
} 

Node.prototype.setId = function(nodeId){
	this.id = nodeId;
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

Node.prototype.getNodeID = function(){
	return this.id;
} 

Node.prototype.setNode = function(id,material,texture,matrix,descendents){
	this.id=id;
	this.setMaterial(material);
	this.setTexture(texture);
	this.setMatrix(matrix);
	this.setDescendents(descendents);


}

