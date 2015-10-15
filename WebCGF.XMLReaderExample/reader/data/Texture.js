function Texture(scene, path, id) {
    CGFtexture.call(this, scene, path);
    this.id = id;
    this.amplifyFactor={ampS:1,
    					ampT:1
    };
};

Texture.prototype = Object.create(CGFtexture.prototype);
Texture.prototype.constructor = Texture;

Texture.prototype.setAmpFactor = function(s, t) {
   this.amplifyFactor.ampS = s;
   this.amplifyFactor.ampT = t;
}