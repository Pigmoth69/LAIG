 
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
    this.matrix = mat4.create();

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


XMLscene.prototype.onGraphLoaded = function () 
{
	this.loadInitials();
	this.loadIllumination();
	this.loadLights(); 
	this.loadLeaves();
};

XMLscene.prototype.loadInitials = function () {
    this.camera.near = this.graph.XMLinitials['frustum_NEAR'];
    this.camera.far = this.graph.XMLinitials['frustum_FAR'];

	mat4.translate(this.matrix, this.matrix, [this.graph.XMLinitials['translation_X'], this.graph.XMLinitials['translation_Y'], this.graph.XMLinitials['translation_Z']]);
	mat4.rotate(this.matrix, this.matrix, this.graph.XMLinitials['rotation_X']*Math.PI/180, [1,0,0]);
	mat4.rotate(this.matrix, this.matrix, this.graph.XMLinitials['rotation_Y']*Math.PI/180, [0,1,0]);
	mat4.rotate(this.matrix, this.matrix, this.graph.XMLinitials['rotation_Z']*Math.PI/180, [0,0,1]);
	mat4.scale(this.matrix, this.matrix, [this.graph.XMLinitials['scale_X'], this.graph.XMLinitials['scale_Y'], this.graph.XMLinitials['scale_Z']]);

    this.axis= new CGFaxis(this,this.graph.XMLinitials['reference']);
};   

XMLscene.prototype.loadIllumination = function() {
	this.setAmbient(this.graph.XMLillumination['ambient_R'],this.graph.XMLillumination['ambient_G'],this.graph.XMLillumination['ambient_B'],this.graph.XMLillumination['ambient_A']);
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
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

XMLscene.prototype.loadLeaves = function (){
	var i;
	for(i = 0; i < this.graph.XMLleaves.length; i++){

		var object = [];

			if(this.graph.XMLleaves[i]['type'] == "rectangle"){
				object['id'] = this.graph.XMLleaves[i]['id'];
				object['object'] = new MyRectangle(this, this.graph.XMLleaves[i]['args']);
			}
			else if(this.graph.XMLleaves[i]['type'] == "sphere") {
				object['id'] = this.graph.XMLleaves[i]['id'];
				object['object'] = new MySphere(this, this.graph.XMLleaves[i]['args']);
			}
			else if(this.graph.XMLleaves[i]['type'] == "cylinder"){
				object['id'] = this.graph.XMLleaves[i]['id'];
				object['object'] = new MyCylinder(this, this.graph.XMLleaves[i]['args']);
			}
			else if(this.graph.XMLleaves[i]['type'] == "triangle"){
				object['id'] = this.graph.XMLleaves[i]['id'];
				object['object'] = new MyTriangle(this, this.graph.XMLleaves[i]['args']);
			}
			
			this.leaves.push(object);
		} 
};

XMLscene.prototype.reloadScene = function () {
	this.pushMatrix();

	if(this.graph.XMLinitials['reference'] > 0)
		this.axis.display();

	this.multMatrix(this.matrix);

    this.defaultAppearance.apply();

	var root = this.graph.rootID;
	this.loadNode(root);
	this.popMatrix();
}; 

XMLscene.prototype.loadNode = function (node_id) {
	
	var i,newNode;
	
	newNode = this.getNode(node_id);
	
	if(newNode==null){
		console.log("The node is null!! " + node_id);
		return;
	}
	this.pushMatrix();
	this.multMatrix(newNode.matrix);

	if(newNode.material['id'] != 'none' || newNode.material['id'] != 'null')
		this.applyMaterial(newNode.material);

	if(newNode.texture['id'] != 'none' || newNode.texture['id'] != 'null')
		this.applyTexture(newNode.texture);
	
	for(i = 0; i < newNode.getDescendents().length; i++){
		
		var desc_id = newNode.getDescendents()[i];
		
		var l = this.getLeaf(desc_id);
		if(l != null)
			l['object'].display();
		else
			this.loadNode(desc_id);

	}

	this.popMatrix();
};

XMLscene.prototype.getLeaf = function (nodeId){

	for(i = 0; i < this.graph.XMLleaves.length;i++){
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

XMLscene.prototype.applyMaterial = function(materialID) {
	var i;
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
		if(this.textures[i]['id'] == textureID)
		{
			this.textures[i]['texture'].apply();
			break;
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








