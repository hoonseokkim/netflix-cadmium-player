/**
 * Netflix Cadmium Playercore - Module 26305
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: zHa
 */

// Webpack module 26305
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.Jh = f;
    this.LT = {};
    this.va = this.Jh.zb("MemoryStorage");
}
export const zHa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(36129);  // import from Module_36129
a = a(87386);  // import from Module_87386
d.prototype.load = function(f) {
    var e;
    if (this.LT.hasOwnProperty(f)) {
        e = this.LT[f];
        this.va.debug("Storage entry loaded", {
            key: f
        });
        return Promise.resolve({
            key: f,
            value: e
        });
    }
    this.va.debug("Storage entry not found", {
        key: f
    });
    return Promise.reject({
        Ya: c.Y.tG
    });
}
;
d.prototype.save = function(f, e, h) {
    if (h && this.LT.hasOwnProperty(f))
        return Promise.resolve(false);
    this.LT[f] = e;
    return Promise.resolve(true);
}
;
d.prototype.remove = function(f) {
    delete this.LT[f];
    return Promise.resolve();
}
;
d.prototype.loadAll = function() {
    var f;
    f = Object.entries(this.LT).map(function(e) {
        var h;
        h = Fa(e);
        e = h.next().value;
        h = h.next().value;
        return {
            key: e,
            value: h
        };
    });
    return Promise.resolve(f);
}
;
d.prototype.removeAll = function() {
    this.LT = {};
    return Promise.resolve();
}
;
g = d;
export const zHa = g;
b.zHa = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.Bb))],

// Detected exports: zHa
