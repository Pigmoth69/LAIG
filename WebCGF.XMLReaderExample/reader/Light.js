
function Light(id,enable,position,ambient,diffuse,specular) {
    CGFlight.call(this);
    this.id =id;
    this.enable = enable;
    this.position = position;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular; 
}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;


Light.prototype.init = function (application) {
    CGFlight.prototype.init.call(this, application);   
};