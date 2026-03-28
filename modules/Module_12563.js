/**
 * Netflix Cadmium Playercore - Module 12563
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: dDa
 */

// Webpack module 12563
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.oc = f;
}
export const dDa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(42207);  // import from Module_42207
g = a(5021);  // import from Module_05021
d.prototype.L_c = function(f, e) {
    var h, k;
    h = parseFloat(f);
    k = 0;
    "%" === f[f.length - 1] && this.oc.mp(h) ? k = Math.round(h * e.na(g.Ba) / 100) : (f = parseInt(f),
    this.oc.O9(f) && (k = f));
    return (0,
    g.pc)(Math.min(k, e.na(g.Ba)));
}
;
a = d;
export const dDa = a;
b.dDa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Zi))],

// Detected exports: dDa
