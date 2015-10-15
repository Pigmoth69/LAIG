
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
	
	this.LSXillumination = new Illumination();
	this.XMLlights = new Array(this.scene.lights.length); 
	this.XMLleaves = [];
	this.XMLnodes = [];
	this.LSXinitials = new Initials();
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

	var initials = rootElement.getElementsByTagName('INITIALS');

	if(initials == null){
		return "INITIALS tag is missing.";
	}

	var frustum = initials[0].getElementsByTagName('frustum');
	if(frustum == null) {
		return "frustum tag is missing.";
	}
	
	var translation = initials[0].getElementsByTagName('translation');
	if(translation == null) {
		return "translation tag is missing.";
	}
	
	var rotations = initials[0].getElementsByTagName('rotation');
	if(rotations == null){
		return "rotation tag is missing.";
	}
	else if(rotations.length != 3){
		return "Insuficient info for the scene initial rotation.";
	}

	var rotationX, rotationY, rotationZ, i;
	for(i = 0; i < 3; i++)
		if(this.reader.getString(rotations[i], 'axis', 1) == 'x')
			rotationX = rotations[i]; 
		else if(this.reader.getString(rotations[i], 'axis', 1) == 'y')
			rotationY = rotations[i];
		else if(this.reader.getString(rotations[i], 'axis', 1) == 'z')
			rotationZ = rotations[i];

	var scale = initials[0].getElementsByTagName('scale');
	if(scale == null){
		return "scale tag is missing.";
	}

	var reference = initials[0].getElementsByTagName('reference');
	if(reference == null){
		return "reference tag is missing.";
	}

	var initialFrustum = {
						  near: this.reader.getInteger(frustum[0], 'near', 1),
						  far:  this.reader.getInteger(frustum[0], 'far', 1)
						 };

	var initialTranslation = vec3.fromValues(this.reader.getFloat(translation[0], 'x', 1), 
											 this.reader.getFloat(translation[0], 'y', 1), 
											 this.reader.getFloat(translation[0], 'z', 1));

	rotationX= this.reader.getFloat(rotationX, 'angle', 1);
	rotationY= this.reader.getFloat(rotationY, 'angle', 1);
	rotationZ= this.reader.getFloat(rotationZ, 'angle', 1);

	var initialScale = vec3.fromValues(this.reader.getFloat(scale[0], 'sx', 1), 
									   this.reader.getFloat(scale[0], 'sy', 1), 
									   this.reader.getFloat(scale[0], 'sz', 1));

	var refLength = this.reader.getFloat(reference[0], 'length', 1);


	this.LSXinitials.setFrustum(initialFrustum.near,initialFrustum.far);
	this.LSXinitials.translateMatrix(initialTranslation);
	this.LSXinitials.rotateMatrix('x',rotationX);
	this.LSXinitials.rotateMatrix('y',rotationY);
	this.LSXinitials.rotateMatrix('z',rotationZ);
	this.LSXinitials.scaleMatrix(initialScale);
	this.LSXinitials.setReferenceLength(refLength);

	return 0;
};

MySceneGraph.prototype.parseIllumination= function(rootElement) {

	var illumination = rootElement.getElementsByTagName('ILLUMINATION');

	if(illumination == null) {
		return "ILLUMINATION tag is missing.";
	}

	var ambient = illumination[0].getElementsByTagName('ambient');
	if(ambient == null){
		return "ambient tag is missing.";
	}

	var backgroundColor = illumination[0].getElementsByTagName('background');
	if(backgroundColor == null){
		return "background tag is missing";
	}

	var background = [];
	var globalAmbient = [];	

	background[0] = this.reader.getFloat(backgroundColor[0], 'r', 1);
	background[1] = this.reader.getFloat(backgroundColor[0], 'g', 1);
	background[2] = this.reader.getFloat(backgroundColor[0], 'b', 1);
	background[3] = this.reader.getFloat(backgroundColor[0], 'a', 1);

	globalAmbient[0] = this.reader.getFloat(ambient[0], 'r', 1);;
	globalAmbient[1] = this.reader.getFloat(ambient[0], 'g', 1);;
	globalAmbient[2] = this.reader.getFloat(ambient[0], 'b', 1);
	globalAmbient[3] = this.reader.getFloat(ambient[0], 'a', 1);;

	this.LSXillumination.setBackground(background);
	this.LSXillumination.setAmbient(globalAmbient);

	return 0;
};	
	
