
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
	
	this.rootID = null; 
	this.XMLinitials = [];
	this.XMLillumination = [];
	this.XMLlights = new Array(this.scene.lights.length); 
	this.XMLtextures = [];
	this.XMLmaterials = [];
	this.XMLleaves = [];
	this.XMLnodes = [];

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

	if((elems = this.parseLeaves(rootElement)) != 0)
		return elems;

	if((elems = this.parseNodes(rootElement)) != 0)
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
	
	var i;
	for(i=0; i < info.length; i++) {
				
		var id = this.reader.getString(info[i], 'id', 1);
		
		var enable = info[i].getElementsByTagName('enable')
		var value = this.reader.getBoolean(enable[0], 'value', 1);
		
		var positionValues = info[i].getElementsByTagName('position');
		var position = [this.reader.getFloat(positionValues[0], 'x', 1),this.reader.getFloat(positionValues[0], 'y', 1),this.reader.getFloat(positionValues[0], 'z', 1),this.reader.getFloat(positionValues[0], 'w', 1)];
		
		var ambientValues = info[i].getElementsByTagName('ambient');
		var ambient= [this.reader.getFloat(ambientValues[0], 'r', 1), this.reader.getFloat(ambientValues[0], 'g', 1), this.reader.getFloat(ambientValues[0], 'b', 1), this.reader.getFloat(ambientValues[0], 'a', 1)];
				
		var diffuseValues = info[i].getElementsByTagName('diffuse');
		var diffuse = [this.reader.getFloat(diffuseValues[0], 'r', 1), this.reader.getFloat(diffuseValues[0], 'g', 1), this.reader.getFloat(diffuseValues[0], 'b', 1), this.reader.getFloat(diffuseValues[0], 'a', 1)];
		
		var specularValues = info[i].getElementsByTagName('specular');
		var specular = [this.reader.getFloat(specularValues[0], 'r', 1), this.reader.getFloat(specularValues[0], 'g', 1), this.reader.getFloat(specularValues[0], 'b', 1), this.reader.getFloat(specularValues[0], 'a', 1)];


		this.XMLlights[i] = new Light(this.scene,i,id,value,position,ambient,diffuse,specular);
	}	
	return 0;
};

MySceneGraph.prototype.parseTextures= function(rootElement) {
	var info;
	if((info=rootElement.getElementsByTagName('TEXTURES')) == null) {
		return "TEXTURES tag is missing.";
	}

	info = info[0].getElementsByTagName('TEXTURE');
	if(info[0] == null) {
		return "No TEXTURE was added.";
	}

	var texture = [];
	var i;

	for(i = 0; i < info.length; i++) {
		texture['id'] = this.reader.getString(info[i], 'id', 1);

		var file = info[i].getElementsByTagName('file');
		texture['path'] = this.reader.getString(file[0], 'path', 1);

		var amplif_factor = info[i].getElementsByTagName('amplif_factor');
		texture['amplif_factor'] = [this.reader.getFloat(amplif_factor[0], 's', 1), this.reader.getFloat(amplif_factor[0], 't', 1)];
	
		this.XMLtextures.push(texture);

	}


	return 0;
};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	var info;
	if((info=rootElement.getElementsByTagName('MATERIALS')) == null) {
	return "MATERIALS tag is missing.";
	}

	info = info[0].getElementsByTagName('MATERIAL');
	if(info[0] == null) {
		return "No MATERIAL was added.";
	}

	var material = [];
	var i;

	for(i = 0; i < info.length; i++) {
		material['id'] = this.reader.getString(info[i], 'id', 1);
		console.log(material['id']);

		var shininess = info[i].getElementsByTagName('shininess');
		material['shininess'] = this.reader.getFloat(shininess[0], 'value', 1);

		var specular = info[i].getElementsByTagName('specular');
		material['specular'] = [this.reader.getFloat(specular[0], 'r', 1), this.reader.getFloat(specular[0], 'g', 1), this.reader.getFloat(specular[0], 'b', 1), this.reader.getFloat(specular[0], 'a', 1)];
	
		var diffuse = info[i].getElementsByTagName('diffuse');
		material['diffuse'] = [this.reader.getFloat(diffuse[0], 'r', 1), this.reader.getFloat(diffuse[0], 'g', 1), this.reader.getFloat(diffuse[0], 'b', 1), this.reader.getFloat(diffuse[0], 'a', 1)];
	
		var ambient = info[i].getElementsByTagName('ambient');
		material['ambient'] = [this.reader.getFloat(ambient[0], 'r', 1), this.reader.getFloat(ambient[0], 'g', 1), this.reader.getFloat(ambient[0], 'b', 1), this.reader.getFloat(ambient[0], 'a', 1)];
	
		var emission = info[i].getElementsByTagName('emission');
		material['emission'] = [this.reader.getFloat(emission[0], 'r', 1), this.reader.getFloat(emission[0], 'g', 1), this.reader.getFloat(emission[0], 'b', 1), this.reader.getFloat(emission[0], 'a', 1)];
	
		this.XMLmaterials.push(material);
	}

	return 0;
};

MySceneGraph.prototype.parseLeaves= function(rootElement) {
	var info;
	if((info = rootElement.getElementsByTagName('LEAVES')) == null){
		return "LEAVES tag is missing.";
	}

	var leaves = info[0].getElementsByTagName('LEAF');
	if(leaves[0] == null){
		return "No LEAF was added.";
	}

	
	var i;

	for(i = 0; i < leaves.length; i++){
		var leaf = [];
		leaf['id'] = this.reader.getString(leaves[i], 'id', 1);
		leaf['type'] = this.reader.getString(leaves[i], 'type', 1);
		leaf['args'] = this.getArgs(leaves[i], 'args', 1);

		this.XMLleaves.push(leaf);
	}

};

MySceneGraph.prototype.parseNodes= function(rootElement) {
	var info;
	if((info = rootElement.getElementsByTagName('NODES')) == null){
		return "NODES tag is missing.";
	}

	var root = info.getElementsByTagName('ROOT');
	if(root[0] == null){
		return "ROOT tag is missing.";
	}
	this.rootID = root[0];

	var nodes = info.getElementsByTagName('NODE');
	if(nodes[0] == null){
		return "No NODE was added.";
	}

	var i, node = [];
	for(i = 0; i < nodes.length; i++){
		node['id'] = this.reader.getString(nodes[i], 'id', 1);
		
		var materialID = nodes[i].getElementsByTagName('MATERIAL');
		node['materialID'] = this.reader.getString(materialID, 'id', 1);

		var textureID = nodes[i].getElementsByTagName('TEXTURE');
		node['textureID'] = this.reader.getString(textureID, 'id', 1);

		var materialID = nodes[i].getElementsByTagName('MATERIAL');
		node['materialID'] = this.reader.getString(materialID, 'id', 1);

		console.log(node[i]);
	}

};

MySceneGraph.prototype.getArgs = function(a, b, c) {
    if (c == undefined) c = true;
    if (a == null) {
        console.error("element is null.");
        return null;
    }
    if (b == null) {
        console.error("args attribute name is null.");
        return null;
    }
    var d = a.getAttribute(b);
    if (d == null) {
        if (c) console.error(" is null for attribute " + b + ".");
        return null;
    }
    var e = d.split(' ');
    var f = new Array();
    for (var g = 0; g < e.length; g++) {
    	if(e[g] != "")
    		f.push(parseFloat(e[g]));

    }
    return f;
};

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


