
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) { 
    CGFscene.prototype.init.call(this, application);
	this.initCameras();
	this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.materials = [];
    var textures = [];

    this.rectangle = null;
    this.cylinder = null;
    this.sphere = null;
    this.triangle = null;


	this.axis=new CGFaxis(this);
	
};


XMLscene.prototype.initLights = function () {

    this.shader.bind();
    
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
 
    this.shader.unbind();
};

XMLscene.prototype.reloadLights = function () {

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

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
}; 

//alterar!!! 
XMLscene.prototype.reloadCameras = function () {

// FALTA AQUI O setActiveCamera(camera) é preciso guardar a application
    this.camera.near = this.graph.XMLinitials['frustum_NEAR'];
    this.camera.far = this.graph.XMLinitials['frustum_FAR'];

   

};   

//alterar!!!
XMLscene.prototype.reloadScene = function () {

	var root = this.graph.rootID;
	this.loadNode(root);
 }; 

 XMLscene.prototype.loadNode = function (node_id) {
 	this.pushMatrix();

 	var i,newNode;
 	
 	newNode = this.getNode(node_id);
 	
 	if(newNode==null){
 		console.log("The node is null!!");
 		return;
 	}

 	this.multMatrix(newNode.matrix);
 	//console.log(newNode.matrix);

 	for(i = 0; i < newNode.getDescendents().length;i++){
 		
 		var desc_id = newNode.getDescendents()[i];
 		var desc_node = this.getNode(desc_id);
 		

 		var l = this.getLeaf(desc_id);
 		if(l!= null){
 			if(l['type'] == 'rectangle'){
 				this.rectangle.display();
 			}else if(l['type'] == 'cylinder'){
 				this.cylinder.display();
 			}else if(l['type'] == 'sphere'){
 				this.sphere.display();
 			}else if(l['type'] == 'triangle'){
 				this.triangle.display();
 			}else
 				return "ERROR ON THE LEAFT!!";
 		}else
 			this.loadNode(newNode.getDescendents()[i]);

 	}

 	this.popMatrix();
 }

//alterar!!!
XMLscene.prototype.reloadAxis = function () {
    this.axis= new CGFaxis(this,this.graph.XMLinitials['reference']);
}; 


XMLscene.prototype.setDefaultAppearance = function () {

    this.setAmbient(0 , 0 , 1, 1.0);
    this.setDiffuse(0 , 0 , 1, 1.0);
    this.setSpecular(0 , 0 , 1, 1.0); 
    this.setShininess(10.0);	
};

XMLscene.prototype.reloadAppearance = function () {

	if(this.graph.loadedOk){
		this.setAmbient(this.graph.XMLillumination['ambient_R'],this.graph.XMLillumination['ambient_G'],this.graph.XMLillumination['ambient_B'],this.graph.XMLillumination['ambient_A']);
    }else{
    	this.setDefaultAppearance();
    }	 
};

XMLscene.prototype.reloadLeaves = function () {
	var i;

	for(i = 0; i < this.graph.XMLleaves.length; i++){
		if(this.graph.XMLleaves[i]['type'] == "rectangle")
			this.rectangle = new MyRectangle(this, this.graph.XMLleaves[i]['args']);
		else if(this.graph.XMLleaves[i]['type'] == "sphere") 
			this.sphere = new MySphere(this, this.graph.XMLleaves[i]['args']);
		else if(this.graph.XMLleaves[i]['type'] == "cylinder")
			this.cylinder = new MyCylinder(this, this.graph.XMLleaves[i]['args']);
		else if(this.graph.XMLleaves[i]['type'] == "triangle")
			this.triangle = new MyTriangle(this, this.graph.XMLleaves[i]['args']);
		} 
 

};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);

	this.reloadCameras();
	this.reloadLeaves();
	this.reloadAxis(); 
	this.reloadLights(); 
	

};

XMLscene.prototype.updateLights = function ()
{
	var i;
	for(i = 0; i < this.lights.length ;i++){
		if(this.lights[i] instanceof Light)
			this.lights[i].update();
	}
}

XMLscene.prototype.getLeaf = function (nodeId){

	for(i = 0; i < this.graph.XMLleaves.length;i++){
		if(this.graph.XMLleaves[i]['id'] == nodeId)
			return this.graph.XMLleaves[i];
	}
	return null
}

XMLscene.prototype.getNode = function (nodeId){

	for(i = 0; i < this.graph.XMLnodes.length;i++){
		if(this.graph.XMLnodes[i].getNodeID() == nodeId)
			return this.graph.XMLnodes[i];
	}
	return null
}

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation


	this.updateProjectionMatrix();
	this.loadIdentity();


	//inicio
	var matrix = mat4.create();
    mat4.identity(matrix);

	mat4.translate(matrix, matrix, [this.graph.XMLinitials['translation_X'], this.graph.XMLinitials['translation_Y'], this.graph.XMLinitials['translation_Z']]);
	
	mat4.rotate(matrix, matrix, this.graph.XMLinitials['rotation_X']*Math.PI/180, [1,0,0]);
	mat4.rotate(matrix, matrix, this.graph.XMLinitials['rotation_Y']*Math.PI/180, [0,1,0]);
	mat4.rotate(matrix, matrix, this.graph.XMLinitials['rotation_Z']*Math.PI/180, [0,0,1]);

	mat4.scale(matrix, matrix, [this.graph.XMLinitials['scale_X'], this.graph.XMLinitials['scale_Y'], this.graph.XMLinitials['scale_Z']]);


	this.multMatrix(matrix);
	//fim


	this.applyViewMatrix();
	

	// Draw axis
	
	this.axis.display();

	this.reloadAppearance();

	
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it


	if (this.graph.loadedOk)
	{
		this.updateLights();
		this.reloadScene();
	}
	
	

	this.shader.unbind(); 
};
