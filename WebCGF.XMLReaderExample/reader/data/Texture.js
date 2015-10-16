function Texture(scene, path, id) {
    CGFappearance.call(this, scene);
    this.loadTexture(path);
    this.id = id;
    this.amplifyFactor={ampS:1,
    					ampT:1
    };
};

Texture.prototype = Object.create(CGFappearance.prototype);
Texture.prototype.constructor = Texture;

Texture.prototype.setAmpFactor = function(s, t) {
   this.amplifyFactor.ampS = s;
   this.amplifyFactor.ampT = t;
}