/**
 * Netflix Cadmium Playercore - Module 28296
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: gnb
 */

// Webpack module 28296
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k;
export const gnb = undefined;
d = a(22970);  // import from Module_22970
t = a(80477);  // import from Module_80477
p = a(36332);  // import from Module_36332
c = d.__importDefault(a(42979));
g = a(2479);  // import from Module_02479
f = d.__importDefault(a(24571));
e = d.__importDefault(a(36114));
h = d.__importDefault(a(10690));
k = a(97962);  // import from Module_97962
a = (function(l) {
    function m(n) {
        var q;
        q = l.call(this, p.dG.NONE) || this;
        q.usb = n;
        return q;
    }
    d.__extends(m, l);
    m.prototype.Y$ = function(n, q) {
        c.default(q, function() {
            return g.gNb(n);
        });
    }
    ;
    m.prototype.WA = function(n, q) {
        if (!(q instanceof g.vLa))
            throw new h.default("Incorrect authentication data type " + q + ".");
        n = q.nE();
        if (this.usb.KDc(n))
            throw new f.default(e.default.icb,"none " + n).fg(q);
        return new k.Phb();
    }
    ;
    return m;
}
)(t.UEa);
b.gnb =

// Detected exports: gnb
