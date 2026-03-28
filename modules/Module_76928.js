/**
 * Netflix Cadmium Playercore - Module 76928
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: PDa
 */

// Webpack module 76928
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e, h) {
    this.is = e;
    this.hg = h;
}
export const PDa = undefined;
t = a(22970);  // import from Module_22970
c = a(22674);  // import from Module_22674
g = a(42207);  // import from Module_42207
a = a(74870);  // import from Module_74870
d.prototype.encode = function(e) {
    var h, k;
    h = this;
    k = "";
    this.hg.$R(e, function(l, m) {
        l = h.Oyb(l) + "=" + h.Oyb(m);
        k = k ? k + ("," + l) : l;
    });
    return k;
}
;
d.prototype.Oyb = function(e) {
    return this.is.p_(e) ? this.is.mp(e) ? "" + e : this.is.du(e) ? (e = e.replace(p.FPb, this.A_a.bind(this)),
    !p.oSc.test(e) && p.rKc.test(e) && (e = '"' + e + '"'),
    e) : this.is.Fna(e) ? "" + e : this.is.XNa(e) ? "NaN" : "" : "";
}
;
d.prototype.A_a = function(e) {
    return p.map[e];
}
;
f = p = d;
export const PDa = f;
f.map = {
    '"': '""',
    "\r": "",
    "\n": " "
};
f.FPb = /(?!^.+)["\r\n](?=.+$)/g;
f.oSc = /["].*["]/g;
f.rKc = /[", ]/;
b.PDa = f = p = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(g.Zi)), t.__param(1, (0,
c.v)(a.Um))],

// Detected exports: PDa
