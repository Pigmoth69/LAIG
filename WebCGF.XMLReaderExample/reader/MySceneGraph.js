
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.XMLLights = [];
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseElements(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseElements= function(rootElement) {

	var elems = rootElement.getElementsByTagName('SCENE');
	if(elems == null) {
		return "SCENE tag ig missing";
	}

	if((elems = this.parseGlobalsExample(rootElement)) != 0)
		return elems;

	if((elems = this.parseInitials(rootElement)) != 0)
		return elems;

	if((elems = this.parseIllumination(rootElement)) != 0)
		return elems;

	if((elems = this.parseLights(rootElement)) != 0)
		return elems;

/*	if((elems = this.parseTextures(rootElement)) != 0)
		return elems;

	if((elems = this.parseMaterials(rootElement)) != 0)
		return elems;
*/
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	if (rootElement.getElementsByTagName('GLOBALS') == null) {
		return "GLOBALS element is missing.";
	}

	var elems = rootElement.getElementsByTagName('initials');
	if(elems == null){
		return "initials element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.  " + elems.length;
	}


	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	console.log("back colors read: " + this.background[0] + " + " + this.background[1] );
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	return 0;
};

MySceneGraph.prototype.parseInitials= function(rootElement) {

	if(rootElement.getElementsByTagName('INITIALS') == null){
		return "INITIALS element is missing.";
	}

	//var info = rootElement.getElementsByTagName('frustum');
	var frustum = (rootElement.getElementsByTagName('frustum'))[0];
	if(frustum == null) {
		return "frustum tag is missing.";
	}
	
	info = rootElement.getElementsByTagName('translate');
	var translate = info[0];
	if(translate == null) {
		return "translate tag is missing.";
	}
	
	info = rootElement.getElementsByTagName('rotation');
	if(info == null){
		return "rotation tag is missing.";
	}
	else if(info.length != 3){
		return "either zero or more than 3 elements for rotation.";
	}
	var rotationX, rotationY, rotationZ, i;
	for(i = 0; i < 3; i++)
		if(this.reader.getString(info[i], 'axis', 1) == 'x')
			rotationX = info[i];
		else if(this.reader.getString(info[i], 'axis', 1) == 'y')
			rotationY = info[i];
		else if(this.reader.getString(info[i], 'axis', 1) == 'z')
			rotationZ = info[i];

	info = null;
	info = rootElement.getElementsByTagName('scale');
	if(info == null){
		return "scale tag is missing.";
	}
	var scale = info[0];

	info = rootElement.getElementsByTagName('reference');
	if(info == null){
		return "reference tag is missing.";
	}
	var reference = info[0];

	//this.scene.camera.setPosition(vec3.fromValues(5, 5, 5));
	//this.scene.camera.orbit(vec3.fromValues(0, 1, 0), 0.75);

	console.log("frustum: " + this.reader.getInteger(frustum, 'near', 1) + ", " + this.reader.getInteger(frustum, 'far', 1));
	console.log("translate: " + this.reader.getInteger(translate, 'x', 1) + ", " + this.reader.getInteger(translate, 'y', 1) + ", " + this.reader.getInteger(translate, 'z', 1));
	console.log("rotation: " + this.reader.getInteger(rotationX, 'angle', 1) + ", " + this.reader.getInteger(rotationY, 'angle', 1) + ", " + this.reader.getInteger(rotationZ, 'angle', 1))
	console.log("scale: " + this.reader.getInteger(scale, 'sx', 1) + ", " + this.reader.getInteger(scale, 'sy', 1) + ", " + this.reader.getInteger(scale, 'sz', 1));
	console.log("reference: " + this.reader.getInteger(reference, 'length', 1));
	
	return 0;
};

MySceneGraph.prototype.parseIllumination= function(rootElement) {

	if(rootElement.getElementsByTagName('ILLUMINATION') == null) {
		return "ILLUMINATION tag is missing.";
	}

	var info = rootElement.getElementsByTagName('ambient');
	var ambient = info[0];
	if(ambient == null){
		return "ambient tag is missing.";
	}

	info = rootElement.getElementsByTagName('doubleside');
	var doubleside = info[0];
	if(doubleside == null){
		return "doubleside tag is missing.";
	}

	info = rootElement.getElementsByTagName('background');
	var background = info[0];
	if(background == null){
		return "background tag is missing";
	}

	console.log("ambient : " + this.reader.getInteger(ambient, 'r', 1) + ", " + this.reader.getInteger(ambient, 'g', 1) + ", " + this.reader.getInteger(ambient, 'b', 1) + this.reader.getInteger(ambient, 'a', 1));
	console.log("doubleside: " + this.reader.getInteger(doubleside, 'value', 1));
	console.log("background : " + this.reader.getInteger(background, 'r', 1) + ", " + this.reader.getInteger(background, 'g', 1) + ", " + this.reader.getInteger(background, 'b', 1) + this.reader.getInteger(background, 'a', 1));

	return 0;
};	
	
/*
 * var to be executed on any read error
 */
 
MySceneGraph.prototype.parseLights= function(rootElement) {
	if(rootElement.getElementsByTagName('LIGHTS') == null) {
		return "LIGHTS tag is missing.";
	}

	var info = rootElement.getElementsByTagName('LIGHT');
	if(info[0] == null){
		return "No LIGHT was added.";
	}
	
	var light = [];
	
	var i, values;
	for(i=0; i < info.length; i++) {
				
		light['id'] = this.reader.getString(info[i], 'id', 1);
		
		values = info[i].getElementsByTagName('enable')
		light['enable'] = this.reader.getBoolean(values[0], 'value', 1);
		
		values = info[i].getElementsByTagName('position');
		light['position'] = [this.reader.getFloat(values[0], 'x', 1),this.reader.getFloat(values[0], 'y', 1),this.reader.getFloat(values[0], 'z', 1),this.reader.getFloat(values[0], 'w', 1)];
		
		values = info[i].getElementsByTagName('ambient');
		light['ambient'] = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
				
		values = info[i].getElementsByTagName('diffuse');
		light['diffuse'] = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
		
		values = info[i].getElementsByTagName('specular');
		light['specular'] = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];


		this.XMLLights.push(light);  
		//console.log(light);

		/*
		this.scene.lights[i].setPosition(light['position'][0], light['position'][1], light['position'][2], light['position'][3]);
		this.scene.lights[i].setDiffuse(light['diffuse'][0], light['diffuse'][1], light['diffuse'][2], light['diffuse'][3]);
		this.scene.lights[i].setSpecular(light['specular'][0], light['specular'][1], light['specular'][2], light['specular'][3]);
		this.scene.lights[i].setAmbient(light['ambient'][0], light['ambient'][1], light['ambient'][2], light['ambient'][3]);
		*/	
	}	
	return 0;
};


MySceneGraph.prototype.parseTextures= function(rootElement) {
return 0;
};

MySceneGraph.prototype.parseMeterials= function(rootElement) {
return 0;
};

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


