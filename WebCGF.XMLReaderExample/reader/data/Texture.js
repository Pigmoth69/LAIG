function Texture(scene, path, id) {
    CGFtexture.call(this, path, url);
    this.id = id;
    this.amplifyFactor['s'] = 1;
    this.amplifyFactor['t'] = 1;
};

Texture.prototype = Object.create(CGFtexture.prototype);
Texture.prototype.constructor = Texture;

Texture.prototype.setAmpFactor = function(s, t) {
   this.amplifyFactor['s'] = s;
   this.amplifyFactor['t'] = t;
}