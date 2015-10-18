
function Light(scene,index,id,enable) {
    CGFlight.call(this,scene, index);
    this.id = id;
    this.enabled = enable;
}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;

