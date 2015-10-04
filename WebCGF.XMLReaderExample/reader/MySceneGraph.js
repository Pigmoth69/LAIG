
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
	 
	this.XMLinitials = [];
	this.XMLillumination = [];
	this.XMLlights = new Array(this.scene.lights.length); 
	this.XMLtextures = [];
	this.XMLmaterials = [];
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


	if((elems = this.parseInitials(rootElement)) != 0)
		return elems;

	if((elems = this.parseIllumination(rootElement)) != 0)
		return elems;

	if((elems = this.parseLights(rootElement)) != 0)
		return elems;

	if((elems = this.parseTextures(rootElement)) != 0)
		return elems;

	if((elems = this.parseMaterials(rootElement)) != 0)
		return elems;

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

/*
	console.log("frustum: " + this.reader.getInteger(frustum, 'near', 1) + ", " + this.reader.getInteger(frustum, 'far', 1));
	console.log("translate: " + this.reader.getInteger(translate, 'x', 1) + ", " + this.reader.getInteger(translate, 'y', 1) + ", " + this.reader.getInteger(translate, 'z', 1));
	console.log("rotation: " + this.reader.getInteger(rotationX, 'angle', 1) + ", " + this.reader.getInteger(rotationY, 'angle', 1) + ", " + this.reader.getInteger(rotationZ, 'angle', 1))
	console.log("scale: " + this.reader.getInteger(scale, 'sx', 1) + ", " + this.reader.getInteger(scale, 'sy', 1) + ", " + this.reader.getInteger(scale, 'sz', 1));
	console.log("reference: " + this.reader.getInteger(reference, 'length', 1));
	*/

	this.XMLinitials['frustum_NEAR']= this.reader.getInteger(frustum, 'near', 1);
	this.XMLinitials['frustum_FAR'] = this.reader.getInteger(frustum, 'far', 1);

	this.XMLinitials['translate_X']= this.reader.getInteger(translate, 'x', 1) ;
	this.XMLinitials['translate_Y']= this.reader.getInteger(translate, 'y', 1) ;
	this.XMLinitials['translate_Z']= this.reader.getInteger(translate, 'z', 1) ;

	this.XMLinitials['rotation_X']= this.reader.getInteger(rotationX, 'angle', 1);
	this.XMLinitials['rotation_Y']= this.reader.getInteger(rotationY, 'angle', 1);
	this.XMLinitials['rotation_Z']= this.reader.getInteger(rotationZ, 'angle', 1);

	this.XMLinitials['scale_X']= this.reader.getInteger(scale, 'sx', 1);
	this.XMLinitials['scale_Y']= this.reader.getInteger(scale, 'sy', 1);
	this.XMLinitials['scale_Z']= this.reader.getInteger(scale, 'sz', 1);

	this.XMLinitials['reference']= this.reader.getInteger(reference, 'length', 1);



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


	info = rootElement.getElementsByTagName('background');
	var backgroundColor = info[0];
	if(backgroundColor == null){
		return "background tag is missing";
	}

	this.background = [this.reader.getFloat(backgroundColor, 'r', 1), this.reader.getFloat(backgroundColor, 'g', 1), this.reader.getFloat(backgroundColor, 'b', 1), this.reader.getFloat(backgroundColor, 'a', 1)];
	this.XMLillumination['ambient_R']=this.reader.getInteger(ambient, 'r', 1);
	this.XMLillumination['ambient_G']=this.reader.getInteger(ambient, 'g', 1);
	this.XMLillumination['ambient_B']=this.reader.getInteger(ambient, 'b', 1);
	this.XMLillumination['ambient_A']=this.reader.getInteger(ambient, 'a', 1);

/*	console.log("ambient : " + this.reader.getInteger(ambient, 'r', 1) + ", " + this.reader.getInteger(ambient, 'g', 1) + ", " + this.reader.getInteger(ambient, 'b', 1) + this.reader.getInteger(ambient, 'a', 1));
	console.log("background : " + this.reader.getInteger(background, 'r', 1) + ", " + this.reader.getInteger(background, 'g', 1) + ", " + this.reader.getInteger(background, 'b', 1) + this.reader.getInteger(background, 'a', 1));
*/
	return 0;
};	
	
