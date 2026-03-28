/**
 * Netflix Cadmium Playercore - Module 74429
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: mLa
 */

// Webpack module 74429
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h) {
    return c.Yf.call(this, h, "TransportConfigImpl") || this;
}
export const mLa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(64174);  // import from Module_64174
g = a(83767);  // import from Module_83767
f = a(12501);  // import from Module_12501
e = a(34231);  // import from Module_34231
Ia(d, c.Yf);
d.prototype.rV = function(h) {
    var k, l;
    k = this.OO;
    l = this.vrb;
    switch (h) {
    case e.ZC.KX:
        return k;
    case e.ZC.Ujb:
        return k && !l;
    case e.ZC.L3b:
        return false;
    }
}
;
Ha.Object.defineProperties(d.prototype, {
    OO: {
        configurable: true,
        enumerable: true,
        get: function() {
            return true;
        }
    },
    vrb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return false;
        }
    }
});
a = d;
export const mLa = a;
t.__decorate([f.config(f.zd, "usesMsl")], a.prototype, "OO", null);
t.__decorate([f.config(f.zd, "allowRequestsWithoutMsl")], a.prototype, "vrb", null);
b.mLa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.gp))],

// Detected exports: mLa
