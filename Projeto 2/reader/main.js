//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 

serialInclude(['../lib/CGF.js', './parser/LSXscene.js','./parser/LSXreader.js','./parser/Interface.js',
               './parser/LinearAnimation.js', './parser/CircularAnimation.js', './parser/ControlPoint.js',
               './parser/Light.js','./parser/Texture.js','./parser/Node.js','./parser/Material.js',
               './parser/Initials.js', './parser/Illumination.js','./parser/Graph.js',
               './primitives/MyRectangle.js', './primitives/MyCylinder.js', './primitives/MySphere.js',
               './primitives/MyTriangle.js', './primitives/MyPlane.js', './primitives/MyPatch.js', './primitives/MyTerrain.js','./primitives/MyVehicle.js',,
 
main=function()
{
  var app = new CGFapplication(document.body);
  var myScene = new LSXscene();
  var myInterface = new Interface(myScene);

  app.init();

  app.setInterface(myInterface);
  app.setScene(myScene);

  myScene.setInterface(myInterface);
  myInterface.setScene(myScene);

  myInterface.setActiveCamera(myScene.camera);

	var filename=getUrlVars()['file'] || "teste.lsx";

	var myGraph = new LSXreader(filename, myScene);
	
  app.run();
}

]);