MySceneGraph.prototype.parseLights= function(rootElement) {

	var lightsTag = rootElement.getElementsByTagName('LIGHTS');

	if(lightsTag == null) {
		return "LIGHTS tag is missing.";
	}

	var lights = lightsTag[0].getElementsByTagName('LIGHT');
	if(lights.length > 8) {
		return "No LIGHT was added because there are too many lights";
	}
	else if(lights[0] == null) 
	{
		return "No LIGHT was added.";
	}
	
	var i;
	for(i=0; i < lights.length; i++) {
				
		var id = this.reader.getString(lights[i], 'id', 1);
		
		var enable = lights[i].getElementsByTagName('enable');
		var value = this.reader.getBoolean(enable[0], 'value', 1);
		
		var positionValues = lights[i].getElementsByTagName('position');
		var position = [this.reader.getFloat(positionValues[0], 'x', 1),this.reader.getFloat(positionValues[0], 'y', 1),this.reader.getFloat(positionValues[0], 'z', 1),this.reader.getFloat(positionValues[0], 'w', 1)];
		
		var ambientValues = lights[i].getElementsByTagName('ambient');
		var ambient= [this.reader.getFloat(ambientValues[0], 'r', 1), this.reader.getFloat(ambientValues[0], 'g', 1), this.reader.getFloat(ambientValues[0], 'b', 1), this.reader.getFloat(ambientValues[0], 'a', 1)];
				
		var diffuseValues = lights[i].getElementsByTagName('diffuse');
		var diffuse = [this.reader.getFloat(diffuseValues[0], 'r', 1), this.reader.getFloat(diffuseValues[0], 'g', 1), this.reader.getFloat(diffuseValues[0], 'b', 1), this.reader.getFloat(diffuseValues[0], 'a', 1)];
		
		var specularValues = lights[i].getElementsByTagName('specular');
		var specular = [this.reader.getFloat(specularValues[0], 'r', 1), this.reader.getFloat(specularValues[0], 'g', 1), this.reader.getFloat(specularValues[0], 'b', 1), this.reader.getFloat(specularValues[0], 'a', 1)];


		this.XMLlights[i] = new Light(this.scene,i,id,value,position,ambient,diffuse,specular);
	}	

	return 0;
};

MySceneGraph.prototype.parseTextures= function(rootElement) {
	
	var texturesTag = rootElement.getElementsByTagName('TEXTURES');
	
	if(texturesTag == null) {
		return "TEXTURES tag is missing.";
	}

	var textures = texturesTag[0].getElementsByTagName('TEXTURE');
	if(textures == null) {
		return "No texture was added.";
	}

	var textureInfo = [];
	var i;
	for(i = 0; i < textures.length; i++) {

		textureInfo['id'] = this.reader.getString(textures[i], 'id', 1);

		var file = textures[i].getElementsByTagName('file');
		textureInfo['path'] = this.reader.getString(file[0], 'path', 1);
		
		var amplif_factor = textures[i].getElementsByTagName('amplif_factor');
		textureInfo['amplif_factor'] = [this.reader.getFloat(amplif_factor[0], 's', 1), this.reader.getFloat(amplif_factor[0], 't', 1)];

		var newTexture = new Texture(this.scene, textureInfo['path'], textureInfo['id']);
		newTexture.setAmpFactor(textureInfo['amplif_factor'][0],textureInfo['amplif_factor'][0])

		this.scene.textures.push(newTexture);
	}

	return 0;
};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	
	var materialsTag = rootElement.getElementsByTagName('MATERIALS');

	if(materialsTag == null) {
	return "MATERIALS tag is missing.";
	}

	var materials = materialsTag[0].getElementsByTagName('MATERIAL');
	if(materials == null) {
		return "No MATERIAL was added.";
	}

	var material = [];
	var i;

	for(i = 0; i < materials.length; i++) {
		material['id'] = this.reader.getString(materials[i], 'id', 1);

		var shininess = materials[i].getElementsByTagName('shininess');
		material['shininess'] = this.reader.getFloat(shininess[0], 'value', 1);

		var specular = materials[i].getElementsByTagName('specular');
		material['specular'] = [this.reader.getFloat(specular[0], 'r', 1), this.reader.getFloat(specular[0], 'g', 1), this.reader.getFloat(specular[0], 'b', 1), this.reader.getFloat(specular[0], 'a', 1)];
	
		var diffuse = materials[i].getElementsByTagName('diffuse');
		material['diffuse'] = [this.reader.getFloat(diffuse[0], 'r', 1), this.reader.getFloat(diffuse[0], 'g', 1), this.reader.getFloat(diffuse[0], 'b', 1), this.reader.getFloat(diffuse[0], 'a', 1)];
	
		var ambient = materials[i].getElementsByTagName('ambient');
		material['ambient'] = [this.reader.getFloat(ambient[0], 'r', 1), this.reader.getFloat(ambient[0], 'g', 1), this.reader.getFloat(ambient[0], 'b', 1), this.reader.getFloat(ambient[0], 'a', 1)];
	
		var emission = materials[i].getElementsByTagName('emission');
		material['emission'] = [this.reader.getFloat(emission[0], 'r', 1), this.reader.getFloat(emission[0], 'g', 1), this.reader.getFloat(emission[0], 'b', 1), this.reader.getFloat(emission[0], 'a', 1)];
	
		var newMaterial = new Material(this.scene,material['id']);
		newMaterial.setAppearance(material['shininess'],material['specular'],material['diffuse'],material['ambient'],material['emission']);
		this.scene.materials.push(newMaterial);
	}

	return 0;
};

