/**
 * Netflix Cadmium Playercore - Module 25837
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Data parsing / serialization
 * Exports: oLa
 */

// Webpack module 25837
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d() {}
export const oLa = undefined;
t = a(22970);  // import from Module_22970
c = a(70834);  // import from Module_70834
a = a(22674);  // import from Module_22674
d.prototype.parse = function(f) {
    var e, h;
    if (!f)
        throw Error("invalid array buffer");
    e = new Uint8Array(f);
    h = new c.Tja(e);
    f = this.Axa(h);
    e = this.rOc(h, e, f);
    return {
        header: f,
        images: e
    };
}
;
d.prototype.Axa = function(f) {
    var e, h, k, l;
    if (f.lca() < this.MUc())
        throw Error("array buffer too short");
    p.egb.forEach(function(m) {
        if (m != f.hv())
            throw Error("BIF has invalid magic.");
    });
    e = f.t3();
    if (e > p.VERSION)
        throw Error("BIF version in unsupported");
    h = f.t3();
    if (0 == h)
        throw Error("BIF has no frames.");
    k = f.t3();
    l = f.Rn(p.tkb);
    return {
        version: e,
        wLc: h,
        cVb: k,
        vQb: l
    };
}
;
d.prototype.rOc = function(f, e, h) {
    var m, n;
    for (var k = [], l = 0; l <= h.wLc; l++) {
        m = {
            timestamp: f.t3(),
            offset: f.t3()
        };
        undefined != n && k.push(e.subarray(n.offset, m.offset));
        n = m;
    }
    return k;
}
;
d.prototype.MUc = function() {
    return p.egb.length + 4 + 4 + 4 + p.tkb;
}
;
g = p = d;
export const oLa = g;
g.egb = [137, 66, 73, 70, 13, 10, 26, 10];
g.VERSION = 0;
g.tkb = 44;
b.oLa = g = p = t.__decorate([(0,
a.aa)()],

// Detected exports: oLa
