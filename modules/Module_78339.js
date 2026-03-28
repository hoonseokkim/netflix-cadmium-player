/**
 * Netflix Cadmium Playercore - Module 78339
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: WIa, QIa, RIa
 */

// Webpack module 78339
// Parameters: t (module), b (exports), a (require)

var g, f, e, h;
function d() {}
function p(k) {
    this.ROc = k;
}
function c(k) {
    this.TOc = k;
}
export const WIa = b.RIa = b.QIa = undefined;
t = a(22970);  // import from Module_22970
g = a(22674);  // import from Module_22674
f = a(36258);  // import from Module_36258
e = a(31149);  // import from Module_31149
h = a(36129);  // import from Module_36129
c.prototype.validate = function(k) {
    k.map(this.TOc.validate);
}
;
a = c;
export const QIa = a;
b.QIa = a = t.__decorate([(0,
g.aa)(), t.__param(0, (0,
g.v)(f.Zib))], a);
p.prototype.validate = function(k) {
    this.ROc.validate(k.data);
}
;
a = p;
export const RIa = a;
b.RIa = a = t.__decorate([(0,
g.aa)(), t.__param(0, (0,
g.v)(f.Vib))], a);
d.prototype.validate = function(k) {
    var l;
    k.Ia && "string" === typeof k.Ia ? k.href && "string" === typeof k.href ? k.o3 && "string" === typeof k.o3 || (l = "ProfileId value is corrupted.") : l = "Href value is corrupted." : l = "Xid value is corrupted.";
    if (l)
        throw new e.we(h.ea.cK,h.Y.xja,undefined,undefined,undefined,l,undefined,k.Ia);
}
;
f = d;
export const WIa = f;
b.WIa = f = t.__decorate([(0,
g.aa)()],

// Detected exports: WIa, QIa, RIa
