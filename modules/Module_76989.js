/**
 * Netflix Cadmium Playercore - Module 76989
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: SGa
 */

// Webpack module 76989
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
function d(l, m, n) {
    this.$a = l;
    this.Ct = m;
    this.e_a = n;
}
export const SGa = undefined;
t = a(22970);  // import from Module_22970
p = a(29045);  // import from Module_29045
c = a(22674);  // import from Module_22674
g = a(51742);  // import from Module_51742
f = a(81918);  // import from Module_81918
e = a(36410);  // import from Module_36410
h = a(87386);  // import from Module_87386
k = a(98895);  // import from Module_98895
d.prototype.zb = function(l, m, n, q, r) {
    n = undefined === n ? this.Ct : n;
    return m ? new g.tjb(this.$a,this.e_a,n,m,l) : r ? new k.o$a(this.$a,this.e_a,n,l,q || "",r) : new p.nX(this.$a,this.e_a,n,l);
}
;
a = d;
export const SGa = a;
b.SGa = a = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(f.re)), t.__param(1, (0,
c.v)(e.oX)), t.__param(2, (0,
c.v)(h.Xfb))],

// Detected exports: SGa
