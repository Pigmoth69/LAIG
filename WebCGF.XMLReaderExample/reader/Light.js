
function Light(scene,indice,id,enable,position,ambient,diffuse,specular) {
    CGFlight.call(this, scene, indice);
    this.id =id;
    this.enable = enable;
    this.position = position;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular; 
}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;

