/**
 * Netflix Cadmium Playercore - Module 52657
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Aeb
 */

// Webpack module 52657
// Parameters: t (module), b (exports), a (require)

var p;
function d(c, g, f, e, h) {
    this.version = c;
    this.mU = g;
    this.C6a = f;
    this.Ht = e;
    this.dia = h;
    this.vz = new p.Beb(c,g,f,e,h);
    this.As = [];
}
export const Aeb = undefined;
p = a(14494);  // import from Module_14494
d.prototype.load = function(c) {
    var g;
    g = this;
    return this.vz.load(c).then(function() {
        var f;
        g.As = null !== (f = g.vz.As) && undefined !== f ? f : [];
    });
}
;
d.prototype.add = function(c) {
    this.As.push(c);
    return this.vz.set(this.As);
}
;
d.prototype.remove = function(c, g) {
    c = this.yBb(this.Gba(c, g));
    return 0 <= c ? (this.As.splice(c, 1),
    this.vz.set(this.As)) : Promise.resolve();
}
;
d.prototype.update = function(c, g) {
    g = this.yBb(this.Gba(c, g));
    return 0 <= g ? (this.As[g] = c,
    this.vz.set(this.As)) : Promise.resolve();
}
;
d.prototype.Gba = function(c, g) {
    for (var f = 0; f < this.As.length; ++f)
        if (g(this.As[f], c))
            return this.As[f];
}
;
d.prototype.yBb = function(c) {
    return c ? this.As.indexOf(c) : -1;
}
;
b.Aeb =

// Detected exports: Aeb
