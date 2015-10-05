
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

    this.rectangle = new MyRectangle(this, 0,0,0,0);
    this.cylinder = new MyCylinder(this, 30, 1);
    this.sphere = new MySphere(this, 30, 30);

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

    //this.graph.translate(this.graph.XMLInitials['translate_X'],this.graph.XMLInitials['translate_Y'],this.graph.XMLInitials['translate_Z']);
    //this.graph.scene.rotate((Math.PI/180)*this.graph.XMLInitials['rotate_X'],1,0,0);
    //this.graph.scene.rotate((Math.PI/180)*this.graph.XMLInitials['rotate_Y'],0,1,0);
    //this.graph.scene.rotate((Math.PI/180)*this.graph.XMLInitials['rotate_Z'],1,0,1);
    //this.graph.scene.scale(this.graph.XMLInitials['scale_X'],this.graph.XMLInitials['scale_Y'],this.graph.XMLInitials['scale_Z']);
}; 

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

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	
	this.reloadCameras();
	this.reloadScene(); // tem  de estar no display!!
	this.reloadAxis(); 
	this.reloadLights(); 
	

};

XMLscene.prototype.updateLights = function ()
{
	var i;
	for(i = 0; i < this.lights.length ;i++){
		if(this.lights[i] instanceof Light)  
		{
			if(this.lights[i].enabled)
				this.lights[i].enable;
			else
				this.lights[i].disable;

			this.lights[i].update();
		}
	}
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
	// Apply transformations corresponding to the camera position relative to the origin
	//this.translate(this.graph.XMLinitials['translate_X'],this.graph.XMLinitials['translate_Y'],this.graph.XMLinitials['translate_Z']);
	//
	this.applyViewMatrix();
	

	// Draw axis
	
	this.axis.display();

	this.reloadAppearance();
	
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it

	
	//this.rectangle.display();
	//this.cylinder.display();
	this.sphere.display();

	if (this.graph.loadedOk)
	{
		this.updateLights();
		this.reloadScene();
	}
	
	

	this.shader.unbind(); 
};