MySceneGraph.prototype.parseLights= function(rootElement) {
	if(rootElement.getElementsByTagName('LIGHTS') == null) {
		return "LIGHTS tag is missing.";
	}

	var info = rootElement.getElementsByTagName('LIGHT');
	if(info[0] == null || info[0]>8){
		return "No LIGHT was added because there are too many lights or 0";
	}
	
	var i, values;
	for(i=0; i < info.length; i++) {
				
		var id = this.reader.getString(info[i], 'id', 1);
		
		values = info[i].getElementsByTagName('enable')
		var enable = this.reader.getBoolean(values[0], 'value', 1);
		
		values = info[i].getElementsByTagName('position');
		var position = [this.reader.getFloat(values[0], 'x', 1),this.reader.getFloat(values[0], 'y', 1),this.reader.getFloat(values[0], 'z', 1),this.reader.getFloat(values[0], 'w', 1)];
		
		values = info[i].getElementsByTagName('ambient');
		var ambient= [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
				
		values = info[i].getElementsByTagName('diffuse');
		var diffuse = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
		
		values = info[i].getElementsByTagName('specular');
		var specular = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];


		this.XMLlights[i] = new Light(this.scene,i,id,enable,position,ambient,diffuse,specular);
	}	
	return 0;
};


MySceneGraph.prototype.parseTextures= function(rootElement) {
	if(rootElement.getElementsByTagName('TEXTURES') == null) {
		return "TEXTURES tag is missing.";
	}

	var info = rootElement.getElementsByTagName('TEXTURE');
	if(info[0] == null) {
		return "No TEXTURE was added.";
	}

	var texture = [];
	var i, values;

	for(i = 0; i < info.length; i++) {
		texture['id'] = this.reader.getString(info[i], 'id', 1);

		values = info[i].getElementsByTagName('file');
		texture['path'] = this.reader.getString(values[0], 'path', 1);

		values = info[i].getElementsByTagName('amplif_factor');
		texture['amplif_factor'] = [this.reader.getFloat(values[0], 's', 1), this.reader.getFloat(values[0], 't', 1)];
	
		this.XMLtextures.push(texture);

		/*console.log(this.XMLTextures[i]['id']);
		console.log(this.XMLTextures[i]['path']);
		console.log(this.XMLTextures[i]['amplif_factor']);*/
	}


	return 0;
};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	if(rootElement.getElementsByTagName('MATERIALS') == null) {
	return "MATERIALS tag is missing.";
	}

	var info = rootElement.getElementsByTagName('MATERIAL');
	if(info[0] == null) {
		return "No MATERIAL was added.";
	}

	var material = [];
	var i, values;

	for(i = 0; i < info.length; i++) {
		material['id'] = this.reader.getString(info[i], 'id', 1);

		values = info[i].getElementsByTagName('shininess');
		material['shininess'] = this.reader.getFloat(values[0], 'value', 1);

		values = info[i].getElementsByTagName('specular');
		material['specular'] = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
	
		values = info[i].getElementsByTagName('diffuse');
		material['diffuse'] = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
	
		values = info[i].getElementsByTagName('ambient');
		material['ambient'] = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
	
		values = info[i].getElementsByTagName('emission');
		material['emission'] = [this.reader.getFloat(values[0], 'r', 1), this.reader.getFloat(values[0], 'g', 1), this.reader.getFloat(values[0], 'b', 1), this.reader.getFloat(values[0], 'a', 1)];
	
		this.XMLmaterials.push(material);

		/*console.log(this.XMLMaterials[i]['id']);
		console.log(this.XMLMaterials[i]['shininess']);
		console.log(this.XMLMaterials[i]['specular']);
		console.log(this.XMLMaterials[i]['diffuse']);
		console.log(this.XMLMaterials[i]['ambient']);
		console.log(this.XMLMaterials[i]['emission']);*/
	}

	return 0;
};

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


