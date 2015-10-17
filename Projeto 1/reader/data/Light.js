
function Light(scene,indice,id,enable) {
	this.indice = indice;
    this.id = id;
    this.enabled = enable;
}

Light.prototype = Object.create(Object.prototype);
Light.prototype.constructor = Light;

