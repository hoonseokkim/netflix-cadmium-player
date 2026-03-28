/**
 * Netflix Cadmium Playercore - Module 21506
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 21506
// Parameters: t (module), b (exports), a (require)

var p;
function d() {
    this.ps = undefined;
    this.IK = 0;
}
p = a(17267);  // import from Module_17267
d.prototype.start = function() {}
;
d.prototype.stop = function() {}
;
d.prototype.add = function() {}
;
d.prototype.getState = function() {
    return 0 !== this.IK && this.ps ? {
        p25: this.ps.Xw,
        p50: this.ps.ft,
        p75: this.ps.Yw,
        c: this.IK
    } : null;
}
;
d.prototype.Jg = function(c) {
    if (!(!p.Ad(c) && p.has(c, "p25") && p.has(c, "p50") && p.has(c, "p75") && p.has(c, "c") && p.isFinite(c.p25) && p.isFinite(c.p50) && p.isFinite(c.p75) && p.isFinite(c.c)))
        return (this.ps = undefined,
        this.IK = 0,
        false);
    this.ps = {
        Xw: c.p25,
        ft: c.p50,
        Yw: c.p75
    };
    this.IK = c.c;
}
;
d.prototype.get = function() {
    return {
        dF: this.ps,
        Kl: this.IK,
        uwa: undefined
    };
}
;
d.prototype.set = function(c, g) {
    this.ps = c;
    this.IK = g;
}
;
d.prototype.reset = function() {
    this.ps = undefined;
    this.IK = 0;
}
;
d.prototype.toString = function() {
    return "IQRHist(" + this.ps + "," + this.IK + ")";
}
;
t.exports =

