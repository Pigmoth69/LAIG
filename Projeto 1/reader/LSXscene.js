 
function LSXscene() {
    CGFscene.call(this);
}

LSXscene.prototype = Object.create(CGFscene.prototype);
LSXscene.prototype.constructor = LSXscene;

LSXscene.prototype.init = function (application) { 
    CGFscene.prototype.init.call(this, application);
	this.initCameras();
	this.initLights();

	this.enableTextures(true);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.graph = new Graph();

	this.axis=new CGFaxis(this);
};

LSXscene.prototype.initLights = function () {};

LSXscene.prototype.initCameras = function () {

    this.camera = new CGFcamera(0.4, 1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

LSXscene.prototype.setDefaultAppearance = function () {
	this.setAmbient(1, 1, 1, 1);
	this.setDiffuse(1, 1, 1, 1);
	this.setSpecular(1, 1, 1, 1);
	this.setEmission(0, 0, 0, 1);
	this.setShininess(10);
};

LSXscene.prototype.onGraphLoaded = function () {
	this.loadInitials();
	this.loadIllumination();
	this.loadLights();
};

LSXscene.prototype.loadInitials = function () {
    this.camera.near = this.graph.LSXinitials.frustum.near;
    this.camera.far = this.graph.LSXinitials.frustum.far;
    this.axis= new CGFaxis(this,this.graph.LSXinitials.refLength);
};   

LSXscene.prototype.loadIllumination = function() {
	this.setGlobalAmbientLight(this.graph.LSXillumination.ambient[0],this.graph.LSXillumination.ambient[1],this.graph.LSXillumination.ambient[2],this.graph.LSXillumination.ambient[3]);
	this.gl.clearColor(this.graph.LSXillumination.background[0],this.graph.LSXillumination.background[1],this.graph.LSXillumination.background[2],this.graph.LSXillumination.background[3]);
};

LSXscene.prototype.loadLights = function (){

	this.shader.bind(); 

	var i;
	for(i = 0; i < this.lights.length;i++)
			this.lights[i].setVisible(true); // isto está certo? :/ é para todas que temos de por visible?
	
    this.updateLights();  

	this.shader.unbind(); 
};

LSXscene.prototype.updateLights = function (){
	var i;
	for(i = 0; i < this.graph.LSXlights.length; i++){
		if(this.graph.LSXlights[i].enabled){
			this.lights[this.graph.LSXlights[i].indice].enable();
		}
		else this.lights[this.graph.LSXlights[i].indice].disable();

		this.lights[this.graph.LSXlights[i].indice].update();
	}
};

LSXscene.prototype.reloadScene = function () {
	this.pushMatrix();

	this.loadNode(this.graph.rootID, 'default', 'clear');

	this.popMatrix();
}; 

LSXscene.prototype.loadNode = function (node_id, materialID, textureID) {
	
	var i,newNode;
	
	newNode = this.getNode(node_id);
	
	if(newNode==null){
		console.log("The node is null : " + node_id);
		return;
	}

	this.pushMatrix();

	this.multMatrix(newNode.matrix);

	if(newNode.material == 'clear')
		materialID = 'default';
	else if(newNode.material != 'null')
		materialID = newNode.material;

	if(newNode.texture != 'null')
		textureID = newNode.texture;
	else if (newNode.texture == 'clear')
	{
		this.unbindTexture(textureID);
		textureID = 'clear';
	}

	for(i = 0; i < newNode.getDescendents().length; i++){
		
		var desc_id = newNode.getDescendents()[i];
		
		var l = this.getLeaf(desc_id);
		if(l != null)
			this.displayLeaf(l['object'], materialID, textureID);
		else
			this.loadNode(desc_id, materialID, textureID);
	}

	this.popMatrix();
};

LSXscene.prototype.getLeaf = function (leafId){

	for(i = 0; i < this.graph.leaves.length;i++){
		if(this.graph.leaves[i]['id'] == leafId)
			return this.graph.leaves[i];
	}
	return null
};

LSXscene.prototype.getNode = function (nodeId){

	for(i = 0; i < this.graph.nodes.length;i++){
		if(this.graph.nodes[i].getNodeID() == nodeId)
			return this.graph.nodes[i];
	}
	return null
};

LSXscene.prototype.displayLeaf = function(object, materialID, textureID) {
	this.applyMaterial(materialID);
	
	if(textureID == 'clear')
		object.updateTextCoords(1, 1);
	else {
		var amp = this.applyTexture(textureID);
		object.updateTextCoords(amp[0], amp[1]);
	}

	object.display();
};

LSXscene.prototype.applyMaterial = function(materialID) {
	var i;

	if(materialID == 'default'){
		this.setDefaultAppearance();
		return;
	}

	for(i = 0; i < this.graph.materials.length; i++) {
		if(this.graph.materials[i].id == materialID)
		{
			this.graph.materials[i].apply();
			break;
		}
	}
};

LSXscene.prototype.unbindTexture = function(textureID) {
	var i;

	for(i = 0; i < this.graph.textures.length; i++) {
		if(this.graph.textures[i].id == textureID)
		{
			this.graph.textures[i].unbind();
			break;
		}
	}
};

LSXscene.prototype.applyTexture = function(textureID) {
	var i;

	for(i = 0; i < this.graph.textures.length; i++) {
		if(this.graph.textures[i].id == textureID)
		{
			this.graph.textures[i].bind();
			return [this.graph.textures[i].amplifyFactor.ampS, this.graph.textures[i].amplifyFactor.ampT];
		}
	}
};

LSXscene.prototype.display = function () {

    this.shader.bind();
	
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();
	this.loadIdentity();
	this.applyViewMatrix();

	this.multMatrix(this.graph.LSXinitials.transMatrix);
	
	if(this.graph.LSXinitials.refLength > 0)
		this.axis.display();

	if (this.LSXreader.loadedOk)
	{
		this.reloadScene();
		this.updateLights();
	}
	
	this.shader.unbind(); 
};