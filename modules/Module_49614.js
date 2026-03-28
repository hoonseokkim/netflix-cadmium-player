/**
 * Netflix Cadmium Playercore - Module 49614
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 49614
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n, q, r, u, v;
function d(w, x, y, A, z, B) {
    var C, D, E;
    C = l.KHa.call(this) || this;
    D = new k.ehb([r.UJ.rGa],null,null);
    E = new f.Ukb();
    E.Rac(x, y);
    A[e.dG.MX] = new g.Tkb(null,E);
    x = {};
    x[u.sma.zEa] = new p.wcb();
    x[v.gla.PHa] = new c.zhb();
    y = new q.ybb();
    E = new n.Pab();
    C.rna = E;
    C.EG = D;
    C.Og = y;
    C.lQ = z;
    C.i8b = A;
    C.F$b = x;
    C.S8b = B;
    C.Zm = w;
    return C;
}
p = a(25606);  // import from Module_25606
c = a(79925);  // import from Module_79925
g = a(18089);  // import from Module_18089
f = a(88774);  // import from Module_88774
e = a(36332);  // import from Module_36332
h = a(75948);  // import from Module_75948
k = a(68480);  // import from Module_68480
l = a(38470);  // import from Module_38470
m = a(31809);  // import from Module_31809
n = a(48603);  // import from Module_48603
q = a(30370);  // import from Module_30370
r = a(51411);  // import from Module_51411
u = a(91331);  // import from Module_91331
v = a(32256);  // import from Module_32256
Ia(d, l.KHa);
d.prototype.getTime = function() {
    return Date.now();
}
;
d.prototype.jDb = function() {
    return new m.zkb();
}
;
d.prototype.nsa = function(w) {
    w.result(this.lQ);
}
;
d.prototype.zwc = function(w) {
    return e.default.pca(w);
}
;
d.prototype.osa = function(w) {
    return this.i8b[w];
}
;
d.prototype.hAc = function(w) {
    return u.default.pca(w);
}
;
d.prototype.ODb = function(w) {
    return this.F$b[w];
}
;
d.prototype.jCb = function(w) {
    return h.default.pca(w);
}
;
d.prototype.IVa = function(w) {
    return this.S8b.filter(function(x) {
        return x.scheme == w;
    })[0];
}
;
b["default"] =

