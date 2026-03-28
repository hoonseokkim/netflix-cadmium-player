/**
 * Netflix Cadmium Playercore - Module 20596
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 20596
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f, e, h) {
    p.call(this, e, h);
    this.nD = new c(g);
    this.m9b = f;
}
p = a(72697).j6;
c = a(16514);  // import from Module_16514
d.prototype = Object.create(p.prototype);
d.prototype.shift = function() {
    var g;
    g = this.mr(0);
    p.prototype.shift.call(this);
    null !== g && this.nD.$G(g);
    return g;
}
;
d.prototype.flush = function() {
    var g;
    g = this.get();
    this.nD.$G(g);
    p.prototype.reset.call(this);
    return g;
}
;
d.prototype.get = function() {
    var g;
    g = this.gca();
    return {
        sampleSize: this.oca(),
        dF: g,
        uwa: g.ft ? (g.Yw - g.Xw) / g.ft : undefined
    };
}
;
d.prototype.oca = function() {
    return this.nD.oca();
}
;
d.prototype.gca = function() {
    return this.nD.oca() < this.m9b ? {
        Xw: undefined,
        ft: undefined,
        Yw: undefined,
        sampleSize: undefined,
        kk: undefined
    } : {
        Xw: this.nD.w$(25),
        ft: this.nD.w$(50),
        Yw: this.nD.w$(75),
        sampleSize: this.nD.oca(),
        kk: this.nD.w$.bind(this.nD)
    };
}
;
d.prototype.toString = function() {
    return "biqr(" + this.M$b + "," + this.C7b + "," + this.L$b + ")";
}
;
t.exports = {
    LZb: d

