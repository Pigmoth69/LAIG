
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

	var info = rootElement.getElementsByTagName('frustum');
	var frustum = info[0];
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

	console.log("frustum: " + this.reader.getInteger(frustum, 'near', 1) + ", " + this.reader.getInteger(frustum, 'far', 1));
	console.log("translate: " + this.reader.getInteger(translate, 'x', 1) + ", " + this.reader.getInteger(translate, 'y', 1) + ", " + this.reader.getInteger(translate, 'z', 1));
	console.log("rotation: " + this.reader.getInteger(rotationX, 'angle', 1) + ", " + this.reader.getInteger(rotationY, 'angle', 1) + ", " + this.reader.getInteger(rotationZ, 'angle', 1))
	console.log("scale: " + this.reader.getInteger(scale, 'sx', 1) + ", " + this.reader.getInteger(scale, 'sy', 1) + ", " + this.reader.getInteger(scale, 'sz', 1));
	console.log("reference: " + this.reader.getInteger(reference, 'length', 1));
	
};
	
/*
 * var to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


