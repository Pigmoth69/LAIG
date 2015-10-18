function LSXscene(application) {
    CGFscene.call(this);
}

LSXscene.prototype = Object.create(CGFscene.prototype);
LSXscene.prototype.constructor = LSXscene;

LSXscene.prototype.init = function (application) { 
    CGFscene.prototype.init.call(this, application);
	this.initCameras();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);

	this.graph = new Graph();

};


LSXscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

LSXscene.prototype.setDefaultAppearance = function () {
   	this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

LSXscene.prototype.onGraphLoaded = function () {
	this.loadInitials();
	this.loadIllumination();
	this.loadLights();
};

LSXscene.prototype.loadInitials = function () {
    this.camera.near = this.graph.initials.frustum.near;
    this.camera.far = this.graph.initials.frustum.far;
    this.axis = new CGFaxis(this,this.graph.initials.refLength);
};   

LSXscene.prototype.loadIllumination = function() {
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);
	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
};

LSXscene.prototype.loadLights = function (){
	for(var i = 0; i < this.graph.lights.length; ++i) {
		this.lights[i] = this.graph.lights[i];;
	}
};

LSXscene.prototype.updateLights = function (){
	for(var i = 0; i < this.graph.lights.length; i++){
		if(this.graph.lights[i].enabled)
			this.lights[i].enable();
		else this.lights[i].disable();

		this.lights[i].update();
	}
};

LSXscene.prototype.displayScene = function () {
	this.drawNode(this.graph.rootID, 'null', 'clear');
	this.setDefaultAppearance();
}; 

LSXscene.prototype.drawNode = function (node, materialID, textureID) {
	if (node in this.graph.leaves) {
		if (materialID != "null")
			this.graph.materials[materialID].apply();
		else
			this.setDefaultAppearance();

		var texture = null;

		if (textureID != "clear")
		{
			texture = this.graph.textures[textureID];
			this.graph.leaves[node].updateTextCoords(texture.amplifyFactor.ampS, texture.amplifyFactor.ampT);
			texture.bind();
		}

		this.graph.leaves[node].display();

		if (texture != null)
			texture.unbind();
		
		return;
	}

	this.pushMatrix();
	this.multMatrix(this.graph.nodes[node].matrix);
	var material = this.graph.nodes[node].material;
	if (material == "null")
		material = materialID;

	var texture = this.graph.nodes[node].texture;
	if (texture == "null")
		texture = textureID;

	var descendants = this.graph.nodes[node].descendants;
	for (var i = 0; i < descendants.length; ++i) {
		this.drawNode(descendants[i], material, texture);
	}

	this.popMatrix();
};


LSXscene.prototype.display = function () {

    this.shader.bind();
	
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();
	this.loadIdentity();
	this.applyViewMatrix();

	if (this.LSXreader.loadedOk)
	{
		this.multMatrix(this.graph.initials.transMatrix);	
		
		if(this.graph.initials.refLength > 0)
			this.axis.display();
		
		this.updateLights();
		this.displayScene();
	}
	
	this.shader.unbind(); 
};