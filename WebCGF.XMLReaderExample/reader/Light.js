
function Light(scene,indice,id,enable,position,ambient,diffuse,specular) {
    CGFlight.call(this, scene, indice);

    this.id =id;
    this.setPosition(position[0],position[1],position[2],position[3]);
    this.setAmbient(ambient[0],ambient[1],ambient[2],ambient[3]);
    this.setDiffuse(diffuse[0],diffuse[1],diffuse[2],diffuse[3]);
    this.setSpecular(specular[0],specular[1],specular[2],specular[3]);
    this.enabled = enable;

}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;

