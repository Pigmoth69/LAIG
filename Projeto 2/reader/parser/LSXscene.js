var MILLISECONDS_TO_UPDATE = 10;

function LSXscene(application) {
    CGFscene.call(this);
}

LSXscene.prototype = Object.create(CGFscene.prototype);
LSXscene.prototype.constructor = LSXscene;

LSXscene.prototype.init = function (application) { 
    CGFscene.prototype.init.call(this, application);
	this.initCameras();
	this.interface=null;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);

    this.setUpdatePeriod(MILLISECONDS_TO_UPDATE);

    this.terrainShader = new CGFshader(this.gl, "shaders/terrain.vert", "shaders/terrain.frag");
    this.terrainShader.setUniformsValues({heightmap: 1});
	this.terrainShader.setUniformsValues({normScale: 50.0});

    this.defaultAppearance = new CGFappearance(this);
	this.graph = new Graph();
	this.milliseconds = 0;

};


/**	@brief Atribui uma interface a scene
  *	@param interface Interface a ser atribuida
  */
LSXscene.prototype.setInterface = function (interface) {
    this.interface=interface;
};


/**	@brief Inicializa a camara da scene com valores de predefinicao
  */
LSXscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};


/**	@brief Atribui valores de aparência predefinidos a scene
  */
LSXscene.prototype.setDefaultAppearance = function () {
   	this.defaultAppearance.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setShininess(10.0);
};


/** @brief Funcao responsavel pela inicializacao da scene com os valores obtidos do ficheiro .lsx
  */
LSXscene.prototype.onGraphLoaded = function () {
	this.loadInitials();
	this.loadIllumination();
	this.loadLights();
	this.interface.loadInterfaceLigths();
};


/** @brief Altera valores de frustum da camara e cria a estrutura de eixos com as dimensoes obtidas do ficheiro .lsx
  */
LSXscene.prototype.loadInitials = function () {
    this.camera.near = this.graph.initials.frustum.near;
    this.camera.far = this.graph.initials.frustum.far;
    this.axis = new CGFaxis(this,this.graph.initials.refLength);
};   


/** @brief Edita a cor de fundo e a iluminacao ambiente da scene
  */
LSXscene.prototype.loadIllumination = function() {
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);
	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
};


/**	@brief Carrega as luzes da scene com os novos objetos CGFlight obtidos na leitura do ficheiro .lsx . Inicializa tb o array responsavel pelo estado de cada luz.
  */
LSXscene.prototype.loadLights = function (){

	for(var i = 0; i < this.graph.lights.length; ++i) {
		this.graph.lightsStateValue[this.graph.lights[i]._id]=this.graph.lights[i].enabled;
		this.lights[i] = this.graph.lights[i];
		
	}
};


/** @brief Funcao responsavel pelo controlo do estado de cada luz.
  */
LSXscene.prototype.updateLights = function (){
	for(var i = 0; i < this.graph.lights.length; i++){
		if(this.graph.lightsStateValue[this.graph.lights[i]._id])
			this.lights[i].enable();
		else this.lights[i].disable();

		this.lights[i].update();
	}
};


/**	@brief Leitura dos diferentes nodes do grafo obritdo na leitura do ficheiro .lsx .
  * @param node ID do node a ser lido.
  * @param materialID ID do material herdado pelo node antecedente.
  * @param textureID ID da textura herdada pelo node antecedente.
  */
LSXscene.prototype.drawNode = function (node, materialID, textureID) {
	
	//Se o id do node corresponder ao id de uma primitiva, desenha-a
	if (node in this.graph.leaves) {
		this.drawLeaf(node, materialID, textureID);
		return;
	}

	//cria nova entrada na pilha para introduzir novas alteracoes a matriz da Scene e a aparencia a ser representada
	this.pushMatrix();
	this.multMatrix(this.graph.nodes[node].matrix);
	var material = this.graph.nodes[node].material;
	if (material == "null")
		material = materialID;

	var texture = this.graph.nodes[node].texture;
	if (texture == "null")
		texture = textureID;

	if(this.graph.nodes[node].animations.length != 0)
		this.graph.nodes[node].applyAnimations(this);

	var descendants = this.graph.nodes[node].descendants;  // recolha dos descendentes do node em questao
	for (var i = 0; i < descendants.length; ++i) {
		this.drawNode(descendants[i], material, texture);
	}

	this.popMatrix();
};


/**	@brief Funcao responsavel pela aplicacao da aparencia na scene e desenho da primitiva
  * @param leaf ID da primitiva a ser desenhada.
  * @param materialID ID do material a ser aplicado.
  * @param textureID ID da textura a ser aplicada.
  */
LSXscene.prototype.drawLeaf = function (leaf, materialID, textureID) {

	if (materialID != "null") //se o material nao for null, significa que este se encontra na lista de materiais obtidos
		this.graph.materials[materialID].apply();
	else
		this.defaultAppearance.apply();

	if(this.graph.leaves[leaf] instanceof MyTerrain)
	{
		this.graph.textures[this.graph.leaves[leaf].texture].bind();
		this.terrainShader.setUniformsValues({normScale: this.graph.leaves[leaf].normScale});
		this.setActiveShader(this.terrainShader);
		this.graph.textures[this.graph.leaves[leaf].heightmap].bind(1);
		this.graph.leaves[leaf].display();
		this.setActiveShader(this.defaultShader);
		return;
	}
	if(this.graph.leaves[leaf] instanceof MyVehicle){
		this.graph.leaves[leaf].display();
		return;
	}




	var texture = null;
	if (textureID != "clear")  //Se a textura for clear, nenhuma textura sera aplicada na Scene
	{
		texture = this.graph.textures[textureID];
		this.graph.leaves[leaf].updateTextCoords(texture.amplifyFactor.ampS, texture.amplifyFactor.ampT);
		texture.bind(0); 
	}



	this.graph.leaves[leaf].display();

	if(texture != null)
		texture.unbind(0);
};


/**	@brief Atualiza o estado de uma determinada luz apos interacao com a GUI
  * @param lightid Identificacao da luz a ser modificada
  *	@param value Booleano a introduzir no estado da luz pretendida
  */
LSXscene.prototype.updateLightsState = function (lightid,value) {
	for(var i = 0; i < this.graph.lights.length;i++){
		if(this.lights[i] == lightid)
			if(value)
				this.lights[i].enabled=value;
	}
};


/**	@brief Invoca as funcoes essenciais para a apresentacao de cada novo frame da scene
  */
LSXscene.prototype.display = function () {


	//limpa o conteudo do buffer
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //recarrega a matriz de transformacoes da scene
	this.updateProjectionMatrix();
	this.loadIdentity();
	this.applyViewMatrix();

	if (this.LSXreader.loadedOk)
	{
		//aplica noca matriz de transformacoes a scene
		this.multMatrix(this.graph.initials.transMatrix);	
		
		//desenha o referencial caso a sua dimensao for superior a zero unidades
		if(this.graph.initials.refLength > 0)
			this.axis.display();
		
		//atualiza estado das luzes da scene
		this.updateLights();

		//inicializa a leitura e desenho do grafo obtido no ficheiro .lsx
		this.drawNode(this.graph.rootID, 'null', 'clear');
	}
};


LSXscene.prototype.update = function() {
	this.milliseconds += MILLISECONDS_TO_UPDATE;

	for(var i = 0; i < this.graph.animatedNodes.length; i++)
	{
		if(this.graph.nodes[this.graph.animatedNodes[i]])
		{
			this.graph.nodes[node].applyAnimations(this);
		}
	}
};