MySceneGraph.prototype.parseLeaves= function(rootElement) {
	var leavesTag = rootElement.getElementsByTagName('LEAVES');
	if(leavesTag == null){
		return "LEAVES tag is missing.";
	}

	var leaves = leavesTag[0].getElementsByTagName('LEAF');
	if(leaves == null){
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

	return 0;
};

MySceneGraph.prototype.parseNodes= function(rootElement) {
	var nodesTag = rootElement.getElementsByTagName('NODES');
	if(nodesTag == null){
		return "NODES tag is missing.";
	}

	var root = nodesTag[0].getElementsByTagName('ROOT');
	if(root == null){
		return "ROOT tag is missing.";
	}
	
	this.rootID = this.reader.getString(root[0], 'id', 1);

	var nodes = nodesTag[0].getElementsByTagName('NODE');
	if(nodes == null){
		return "No NODE was added.";
	}

	var i;
	for(i = 0; i < nodes.length; i++){
		this.readNode(nodes[i]);
	}

};

MySceneGraph.prototype.readNode = function(nodeTag) {

	node = [];

	node['id'] = this.reader.getString(nodeTag, 'id', 1);
	
	var allAtributes = nodeTag.getElementsByTagName('*');
	node['materialID'] = this.reader.getString(allAtributes[0], 'id', 1);
	node['textureID'] = this.reader.getString(allAtributes[1], 'id', 1);
	
	if(nodeTag.getElementsByTagName('DESCENDANTS') == null){
		return "DESCENDANTS tag is missing.";
	}
	var descendants = nodeTag.getElementsByTagName('DESCENDANT');
	
	var k, desc = [];
	for(k=0; k < descendants.length;k++){
		desc.push(this.reader.getString(descendants[k], 'id', 1));
	}


	var numTransformations = allAtributes.length - (2 + 1);
	var mat = mat4.create();
	this.readNodeTransformations(numTransformations, allAtributes, mat);

	var newNode = new Node(node['id'], node['materialID'], node['textureID'], mat, desc);

	this.XMLnodes.push(newNode);
}

MySceneGraph.prototype.readNodeTransformations = function(numTransformations, allAtributes, mat) {

	for(j = 0; j < numTransformations; j++){

		if(allAtributes[j + 2].tagName == 'TRANSLATION')
		{
			var x,y,z;
			x= this.reader.getFloat(allAtributes[j + 2], 'x', 1);
			y= this.reader.getFloat(allAtributes[j + 2], 'y', 1);
			z= this.reader.getFloat(allAtributes[j + 2], 'z', 1);

			mat4.translate(mat,mat,[x,y,z]);
		}
		else if(allAtributes[j + 2].tagName == 'ROTATION')
		{
			var axis,angle;

			if(this.reader.getString(allAtributes[j + 2], 'axis', 1) == 'x')
				axis= new Array(1,0,0);
			else if(this.reader.getString(allAtributes[j + 2], 'axis', 1) == 'y')
				axis= new Array(0,1,0);
			else if(this.reader.getString(allAtributes[j + 2], 'axis', 1) == 'z')
					axis= new Array(0,0,1);
			else return "Error on node id: "+node['id']+" rotation AXIS!!";

			angle = this.reader.getFloat(allAtributes[j + 2],'angle',1);

			mat4.rotate(mat,mat,Math.PI*angle/180,axis);
		}
		else if(allAtributes[j + 2].tagName == 'SCALE')
		{
			var array = new Array();
			array.push(this.reader.getFloat(allAtributes[j + 2], 'sx', 1));
			array.push(this.reader.getFloat(allAtributes[j + 2], 'sy', 1));
			array.push(this.reader.getFloat(allAtributes[j + 2], 'sz', 1)); 

			mat4.scale(mat,mat,array);
		}
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


