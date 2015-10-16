 
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) { 
    CGFscene.prototype.init.call(this, application);
	this.initCameras();
	this.initLights();

	//este cancro tem que ser alterado
	this.light0=true;
	this.light1=true;
	this.light2=true;
	this.light3=true;
	this.light4=true;
	this.light5=true;
	this.light6=true;
	this.light7=true;

	this.enableTextures(true);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.defaultAppearance = new CGFappearance(this);

	
    this.materials = new Array();
    this.textures = new Array();
    this.leaves = new Array();
    

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {};

XMLscene.prototype.initCameras = function () {

    this.camera = new CGFcamera(0.4, 1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
	this.defaultAppearance.setAmbient(1, 0, 0, 1);
	this.defaultAppearance.setDiffuse(1, 0, 0, 1);
	this.defaultAppearance.setSpecular(1, 0, 0, 1);
	this.defaultAppearance.setEmission(1, 0, 0, 1);
	this.defaultAppearance.setShininess(2);
};

XMLscene.prototype.onGraphLoaded = function () {
	this.loadInitials();
	this.loadIllumination();
	this.loadLights();
};

XMLscene.prototype.loadInitials = function () {
    this.camera.near = this.graph.LSXinitials.frustum.near;
    this.camera.far = this.graph.LSXinitials.frustum.far;
    this.axis= new CGFaxis(this,this.graph.LSXinitials.refLength);
};   

XMLscene.prototype.loadIllumination = function() {
	this.setGlobalAmbientLight(this.graph.LSXillumination.ambient[0],this.graph.LSXillumination.ambient[1],this.graph.LSXillumination.ambient[2],this.graph.LSXillumination.ambient[3]);
	this.gl.clearColor(this.graph.LSXillumination.background[0],this.graph.LSXillumination.background[1],this.graph.LSXillumination.background[2],this.graph.LSXillumination.background[3]);
};

XMLscene.prototype.loadLights = function (){

	this.shader.bind(); 

	this.lights = this.graph.XMLlights;
	var i;
	for(i = 0; i < this.lights.length;i++){ 
		if(this.lights[i] instanceof Light)  
		{
			this.lights[i].setVisible(true); // isto está certo? :/ é para todas que temos de por visible?
		}
	}

    this.updateLights();  

	this.shader.unbind(); 
};

XMLscene.prototype.updateLights = function (){
	var i;
	for(i = 0; i < this.lights.length ;i++){
		if(this.lights[i] instanceof Light)
			this.lights[i].update();
	}
};

XMLscene.prototype.reloadScene = function () {
	this.pushMatrix();

	if(this.graph.LSXinitials.refLength > 0)
		this.axis.display();

	this.multMatrix(this.graph.LSXinitials.transMatrix);

    this.defaultAppearance.apply();

	var root = this.graph.rootID;
	this.loadNode(root, 'default', 'clear');
	this.popMatrix();
}; 

XMLscene.prototype.loadNode = function (node_id, materialID, textureID) {
	
	var i,newNode;
	
	newNode = this.getNode(node_id);
	
	if(newNode==null){
		console.log("The node is null!! " + node_id);
		return;
	}
	this.pushMatrix();
	this.multMatrix(newNode.matrix);

	var newMaterialID = materialID;
	var newTextureID = textureID;
	
	
	if(newNode.material == 'clear')
		newMaterialID = 'default';
	else if(newNode.material != 'null')
		newMaterialID = newNode.material;

	if(newNode.texture == 'clear')
		newTextureID = 'clear';
	else if(newNode.texture != 'null')
		newTextureID = newNode.texture;

	
	for(i = 0; i < newNode.getDescendents().length; i++){
		
		var desc_id = newNode.getDescendents()[i];
		
		var l = this.getLeaf(desc_id);
		if(l != null)
			this.displayLeaf(l['object'], newMaterialID, newTextureID);
		else
			this.loadNode(desc_id, newMaterialID, newTextureID);

	}

	this.popMatrix();
};

XMLscene.prototype.getLeaf = function (nodeId){

	for(i = 0; i < this.leaves.length;i++){
		if(this.leaves[i]['id'] == nodeId)
			return this.leaves[i];
	}
	return null
};

XMLscene.prototype.getNode = function (nodeId){

	for(i = 0; i < this.graph.XMLnodes.length;i++){
		if(this.graph.XMLnodes[i].getNodeID() == nodeId)
			return this.graph.XMLnodes[i];
	}
	return null
};

XMLscene.prototype.displayLeaf = function(object, materialID, textureID) {
	this.applyMaterial(materialID);
	var amp = this.applyTexture(textureID);

	if(textureID == 'clear')
		object.updateTextCoords(1, 1);
	else
		object.updateTextCoords(amp[0], amp[1]);
	
	object.display();
};

XMLscene.prototype.applyMaterial = function(materialID) {
	var i;

	if(materialID == 'default')
		this.defaultAppearance.apply();

	for(i = 0; i < this.materials.length; i++) {
		if(this.materials[i].id == materialID)
		{
			this.materials[i].apply();
			break;
		}
	}
};

XMLscene.prototype.applyTexture = function(textureID) {
	var i;

	for(i = 0; i < this.textures.length; i++) {
		if(this.textures[i].id == textureID)
		{
			this.textures[i].apply();
			return [this.textures[i].amplifyFactor.ampS, this.textures[i].amplifyFactor.ampT];
		}
	}
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
	this.loadIdentity();
	this.applyViewMatrix();

	// Draw axis

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it


    //this.setDefaultAppearance();

	if (this.graph.loadedOk)
	{
		this.updateLights();
		this.reloadScene();
	}
	
	

	this.shader.unbind(); 
};








