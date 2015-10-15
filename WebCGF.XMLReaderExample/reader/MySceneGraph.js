
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

	if(rootElement.getElementsByTagName('INITIALS') == null){
		return "INITIALS element is missing.";
	}

	//var info = rootElement.getElementsByTagName('frustum');
	var frustum = (rootElement.getElementsByTagName('frustum'))[0];
	if(frustum == null) {
		return "frustum tag is missing.";
	}
	
	info = rootElement.getElementsByTagName('translation');
	var translation = info[0];
	if(translation == null) {
		return "translation tag is missing.";
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
	var initialFrustum={near:0,far:0};
	var initialTranslation = new vec3.create();
	var initialScale = new vec3.create();
	var refLength;
	initialFrustum.near= this.reader.getInteger(frustum, 'near', 1);
	initialFrustum.far = this.reader.getInteger(frustum, 'far', 1);

	initialTranslation[0]= this.reader.getFloat(translation, 'x', 1) ;
	initialTranslation[1]= this.reader.getFloat(translation, 'y', 1) ;
	initialTranslation[2]= this.reader.getFloat(translation, 'z', 1) ;

	rotationX= this.reader.getFloat(rotationX, 'angle', 1);
	rotationY= this.reader.getFloat(rotationY, 'angle', 1);
	rotationZ= this.reader.getFloat(rotationZ, 'angle', 1);

	initialScale[0]= this.reader.getFloat(scale, 'sx', 1);
	initialScale[1]= this.reader.getFloat(scale, 'sy', 1);
	initialScale[2]= this.reader.getFloat(scale, 'sz', 1);

	reference = this.reader.getFloat(reference, 'length', 1);

	this.LSXinitials.setFrustum(initialFrustum.near,initialFrustum.far);
	this.LSXinitials.translateMatrix(initialTranslation);
	this.LSXinitials.rotateMatrix('x',rotationX);
	this.LSXinitials.rotateMatrix('y',rotationY);
	this.LSXinitials.rotateMatrix('z',rotationZ);
	this.LSXinitials.scaleMatrix(initialScale);
	this.LSXinitials.setReferenceLength(reference);
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

	var background = [];
	var finalAmbient = [];	

	background[0] = this.reader.getFloat(backgroundColor, 'r', 1);
	background[1] = this.reader.getFloat(backgroundColor, 'g', 1);
	background[2] = this.reader.getFloat(backgroundColor, 'b', 1);
	background[3] = this.reader.getFloat(backgroundColor, 'a', 1);

	finalAmbient[0] = this.reader.getFloat(ambient, 'r', 1);;
	finalAmbient[1] = this.reader.getFloat(ambient, 'g', 1);;
	finalAmbient[2] = this.reader.getFloat(ambient, 'b', 1);
	finalAmbient[3] = this.reader.getFloat(ambient, 'a', 1);;

	this.LSXillumination.setBackground(background);
	this.LSXillumination.setAmbient(finalAmbient);

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
		return 0;
	}

	var texture = [];
	var i;

	for(i = 0; i < info.length; i++) {
		texture['id'] = this.reader.getString(info[i], 'id', 1);

		var file = info[i].getElementsByTagName('file');
		texture['path'] = this.reader.getString(file[0], 'path', 1);
		

		var amplif_factor = info[i].getElementsByTagName('amplif_factor');
		texture['amplif_factor'] = [this.reader.getFloat(amplif_factor[0], 's', 1), this.reader.getFloat(amplif_factor[0], 't', 1)];

		var newTexture;
		newTexture = new Texture(this.scene, texture['path'], texture['id']);
		newTexture.setAmpFactor(texture['amplif_factor'][0],texture['amplif_factor'][0])

		this.scene.textures.push(newTexture);

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
	
		var newMaterial = new Material(this.scene,material['id']);
		newMaterial.setAppearance(material['shininess'],material['specular'],material['diffuse'],material['ambient'],material['emission']);
		this.scene.materials.push(newMaterial);
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

	return 0;
};

MySceneGraph.prototype.parseNodes= function(rootElement) {
	var info;
	if((info = rootElement.getElementsByTagName('NODES')) == null){
		return "NODES tag is missing.";
	}

	var root = info[0].getElementsByTagName('ROOT');
	if(root[0] == null){
		return "ROOT tag is missing.";
	}
	
	this.rootID =this.reader.getString(root[0],'id',1);


	var nodes = info[0].getElementsByTagName('NODE');
	if(nodes[0] == null){
		return "No NODE was added.";
	}


	var i,k, node = [];
	for(i = 0; i < nodes.length; i++){
		node['id'] = this.reader.getString(nodes[i], 'id', 1);
		
		var all = nodes[i].getElementsByTagName('*');
		node['materialID'] = this.reader.getString(all[0], 'id', 1);
		node['textureID'] = this.reader.getString(all[1], 'id', 1);
		
		//obtem descendentes
		if(nodes[i].getElementsByTagName('DESCENDANTS') == null){
			return "DESCENDANTS tag is missing.";
		}
		var descendants = nodes[i].getElementsByTagName('DESCENDANT');
		//falta ciclo 'for' para inserir os diferentes id's dos descendentes
		
		var desc = [];
		for(k=0; k < descendants.length;k++){
			desc.push(this.reader.getString(descendants[k], 'id', 1));
		}


		var numTransformations = all.length - (2 + 1  /*descendants.length*/);
		var j, transformations = [];
		var mat = mat4.create();

		for(j = 0; j < numTransformations; j++){
			if(all[j + 2].tagName == 'TRANSLATION')
			{
				var x,y,z;
				x= this.reader.getFloat(all[j + 2], 'x', 1);
				y= this.reader.getFloat(all[j + 2], 'y', 1);
				z= this.reader.getFloat(all[j + 2], 'z', 1);

				mat4.translate(mat,mat,[x,y,z]);
			}
			else if(all[j + 2].tagName == 'ROTATION')
			{
				var axis,angle;

				if(this.reader.getString(all[j + 2], 'axis', 1) == 'x')
					axis= new Array(1,0,0);
				else if(this.reader.getString(all[j + 2], 'axis', 1) == 'y')
					axis= new Array(0,1,0);
				else if(this.reader.getString(all[j + 2], 'axis', 1) == 'z')
						axis= new Array(0,0,1);
				else return "Error on node id: "+node['id']+" rotation AXIS!!";

				angle = this.reader.getFloat(all[j + 2],'angle',1);

				mat4.rotate(mat,mat,Math.PI*angle/180,axis);
			}
			else if(all[j + 2].tagName == 'SCALE')
			{
				var array = new Array();
				array.push(this.reader.getFloat(all[j + 2], 'sx', 1));
				array.push(this.reader.getFloat(all[j + 2], 'sy', 1));
				array.push(this.reader.getFloat(all[j + 2], 'sz', 1)); 

				mat4.scale(mat,mat,array);
			}

		}

		var newNode = new Node(node['id'], node['materialID'], node['textureID'], mat, desc);

		this.XMLnodes.push(newNode);

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


